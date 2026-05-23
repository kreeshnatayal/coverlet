import { useState, useCallback, useRef } from 'react';
import { buildPrompt } from '../utils/promptBuilder';

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const API_URL = '/api/generate';

const LOADING_STEPS = [
  '📄 Analyzing your resume & job description',
  '🛡️ Running AI quality guardrails',
  '🎯 Formulating match strategy',
  '✍️ Writing your cover letter',
];

export function useGenerator() {
  const [status, setStatus]           = useState('idle'); // idle | loading | done | error
  const [outputText, setOutputText]   = useState('');
  const [rationaleText, setRationaleText] = useState('');
  const [matchScore, setMatchScore]   = useState(null);
  const [errorMsg, setErrorMsg]       = useState('');
  const [loadingStep, setLoadingStep] = useState(0);     // 0–3
  
  // Maintain conversation history for iterative refinement
  const messagesRef = useRef([]);

  const streamResponse = async (stepTimers, selectedModel = 'llama-3.3-70b-versatile') => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: messagesRef.current,
          temperature: 0.7,
          max_tokens: 1500,
          stream: true,
        }),
      });

      if (stepTimers) stepTimers.forEach(clearTimeout);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${response.status}`);
      }

      setStatus('done');
      setLoadingStep(3); // Fast forward to last step visually

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      
      let parsedRationale = '';
      let parsedLetter = '';
      let currentTag = ''; // 'RATIONALE' | 'LETTER' | ''

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;
          
          try {
            const data = JSON.parse(jsonStr);
            const delta = data?.choices?.[0]?.delta?.content || '';
            if (!delta) continue;
            
            fullText += delta;
            
            // Robust streaming XML tag parser
            const scoreMatch = fullText.match(/<SCORE>([\s\S]*?)(<\/SCORE>|$)/i);
            if (scoreMatch) {
              try {
                 const scoreJson = JSON.parse(scoreMatch[1].trim());
                 setMatchScore(scoreJson);
              } catch { /* Wait until JSON is fully streamed */ }
            }

            const rationaleMatch = fullText.match(/<RATIONALE>([\s\S]*?)(<\/RATIONALE>|$)/i);
            if (rationaleMatch) {
              setRationaleText(rationaleMatch[1].trim());
            }

            const letterMatch = fullText.match(/<LETTER>([\s\S]*?)(<\/LETTER>|$)/i);
            if (letterMatch && letterMatch[1].trim().length > 0) {
              setOutputText(letterMatch[1].trim());
            } else {
              const cleanedText = fullText
                .replace(/<ANALYSIS>[\s\S]*?(<\/ANALYSIS>|$)/i, '')
                .replace(/<SCORE>[\s\S]*?<\/SCORE>/i, '')
                .replace(/<RATIONALE>[\s\S]*?<\/RATIONALE>/i, '')
                .trim();
              setOutputText(cleanedText || fullText);
            }
          } catch { /* skip parsing errors for chunks */ }
        }
      }
      
      // Save assistant response to history
      messagesRef.current.push({ role: 'assistant', content: fullText });

    } catch (err) {
      if (stepTimers) stepTimers.forEach(clearTimeout);
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please check your API key.');
    }
  };

  const generate = useCallback(async ({ resume, jobDesc, tone, focus, length, pivotContext, metricContext, companyContext, model = 'llama-3.3-70b-versatile' }) => {
    setStatus('loading');
    setOutputText('');
    setRationaleText('');
    setMatchScore(null);
    setErrorMsg('');
    setLoadingStep(0);
    messagesRef.current = [];

    const stepTimers = LOADING_STEPS.map((_, i) =>
      setTimeout(() => setLoadingStep(i), i * 1500)
    );

    try {
      // 1. GUARDRAIL CHECK: Fast & cheap verification
      const guardrailPrompt = `Does the following text look like a resume or a job description? It does not need to be perfect, just not completely unrelated gibberish. Reply with ONLY "TRUE" if it looks valid, or "FALSE" if it is garbage. TEXT: ${resume.substring(0, 500)}`;
      
      const guardResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Fast model for guardrails
          messages: [{ role: 'user', content: guardrailPrompt }],
          temperature: 0,
          max_tokens: 10,
        }),
      });
      
      const guardData = await guardResponse.json();
      
      if (!guardResponse.ok) {
        throw new Error(guardData.error || `API error ${guardResponse.status}`);
      }
      
      const isValid = guardData?.choices?.[0]?.message?.content?.toUpperCase().includes('TRUE');
      
      if (!isValid) {
        stepTimers.forEach(clearTimeout);
        setStatus('error');
        setErrorMsg('Guardrail Error: The provided text does not appear to be a valid resume. Please try pasting an actual resume.');
        return;
      }

      // 2. MAIN GENERATION
      const prompt = buildPrompt({ resume, jobDesc, tone, focus, length, pivotContext, metricContext, companyContext });
      messagesRef.current = [{ role: 'user', content: prompt }];
      
      await streamResponse(stepTimers, model);

    } catch (err) {
      stepTimers.forEach(clearTimeout);
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please check your API key.');
    }
  }, []);
  
  const refine = useCallback(async (feedback) => {
    setStatus('loading');
    setLoadingStep(3); // Just show writing step
    
    const refinePrompt = `The user has requested the following change to the cover letter: "${feedback}". \n\nPlease rewrite the letter based on this feedback. Output exactly the same XML tags as before: <RATIONALE> explaining how you addressed their feedback, followed by <LETTER> with the new text.`;
    
    messagesRef.current.push({ role: 'user', content: refinePrompt });
    await streamResponse(null, 'llama-3.3-70b-versatile'); // Keep using the big model for refinement
  }, []);

  return { status, outputText, rationaleText, matchScore, errorMsg, loadingStep, generate, refine, LOADING_STEPS };
}

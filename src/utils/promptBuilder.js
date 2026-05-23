// Utility: Build the Gemini prompt from user inputs
export function buildPrompt({ resume, jobDesc, tone, focus, length, extra }) {
  const lengthMap = { concise: '150-200', standard: '300-380', detailed: '450-520' };
  const toneMap = {
    professional: 'formal, polished, and authoritative — suitable for corporate environments',
    confident: 'bold, assertive, and self-assured — leading with confidence and impact',
    conversational: 'warm, personable, and approachable — feels like a genuine conversation',
    creative: 'unique, memorable, and slightly unconventional — designed to stand out',
  };

  return `You are a world-class cover letter writer with 15 years of experience helping candidates land jobs at top companies. Your cover letters are known for being highly personalized, compelling, and strategically mapped to job requirements.

=== CANDIDATE RESUME ===
${resume}

=== JOB DESCRIPTION ===
${jobDesc}

=== WRITING INSTRUCTIONS ===
Write a professional cover letter following these specific guidelines:

**TONE**: ${toneMap[tone]}
**LENGTH**: ${lengthMap[length]} words
**STYLE**: Prose paragraphs only — no bullet points in the letter body
${focus.length > 0 ? `**EMPHASIS**: Particularly highlight the candidate's ${focus.join(', ')} as these are most relevant.\n` : ''}${extra ? `**SPECIAL CONTEXT**: ${extra}\n` : ''}
**STRUCTURE** (follow this precisely):
1. OPENING HOOK (1 paragraph): Start with a compelling, specific statement — NOT "I am writing to apply for...". Reference something specific about the company or role that shows genuine research.

2. VALUE PROPOSITION (1-2 paragraphs): Connect 2-3 of the candidate's strongest, most relevant achievements directly to the job requirements. Use concrete numbers and metrics where available. Mirror key language from the job description naturally (not robotically).

3. CULTURAL FIT (1 paragraph): Show genuine enthusiasm for THIS company specifically. Reference their mission, recent news, or values. Make it clear this isn't a generic letter.

4. CLOSING (1 paragraph): Confident, forward-looking close with a specific call to action. Express enthusiasm without desperation.

**CRITICAL RULES**:
- NEVER use these overused phrases: "I am writing to apply", "I believe I would be a great fit", "passion for", "team player", "hard worker", "detail-oriented", "dynamic"
- Every sentence must earn its place — cut anything generic
- Use active voice throughout
- If the resume lacks specific metrics, infer reasonable context from job titles and responsibilities
- The letter should feel like it was written BY the candidate, not a robot
- Do not output any markdown code blocks (e.g. no \`\`\`).

**OUTPUT FORMAT**:
You must output your response using EXACTLY these two XML tags in order:

<RATIONALE>
Write 2-3 short, bulleted sentences explaining your strategy. Why did you choose to emphasize specific skills? How did you adapt to the requested tone? This builds trust with the user.
</RATIONALE>

<LETTER>
The complete cover letter text goes here.
</LETTER>

Generate your response now:`;
}

// Utility: Build a human-readable prompt preview for the UI
export function buildPromptPreview({ tone, focus, length, extra }) {
  const lengthMap = { concise: '~200 words', standard: '~350 words', detailed: '~500 words' };
  const toneMap = {
    professional: 'formal and authoritative',
    confident: 'bold and assertive',
    conversational: 'warm and approachable',
    creative: 'unique and memorable',
  };

  let text = `You are an expert career coach and cover letter writer.\n\n`;
  text += `TASK: Write a tailored cover letter that maps the candidate's experience to the job requirements.\n\n`;
  text += `TONE: Write in a ${toneMap[tone] || '...'} style.\n`;
  text += `LENGTH: Target ${lengthMap[length] || '...'}\n`;
  if (focus.length > 0) text += `EMPHASIZE: ${focus.join(', ')}.\n`;
  if (extra) text += `SPECIAL CONTEXT: ${extra}\n`;
  text += `\nSTRUCTURE:\n1. Hook — open with a compelling statement\n2. Match — connect 2-3 specific achievements to JD requirements\n3. Why this company — show genuine interest\n4. Call to action — confident close\n\nINSTRUCTIONS:\n- Never use generic phrases like "I am writing to apply"\n- Mirror keywords from the job description naturally\n- Use active voice and concrete metrics where possible\n- Do NOT use bullet points in the letter`;
  return text;
}

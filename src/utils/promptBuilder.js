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
1. OPENING HOOK (1 paragraph): Answer which role you're applying for, why you're interested, and mention 1-2 relevant strengths. Show enthusiasm grounded in specifics. Do NOT use weak openings like "I am writing to apply for the position at your esteemed organization."
2. RELEVANT EXPERIENCE (1-2 paragraphs): Focus on relevance, not chronology. Choose 2-3 of the strongest experiences that directly match the JD. Do not walk through every job. Connect what the company needs (from JD) with what they've done (from resume).
3. WHY THIS COMPANY (1 paragraph): Show understanding of the company's product, mission, engineering culture, or industry. Keep this authentic and brief.
4. CLOSING (1 paragraph): End confidently, not passively. For example: "I’d welcome the opportunity to discuss how my experience in [X] could contribute to your [Y] team."

**CRITICAL RULES**:
- A strong cover letter is a targeted argument, NOT a summary of the resume. Do not simply restate the resume. Add motivation, context, and story.
- **MEASURABLE IMPACT**: Use concrete outcomes (e.g. "Reduced response time by 35%") rather than task lists ("Worked on APIs").
- **ATS-FRIENDLY KEYWORDS**: Incorporate required skills, methodologies, and domain keywords naturally. Do not keyword stuff.
- **AVOID OVERUSED PHRASES**: Never use "Hardworking team player", "Passionate self-starter", "Dynamic professional", "Esteemed organization", "I believe I would be a great fit".
- The letter must mirror the role requirements naturally without being robotic.
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

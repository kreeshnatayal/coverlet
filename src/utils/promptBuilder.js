// Utility: Build the Gemini prompt from user inputs
export function buildPrompt({ resume, jobDesc, tone, focus, length, pivotContext, metricContext, companyContext }) {
  const lengthMap = { concise: '150-200', standard: '300-380', detailed: '450-520' };
  const toneMap = {
    yc_startup: 'highly action-biased, low fluff, fast-paced, focusing on velocity, shipping, and extreme ownership. Sound like a scrappy, relentless builder.',
    big_tech_pm: 'framework-driven, analytical, scalable impact, structured thinking. Sound like you manage stakeholder chaos with data and clear roadmaps.',
    founder_office: 'high ambiguity tolerance, generalist execution, ownership, "get things done" mindset. Sound like you can tackle anything thrown at you.',
    consulting: 'highly structured, MECE (Mutually Exclusive, Collectively Exhaustive), client-facing, polished but deeply strategic.',
    design_first: 'user-centric, highly empathetic, polished, focusing on craftsmanship, user journeys, and pixel-perfect execution.',
    enterprise: 'risk-averse, team-oriented, highly formal and polished, focusing on compliance, scale, and cross-functional alignment.',
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
**STYLE**: Prose paragraphs only - no bullet points in the letter body
${focus.length > 0 ? `**EMPHASIS**: Particularly highlight the candidate's ${focus.join(', ')} as these are most relevant.\n` : ''}
${pivotContext ? `**CAREER PIVOT CONTEXT**: ${pivotContext}\n` : ''}
${metricContext ? `**KEY METRIC TO HIGHLIGHT**: ${metricContext}\n` : ''}
${companyContext ? `**WHY THIS COMPANY**: ${companyContext}\n` : ''}
**STRUCTURE** (follow this precisely):
1. OPENING HOOK (1 paragraph): Answer which role you're applying for, why you're interested, and mention 1-2 relevant strengths. Show enthusiasm grounded in specifics. Do NOT use weak openings like "I am writing to apply for the position at your esteemed organization."
2. RELEVANT EXPERIENCE (1-2 paragraphs): Focus on relevance, not chronology. Choose 2-3 of the strongest experiences that directly match the JD. Do not walk through every job. Connect what the company needs (from JD) with what they've done (from resume).
3. WHY THIS COMPANY (1 paragraph): Show understanding of the company's product, mission, engineering culture, or industry. Keep this authentic and brief.
4. CLOSING (1 paragraph): End confidently, not passively. For example: "I’d welcome the opportunity to discuss how my experience in [X] could contribute to your [Y] team."

**CRITICAL RULES**:
- A strong cover letter is a targeted argument, NOT a summary of the resume. Do not simply restate the resume. Add motivation, context, and story.
- **MEASURABLE IMPACT**: Use concrete outcomes (e.g. "Reduced response time by 35%") rather than task lists ("Worked on APIs").
- **NO HALLUCINATIONS**: NEVER invent numbers, metrics, titles, or experiences. Rely strictly on the provided resume. If the resume lacks metrics, focus on qualitative impact without fabricating numbers.
- **ATS-FRIENDLY KEYWORDS**: Incorporate required skills, methodologies, and domain keywords naturally. Do not keyword stuff.
- **AVOID OVERUSED PHRASES**: NEVER use words like "passionate", "ninja", "synergy", "highly motivated", "deeply interested", "hardworking team player", "dynamic professional", "esteemed organization", or "I believe I would be a great fit".
- The letter must mirror the role requirements naturally without being robotic.
- Do not output any markdown code blocks (e.g. no \`\`\`).

**OUTPUT FORMAT**:
You must output your response using EXACTLY these four XML tags in order. DO NOT skip the ANALYSIS block.

<ANALYSIS>
Create a 1:1 mapping table of Job Requirement -> Candidate Experience -> Output Sentence Idea.
This forces you to ground every claim in reality before writing.
</ANALYSIS>

<SCORE>
{"matchPercentage": 85, "matchedKeywords": ["keyword1", "keyword2", "keyword3"]}
</SCORE>

<RATIONALE>
Write 2-3 short, bulleted sentences explaining your strategy. Why did you choose to emphasize specific skills? How did you adapt to the requested tone? This builds trust with the user.
</RATIONALE>

<LETTER>
The complete cover letter text goes here.
</LETTER>

Generate your response now:`;
}

// Utility: Build a human-readable prompt preview for the UI
export function buildPromptPreview({ tone, focus, length, pivotContext, metricContext, companyContext }) {
  const lengthMap = { concise: '~200 words', standard: '~350 words', detailed: '~500 words' };
  const toneMap = {
    yc_startup: 'action-biased and fast-paced',
    big_tech_pm: 'framework-driven and analytical',
    founder_office: 'ambiguity-tolerant and ownership-driven',
    consulting: 'highly structured and MECE',
    design_first: 'user-centric and empathetic',
    enterprise: 'risk-averse and highly polished',
  };

  let text = `You are an expert career coach and cover letter writer.\n\n`;
  text += `TASK: Write a tailored cover letter that maps the candidate's experience to the job requirements.\n\n`;
  text += `TONE: Write in a ${toneMap[tone] || '...'} style.\n`;
  text += `LENGTH: Target ${lengthMap[length] || '...'}\n`;
  if (focus.length > 0) text += `EMPHASIZE: ${focus.join(', ')}.\n`;
  if (pivotContext) text += `CAREER PIVOT: ${pivotContext}\n`;
  if (metricContext) text += `KEY METRIC: ${metricContext}\n`;
  if (companyContext) text += `WHY THIS COMPANY: ${companyContext}\n`;
  text += `\nSTRUCTURE:\n1. Hook - open with a compelling statement\n2. Match - connect 2-3 specific achievements to JD requirements\n3. Why this company - show genuine interest\n4. Call to action - confident close\n\nINSTRUCTIONS:\n- Never use generic phrases like "I am writing to apply"\n- Mirror keywords from the job description naturally\n- Use active voice and concrete metrics where possible\n- Do NOT use bullet points in the letter`;
  return text;
}

export function buildIntelligencePrompt({ resume, jobDesc }) {
  return `You are an elite Silicon Valley Tech Recruiter and Hiring Manager with 20 years of experience screening candidates at Google, Sequoia-backed startups, and top consulting firms.
Analyze the provided resume against the job description. Do not sugarcoat. Be brutal, opinionated, and highly tactical.

=== RESUME ===
${resume}

=== JOB DESCRIPTION ===
${jobDesc}

=== OUTPUT FORMAT ===
Output ONLY valid JSON matching this exact schema. No markdown, no backticks, no explanation:
{
  "archetype": "2-4 word label classifying the candidate's profile (e.g. 'Scrappy Operator', 'Analytical Systems Thinker', 'Early-Stage Generalist', 'Deep Technical Builder')",
  "hiddenExpectations": "2-3 sentences decoding what the JD really means. Translate corporate buzzwords into actual day-to-day reality.",
  "strongFit": "2-3 sentences identifying the single strongest evidence match between the resume and a core JD requirement. Be specific - cite actual resume content.",
  "rejectionRisk": "2-3 sentences on the most critical gap that will cause rejection. Be blunt. Cite the specific JD requirement that is unmet.",
  "sixSecondImpression": "Exactly 1 sharp sentence: what a recruiter's brain concludes in the first 6 seconds of scanning this resume for this role.",
  "interviewProbability": <integer between 0 and 100 representing the realistic probability of getting an interview invite based on fit, gaps, and market competition>,
  "probabilityReason": "1 sharp sentence explaining the score. Cite the single biggest factor - positive or negative - that drives this number."
}`;
}

export function buildInterviewPrepPrompt({ resume, jobDesc, rejectionRisk }) {
  return `You are a senior interview coach who has helped candidates land jobs at top companies.
Based on the resume, job description, and the identified weakness below, generate exactly 5 high-probability interview questions this candidate will face.
Focus on probing the gaps and verifying the strengths. Make the questions specific to THIS role, not generic.

=== RESUME ===
${resume}

=== JOB DESCRIPTION ===
${jobDesc}

=== KNOWN CANDIDATE WEAKNESS ===
${rejectionRisk}

=== OUTPUT FORMAT ===
Output ONLY valid JSON. No markdown, no backticks, no explanation:
{
  "questions": [
    {
      "question": "The exact interview question they will likely be asked",
      "why": "1 sentence: why recruiters ask this for this specific role",
      "hint": "2-3 sentences: concrete guidance on how to answer it well, tailored to this candidate's background"
    }
  ]
}`;
}

export const config = {
  runtime: 'edge', // Edge runtime is faster for streaming and supports standard web APIs
};

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Simple in-memory rate limiting (Note: in Edge runtime, memory is per-isolate.
// This works well enough for a basic portfolio project defense against casual spam).
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false };
  }

  const record = rateLimitMap.get(ip);
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    return { limited: false };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { limited: true };
  }

  record.count += 1;
  return { limited: false };
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // 1. Check Rate Limit
  // Get IP from Vercel headers (x-real-ip or x-forwarded-for)
  const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || 'anonymous';
  const { limited } = checkRateLimit(ip);

  if (limited) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait a minute before generating again.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Secure API Key
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error: GROQ_API_KEY is missing.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. Proxy to Groq
  try {
    const body = await req.json();
    // Validate request structure briefly
    if (!body.messages || !Array.isArray(body.messages)) {
       return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }

    // Intelligent Waterfall Fallback Strategy
    const requestedModel = body.model || 'llama-3.3-70b-versatile';
    
    // We include the exact model strings based on Groq's standard naming conventions
    const fallbackModels = [
      requestedModel,
      'llama-3.3-70b-versatile',
      'llama-4-scout',
      'gpt-oss-120b',
      'qwen-3-32b',
      'llama-3.1-8b-instant',
    ];

    // Remove duplicates just in case the requested model is already in the fallback list
    const modelsToTry = [...new Set(fallbackModels)];

    let response = null;
    let lastError = null;

    for (const model of modelsToTry) {
      const payload = {
        model: model,
        messages: body.messages,
        temperature: body.temperature ?? 0.7,
        max_tokens: body.max_tokens ?? 1500,
        stream: body.stream ?? false,
      };

      response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        break; // Success! Break out of the fallback loop
      }

      // If Rate Limit (429) OR Model Not Found (404), skip to the next model!
      if (response.status === 429 || response.status === 404) {
        console.warn(`[Waterfall] Skipping model ${model} (Status: ${response.status}). Falling back...`);
        lastError = response;
        continue; 
      }

      // If it's a 400 Bad Request (e.g. prompt is too large) or something else, don't fallback, just return it.
      break; 
    }

    if (!response || !response.ok) {
      const errorData = await (response || lastError).json().catch(() => ({}));
      return new Response(
        JSON.stringify({ error: errorData?.error?.message || `Groq API Error: ${(response || lastError).status}` }),
        { status: (response || lastError).status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Return the response (handling streams perfectly)
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Transfer-Encoding': 'chunked', // Ensure chunks pass through
      },
    });

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error while processing request.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

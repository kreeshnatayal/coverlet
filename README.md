# CoverLetAI ✨

**CoverLetAI** is an AI-powered cover letter generator designed to bridge the gap between human intent and AI generation. Built as an AI Product Management portfolio project, it focuses on **Human-in-the-Loop (HITL)** iteration, **AI Explainability**, and **Guardrails** rather than just blind generation.

## 🚀 Key Product Features

### 🛡️ Input Guardrails
Before burning API tokens, the system runs a fast, low-latency classifier to verify if the uploaded document is actually a resume/job description. If a user uploads irrelevant gibberish, the AI gracefully halts the process and returns a user-friendly error.

### 🧠 Explainable AI (Strategy Rationale)
To build user trust, the AI doesn't just output a cover letter. It streams an **AI Strategy Rationale** alongside the letter, explaining *why* it chose to highlight specific skills from the resume and how it matched the tone of the job description.

### 🔄 Human-in-the-Loop (HITL) Refinement
Users are rarely satisfied with the first draft. Instead of starting over, CoverLetAI features a conversational Refinement UI. Users can give natural language feedback (e.g., *"Make it shorter and don't mention my gap year"*), and the AI will iteratively revise the document while maintaining context.

### 📄 Professional Export
Generated cover letters can be downloaded directly as properly formatted **.docx** files (using `docx` and `file-saver`), allowing users to make final manual tweaks in Microsoft Word or Google Docs before applying.

## 🏗️ Technical Architecture

- **Frontend**: React + Vite (Monochrome, SaaS-style minimalist aesthetic).
- **Backend**: Vercel Serverless Edge Functions (`/api/generate`).
- **AI Model**: Groq API (`llama-3.3-70b-versatile`) for ultra-fast, low-latency streaming.
- **Security**: The Groq API key is strictly hidden on the server. The Edge Function implements an IP-based rate limiter (max 5 requests/minute) to defend against abuse.

## 💻 Local Development

Because this project uses Vercel Serverless Functions for the secure backend proxy, standard `npm run dev` will not execute the API routes. 

You must use the Vercel CLI to run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/kreeshnatayal/coverlet.git
   cd coverlet
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
4. Run the Vercel dev server:
   ```bash
   npx vercel dev
   ```

## 🌐 Deployment (Vercel)

This project is optimized for 1-click deployment on Vercel.

1. Push your repository to GitHub.
2. Go to Vercel and import the repository.
3. **Crucial Step**: Before clicking Deploy, open the **Environment Variables** tab and add `GROQ_API_KEY` with your secret key.
4. Click **Deploy**. The `/api/generate.js` file will automatically be deployed as a secure Edge Function.

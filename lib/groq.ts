import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  // In serverless, fail fast for missing env
  throw new Error("GROQ_API_KEY is not set. Add it to your Vercel envs.");
}

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

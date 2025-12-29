# SnapScribe Studio (Next.js + Tailwind + Groq)

Boho-themed caption generator with two flows:
- **SnapScribe (Image → Captions)**: upload an image, pick vibe/length/language, get captions + hashtags.
- **VibeText (Keywords → Captions)**: enter keywords, pick vibe/length/language, get captions + hashtags.

## Stack
- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS (custom boho tokens)
- Groq SDK for text + vision models (server-side)

## Prerequisites
- Node 18+
- Groq API key

## Setup
```bash
cd web
npm install
```
Create `.env.local`:
```
GROQ_API_KEY=your_key_here
```

## Run locally
```bash
npm run dev
# open http://localhost:3000
```

## Project structure
- `app/page.tsx` — UI for SnapScribe/VibeText, calls internal APIs.
- `app/api/captions/image/route.ts` — image → captions via Groq vision.
- `app/api/captions/text/route.ts` — keywords → captions via Groq chat.
- `app/globals.css` — boho styles.
- `lib/groq.ts` — Groq client using env key.
- Tailwind config/theme in `tailwind.config.js`.

## Deploy to Vercel
- Import the `web/` project.
- Set env: `GROQ_API_KEY` in Vercel project settings.
- Build command: `npm run build`
- Output: `.next`

## Notes
- Typescript/JSX lint errors disappear after `npm install` (pulls next/react typings).
- Tailwind `@tailwind` at-rule warnings disappear once Tailwind is installed (via npm install).
- API uses `meta-llama/llama-4-maverick-17b-128e-instruct`; adjust in `app/api/.../route.ts` if desired.

# SkillSync

A job matching web app that parses your resume (PDF), extracts your skills and experience, and matches you against live remote & local job listings.

## Why I Built This

Job hunting often means scrolling through hundreds of irrelevant listings on sites that force you to re-type your resume details over and over. SkillSync lets you upload your resume once, extracts your background, and calculates a match percentage for each position based on skill overlap.

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** CSS Modules, Vanilla CSS (Dark/Light themes)
- **AI / Resume Parsing:** Groq SDK (`llama-3.1-8b-instant`)
- **PDF Extraction:** `pdfjs-dist` (runs client-side in browser)
- **Job Data:** Multi-source aggregator (Remotive, RemoteOK, Adzuna, PH Remote feeds)
- **Database:** Supabase

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/meegol/skillsync.git
   cd skillsync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root folder:
   ```env
   GROQ_API_KEY=your_groq_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   DATABASE_URL=your_database_url
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How Job Matching Works

1. **PDF Text Extraction:** PDF text is extracted in the browser using `pdfjs-dist` so raw documents aren't stored unnecessarily.
2. **Skill Structuring:** Groq's Llama 3.1 model parses raw text into structured JSON (skills, job title, years of experience, location).
3. **Multi-Source Fetching:** The backend queries multiple public job APIs concurrently.
4. **Scoring:** Calculates match percentage based on skill keyword overlap against job descriptions.

## License

MIT

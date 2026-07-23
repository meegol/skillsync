import Groq from 'groq-sdk';
import type { UserProfile } from '@/types';

const SYSTEM_PROMPT = `You are an expert resume parser. Your task is to extract structured information from resume text.
Return ONLY valid JSON with exactly this structure — no markdown, no extra text, just JSON:
{
  "name": "Full Name (or 'Unknown' if not found)",
  "jobTitle": "Most recent or target job title",
  "skills": ["skill1", "skill2", ...],
  "experience": 0,
  "location": "City, Country (or 'Remote' if applicable)",
  "summary": "A concise 2-3 sentence professional summary."
}

Rules:
- "skills" should be a comprehensive list of technical AND soft skills (max 25)
- "experience" should be an integer representing total years of professional experience
- If information is missing, use sensible defaults
- Never return null values, use empty strings or 0 instead`;

export async function parseResumeWithGroq(resumeText: string): Promise<UserProfile> {
  const apiKey = process.env.GROQ_API_KEY || 'dummy_build_key';
  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Parse this resume and return JSON:\n\n${resumeText.slice(0, 8000)}`,
      },
    ],
    temperature: 0.1,
    max_tokens: 1024,
  });

  const content = completion.choices[0]?.message?.content ?? '{}';

  // Strip markdown code fences if present
  const cleaned = content
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim();

  const parsed = JSON.parse(cleaned) as UserProfile;

  return {
    name: parsed.name || 'Unknown',
    jobTitle: parsed.jobTitle || 'Professional',
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    experience: Number(parsed.experience) || 0,
    location: parsed.location || 'Remote',
    summary: parsed.summary || '',
  };
}

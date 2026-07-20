import { NextRequest, NextResponse } from 'next/server';
import { parseResumeWithGroq } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body as { text: string };

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Resume text is too short or empty.' },
        { status: 400 }
      );
    }

    const profile = await parseResumeWithGroq(text);

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('[parse-resume]', err);
    return NextResponse.json(
      { error: 'Failed to parse resume. Please check your Groq API key.' },
      { status: 500 }
    );
  }
}

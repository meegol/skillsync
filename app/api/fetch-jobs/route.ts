import { NextRequest, NextResponse } from 'next/server';
import { fetchAllMatchedJobs } from '@/lib/jobsFetcher';
import type { UserProfile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile } = body as { profile: UserProfile };

    if (!profile || !profile.jobTitle) {
      return NextResponse.json(
        { error: 'Invalid profile data.' },
        { status: 400 }
      );
    }

    const jobs = await fetchAllMatchedJobs(profile);

    return NextResponse.json({ jobs, total: jobs.length });
  } catch (err) {
    console.error('[fetch-jobs]', err);
    return NextResponse.json(
      { error: 'Failed to fetch jobs.' },
      { status: 500 }
    );
  }
}

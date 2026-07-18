export interface UserProfile {
  name: string;
  jobTitle: string;
  skills: string[];
  experience: number;
  location: string;
  summary: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  url: string;
  postedDate: string;
  isRemote: boolean;
  category: string;
  matchScore: number;
  matchedSkills: string[];
}

export interface ParseResumeResponse {
  profile: UserProfile;
  error?: string;
}

export interface FetchJobsResponse {
  jobs: Job[];
  total: number;
  error?: string;
}

export interface JobFilter {
  remote: boolean | null;
  location: string;
  minMatch: number;
}

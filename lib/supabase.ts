import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadResume(file: File, userId: string): Promise<string | null> {
  const fileName = `${userId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from('resumes')
    .upload(fileName, file, { upsert: true });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data } = supabase.storage.from('resumes').getPublicUrl(fileName);
  return data.publicUrl;
}

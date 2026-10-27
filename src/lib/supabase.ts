import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-ref')
);

// If configured, initialize the real client. Otherwise provide a safe fallback client.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

export const BUCKET_PROJECT_MEDIA = 'project-media';
export const BUCKET_DOCUMENTS = 'documents';

/**
 * Uploads a file to Supabase Storage bucket with validation.
 */
export async function uploadFileToStorage(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return {
      url: null,
      error: new Error('Supabase is not configured yet. Please configure your .env credentials.'),
    };
  }

  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
    });

    if (error) {
      return { url: null, error };
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: publicUrlData.publicUrl, error: null };
  } catch (err) {
    return { url: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Deletes a file from Supabase Storage bucket.
 */
export async function deleteFileFromStorage(
  bucket: string,
  path: string
): Promise<{ success: boolean; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: new Error('Supabase is not configured.') };
  }

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns a singleton instance of the Supabase client.
 * Lazy-initialized to avoid crashes in environments without credentials (e.g. CI/Tests)
 * if Supabase is not actually being used.
 */
export const getSupabase = (): SupabaseClient => {
    if (!supabaseInstance) {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!url || !key) {
            throw new Error(
                "Supabase credentials missing (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). " +
                "Ensure these are set in your .env file or environment."
            );
        }

        supabaseInstance = createClient(url, key);
    }
    return supabaseInstance;
};

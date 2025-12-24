import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
    if (!supabaseInstance) {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!url || !key) {
            console.warn("Supabase credentials missing. Falling back to local storage.");
            return null;
        }

        supabaseInstance = createClient(url, key);
    }
    return supabaseInstance;
};

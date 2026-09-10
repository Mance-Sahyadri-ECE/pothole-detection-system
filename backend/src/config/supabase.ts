import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env';

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!supabaseClient && config.supabaseUrl && config.supabaseAnonKey) {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  }
  return supabaseClient;
};

export const getSupabaseAdminClient = (): SupabaseClient | null => {
  if (!supabaseAdminClient && config.supabaseUrl && config.supabaseServiceKey) {
    supabaseAdminClient = createClient(config.supabaseUrl, config.supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    });
  }
  return supabaseAdminClient;
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://wwktorrlsayehqlbmvjb.supabase.co";
const supabaseAnonKey = "sb_publishable_lWQ-uSg6V5qD1Epkh4MgXw_1DSWENWh";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
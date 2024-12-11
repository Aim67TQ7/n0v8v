import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://bjxbwygfelodmhrfswzi.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqeGJ3eWdmZWxvZG1ocmZzd3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MTEzMzYsImV4cCI6MjA0OTE4NzMzNn0.eSnys2ExcBmEeOJKHnt3DXBlpZLDhWN0kRUiOr34SvQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
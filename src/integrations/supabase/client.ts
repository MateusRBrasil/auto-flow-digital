// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://slozxjwnrmiyqiqugcjp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsb3p4anducm1peXFpcXVnY2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMTEwNzEsImV4cCI6MjA2MjU4NzA3MX0.Mb7lQcSL7g_2D58RPZ5d_JzRSmItK3fe9Kxe72qtNO8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
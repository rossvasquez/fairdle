import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://slpzwuawjoqsfiqtlkyb.supabase.co"
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscHp3dWF3am9xc2ZpcXRsa3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1OTAzNzYsImV4cCI6MjAwNzE2NjM3Nn0.8AY-5bPm4-co8biqtkG5iGQ2hNWgPiqnDS711gKBAKM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
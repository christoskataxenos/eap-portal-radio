import { createClient } from '@supabase/supabase-js';

// # Αντικατάστησε αυτές τις τιμές με τα στοιχεία από το Supabase Project σου
// # Προσοχή: Χρειάζεται να ορίσεις τα παρακάτω στο .env.local σου
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// # Αποφυγή crash αν λείπουν τα credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn("Supabase URL is missing. Community features (Shoutbox) will be disabled.");
}

// # Σημείωση για τον χρήστη:
// # Χρειάζεται ένα table 'shouts' με:
// # - id (uuid, primary key)
// # - created_at (timestamp with time zone)
// # - username (text)
// # - message (text)
// # - type (text) - π.χ. 'shout' ή 'request'

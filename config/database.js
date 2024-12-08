const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
}

// Configure Supabase client with development-specific settings
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        storageKey: 'supabase.auth.token',
        storage: {
            getItem: (key) => {
                // In development, always try to use the most recent session
                if (process.env.NODE_ENV !== 'production' && global.devSession) {
                    return JSON.stringify(global.devSession);
                }
                return null;
            },
            setItem: (key, value) => {
                // Store session in memory for development
                if (process.env.NODE_ENV !== 'production') {
                    try {
                        global.devSession = JSON.parse(value);
                    } catch (e) {
                        console.error('Error parsing session:', e);
                    }
                }
            },
            removeItem: (key) => {
                if (process.env.NODE_ENV !== 'production') {
                    global.devSession = null;
                }
            }
        }
    }
});

module.exports = supabase;

const supabase = require('../config/database');

exports.requireAuth = async (req, res, next) => {
    try {
        // Get the session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        // In development, try to refresh the session if it exists
        if (process.env.NODE_ENV !== 'production' && session) {
            const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
            if (!refreshError && refreshedSession) {
                req.session = refreshedSession;
            }
        }

        if (error) throw error;

        if (!session) {
            // If no session exists, redirect to login
            return res.redirect('/login');
        }

        // Get the user's profile data
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (userError) throw userError;

        if (!user) {
            // If user profile doesn't exist, sign out and redirect to login
            await supabase.auth.signOut();
            return res.redirect('/login');
        }

        // Attach the user object to the request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.redirect('/login');
    }
};

exports.redirectIfAuthenticated = async (req, res, next) => {
    try {
        // Get the session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
            // If user is already authenticated, redirect to dashboard
            return res.redirect('/dashboard');
        }

        next();
    } catch (error) {
        console.error('Redirect middleware error:', error);
        next(error);
    }
};

exports.attachUser = async (req, res, next) => {
    try {
        // Get the session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
            // Get the user's profile data
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (userError) throw userError;

            // Attach the user object to the request and response locals
            req.user = user;
            res.locals.user = user;
        }

        next();
    } catch (error) {
        console.error('Attach user middleware error:', error);
        next(error);
    }
};

const supabase = require('../config/database');

exports.requireAuth = async (req, res, next) => {
    try {
        // Get the session from the request cookies
        const accessToken = req.cookies['sb-access-token'];
        const refreshToken = req.cookies['sb-refresh-token'];

        if (!accessToken || !refreshToken) {
            return res.redirect('/login');
        }

        // Set the session in Supabase client
        const { data: { session }, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        });

        if (error || !session) {
            // Clear cookies if session is invalid
            res.clearCookie('sb-access-token');
            res.clearCookie('sb-refresh-token');
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
            res.clearCookie('sb-access-token');
            res.clearCookie('sb-refresh-token');
            return res.redirect('/login');
        }

        // Attach the user object to the request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.clearCookie('sb-access-token');
        res.clearCookie('sb-refresh-token');
        res.redirect('/login');
    }
};

exports.redirectIfAuthenticated = async (req, res, next) => {
    try {
        const accessToken = req.cookies['sb-access-token'];
        const refreshToken = req.cookies['sb-refresh-token'];

        if (accessToken && refreshToken) {
            const { data: { session }, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            });

            if (!error && session) {
                return res.redirect('/dashboard');
            }
        }

        next();
    } catch (error) {
        console.error('Redirect middleware error:', error);
        next(error);
    }
};

exports.attachUser = async (req, res, next) => {
    try {
        const accessToken = req.cookies['sb-access-token'];
        const refreshToken = req.cookies['sb-refresh-token'];

        if (accessToken && refreshToken) {
            const { data: { session }, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            });

            if (!error && session) {
                // Get the user's profile data
                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (!userError && user) {
                    req.user = user;
                    res.locals.user = user;
                }
            }
        }

        next();
    } catch (error) {
        console.error('Attach user middleware error:', error);
        next(error);
    }
};

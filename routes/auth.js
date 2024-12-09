const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { redirectIfAuthenticated } = require('../middleware/auth');

router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('login', {
        title: "Pocket Money",
        user: null
    });
});

// Handle login and registration in the same route
router.post('/login', async (req, res) => {
    const { action, email, password, first_name, last_name, repeatPassword } = req.body;

    try {
        if (action === 'login') {
            // Login logic with persistent session
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            if (data.session) {
                // Set both access token and refresh token cookies
                res.cookie('sb-access-token', data.session.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 24 * 60 * 60 * 1000 // 24 hours
                });

                res.cookie('sb-refresh-token', data.session.refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
                });
            }

            return res.status(200).json({ message: 'Login successful', session: data.session });
        }

        if (action === 'register') {
            if (password !== repeatPassword) {
                return res.status(400).json({ error: 'Passwords do not match' });
            }
        
            const { data: user, error } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    data: {
                        first_name,
                        last_name
                    }
                }
            });
        
            if (error) {
                return res.status(400).json({ error: error.message });
            }
        
            const userId = user.user?.id;
        
            if (!userId) {
                return res.status(500).json({ error: 'Failed to retrieve user ID after sign-up' });
            }
        
            const { error: insertError } = await supabase
                .from('users')
                .insert([{ id: userId, first_name, last_name, email }]);
        
            if (insertError) {
                return res.status(400).json({ error: insertError.message });
            }
        
            return res.status(200).json({ message: 'User registered successfully' });
        }

        // Fallback for unsupported actions
        res.status(400).json({ error: 'Invalid action' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

// handle logout
router.get('/logout', async (req, res) => {
    try {
        // Clear the session
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        // Clear both access token and refresh token cookies
        res.clearCookie('sb-access-token', { path: '/' });
        res.clearCookie('sb-refresh-token', { path: '/' });

        // Redirect to the login page after logout
        res.redirect('/login');
    } catch (error) {
        console.error('Logout error:', error);
        res.redirect('/login');
    }
});

router.get('/reset-password', (req, res) => {
    res.render('reset-password', { title: 'Reset Password', user: null });
});

router.post('/reset-password', async (req, res) => {
    const { action, email } = req.body;

    try {
        if (action === 'reset-password') {
            
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const redirectTo = `${baseUrl}/reset-password`;

            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo,
            });

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(200).json({ message: 'Password reset link sent' });
        }
        // Fallback for unsupported actions
        res.status(400).json({ error: 'Invalid action' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

router.post('/update-password', async (req, res) => {
    const { newPassword, accessToken } = req.body;

    if (!accessToken || !newPassword) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        // Use the access token to update the user's password
        const { data, error } = await supabase.auth.updateUser(accessToken, {
            password: newPassword,
        });

        if (error) {
            console.error('Password update error:', error);
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const supabase = require('../config/database');

// Profile Page Route
router.get('/profile', 
    requireAuth,
    userController.getUsers, 
    userController.getFriends, 
    (req, res) => {
        res.render('profile', {
        title: "Profile",
        users: req.users,
        friends: req.friendsList,
    });
});

router.put('/update-profile', 
    requireAuth,
    userController.updateProfile,
    (req, res) => {
        res.status(200).json({ success: true, user: req.user });
    }
);

router.get('/search', 
    requireAuth,
    userController.searchUsers, 
    (req, res) => {
        res.render('search', {
        title: "Search",
        searchResults: req.searchResults,
    });
});

router.post('/friends/create', 
    requireAuth,
    userController.createFriend, 
    (req, res) => {
        res.json({ success: true, message: 'Friend added successfully!' });
});

router.put('/users/friends/update-status', 
    requireAuth, 
    userController.updateFriendStatus, 
    (req, res) => {
        res.status(200).json({ success: true, friend: req.friend });
});

router.delete('/friends/:id', requireAuth, userController.removeFriend);


// Multer config (memory storage for handling buffer uploads)
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Profile Picture Upload Route
router.post('/profile/upload-profile-picture', // Route matches the frontend form path
    requireAuth,
    (req, res, next) => {
        upload.single('profilePicture')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // Multer error (e.g., file too large)
                return res.status(400).json({ error: err.message });
            } else if (err) {
                // Other errors (e.g., not an image file)
                return res.status(400).json({ error: err.message });
            }
            next();
        });
    },
    userController.uploadProfilePicture
);

module.exports = router;

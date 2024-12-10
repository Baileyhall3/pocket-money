const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alertsController');

router.get('/alerts', 
    (req, res) => {
        res.render('alerts',
            { title: "Alerts",}
        );
});

router.post('/alerts/friend-request', async (req, res) => {
    const { userId, friendName, sentById } = req.body;

    if (!userId || !friendName || !sentById) {
        return res.status(400).json({ error: 'Missing values' });
    }

    try {
        await alertsController.createFriendRequestAlert(userId, friendName, sentById);
        res.status(201).json({ success: true, message: 'Friend request alert created.' });
    } catch (error) {
        console.error('Error creating friend request alert:', error);
        res.status(500).json({ success: false, error: 'Failed to create friend request alert.' });
    }
});

module.exports = router;
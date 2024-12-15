const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alertsController');

const { requireAuth } = require('../middleware/auth');

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

router.post('/alerts/nudge', async (req, res) => {
    const { userId, friendName, sentById } = req.body;

    if (!userId || !friendName || !sentById) {
        return res.status(400).json({ error: 'Missing values' });
    }

    try {
        await alertsController.createNudgeAlert(userId, friendName, sentById);
        res.status(201).json({ success: true, message: 'Nudge alert created.' });
    } catch (error) {
        console.error('Error creating nudge alert:', error);
        res.status(500).json({ success: false, error: 'Failed to create nudge alert.' });
    }
});

router.post('/alerts/shared', async (req, res) => {
    const { userId, friendName, item } = req.body;

    if (!userId || !friendName || !item) {
        return res.status(400).json({ error: 'Missing values' });
    }

    try {
        await alertsController.createSharedAlert(userId, friendName, item);
        res.status(201).json({ success: true, message: 'Shared alert created.' });
    } catch (error) {
        console.error('Error creating nudge alert:', error);
        res.status(500).json({ success: false, error: 'Failed to create shared alert.' });
    }
});


router.delete('/alerts/:id', requireAuth, alertsController.deleteAlert, (req, res) => {
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
});

module.exports = router;
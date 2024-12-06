const express = require('express');
const router = express.Router();

router.get('/alerts', 
    (req, res) => {
        res.render('alerts',
            { title: "Alerts",}
        );
});

module.exports = router;
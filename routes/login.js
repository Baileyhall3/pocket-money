const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/home', 
    userController.getUser, 
    (req, res) => {
        res.render('home',
            { title: "Pocket Money",
                user: req.user,
            }
        );
});

module.exports = router;
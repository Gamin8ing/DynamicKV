const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/User.controller');
const authMiddleware = require('../middlewares/auth.middleware');
router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({min: 6})
], 
    userController.registerUser
)

router.post('/login', [
    body('email').isEmail(),
    body('password').isLength({min: 6})
], 
    userController.loginUser
)

router.get('/profile',authMiddleware.authUser, userController.getUserProfile)

router.get('/logout', userController.logoutUser)

module.exports = router;
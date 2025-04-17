const { model } = require('mongoose');
const userModel = require('../models/User.model');
const userService = require('../services/User.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {fullname, email, password} = req.body;
    const userExists = await userModel.findOne({email});
    if(userExists){
        return res.status(400).json({message: 'User already exists'});
    }
    const hashPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashPassword
    });
    const token = user.generateAuthToken();
    res.status(201).json({token,user});
}
module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    const user = await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({message: 'invalid email or password'});
    }
    const validPassword = await user.comparePassword(password);
    if(!validPassword){
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const token = user.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({token,user});
}
module.exports.getUserProfile = async (req, res) => {
    res.status(200).json(req.user);
}
module.exports.logoutUser = async (req, res) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistTokenModel.create({token});
    res.status(200).json({message: 'Logged out successfully'});
}
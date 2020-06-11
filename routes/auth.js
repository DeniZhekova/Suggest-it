const {signup,signin,signout,forgotPassword,
    resetPassword}=require('../controllers/auth');
const express = require("express");
const router = express.Router();
const {signupValidator,passwordResetValidator}=require('../helpers');
const {userById}=require('../controllers/user');

//Routes for signing up/in/out
router.post('/signup',signup);
router.post('/signin',signin);
router.get('/signout',signout);

// Routes for forgotten password and resetting password
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);


router.param("userId",userById);

module.exports=router;
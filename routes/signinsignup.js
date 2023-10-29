const express = require('express');
const { signup, signin, resetPassword, verifyOtp, updatePassword } = require('../controller/signinsignup');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgotPassword', resetPassword);
router.post('/verifyOtp', verifyOtp);
router.post('/updatePassword', updatePassword);

module.exports = router;
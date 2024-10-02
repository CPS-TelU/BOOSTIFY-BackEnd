const express = require('express');
const router = express.Router();

const loginController = require("../features/auth/controller/loginController");
const registerController = require("../features/auth/controller/registerController");
const logoutController = require("../features/auth/controller/logoutController");
const recapController = require("../features/recap/controller/recapController");
const attendanceController = require('../features/live_attendance/controller/attendanceController');
const personalRecordsController = require('../features/personalrecords/controller/personalrecController');
const accessValidation = require('../middlewares/authMiddleware');
const userController = require('../features/whoami/controller/whoamiController');
const upImageController = require('../features/uploadImage/controller/uploadImageController');
const deleteUserImage = require('../features/uploadImage/controller/deleteImageController');
const uploadAttendanceData = require('../features/recap/controller/sendDataController');
const changePass = require('../features/auth/controller/changePassController');
const verifyVerificationCode  = require('../features/auth/controller/verifyCodeController');
const requestVerificationCode  = require('../features/auth/controller/verificationController');
const resetPasswordController = require('../features/auth/controller/resetPasswordController')

router.get("/recap", accessValidation ,recapController)
router.get('/attendances', accessValidation, attendanceController);
router.get('/personalrec', accessValidation, personalRecordsController);
router.get('/whoami', accessValidation, userController);

router.patch('/uploadImage', accessValidation, upImageController);
router.patch('/auth/updatePassword', accessValidation, changePass);
router.delete('/deleteImage', accessValidation, deleteUserImage);

router.post('/request-verification', requestVerificationCode);
router.post('/verify-change-password', verifyVerificationCode);
router.patch('/reset-password', resetPasswordController);

router.post("/uploadfromml", uploadAttendanceData);
router.post("/auth/login", loginController);
router.post("/auth/register", registerController);
router.post("/auth/logout", accessValidation ,logoutController.logoutController);
router.delete("/remove-token", logoutController.removeExpiredTokens)




module.exports = router;
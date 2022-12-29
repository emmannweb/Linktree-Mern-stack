const express = require('express');
const router = express.Router();
const { signup, signin, logout, userProfile, forgetPassword, resetPassword } = require("../controllers/authController")
const { isAuthenticated, isSuperAdmin } = require("../middleware/auth");



//ENDPOINT PREFIX /API/V1
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/logout", isAuthenticated, logout);
router.get("/getme", isAuthenticated, userProfile);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:resettoken", resetPassword);


module.exports = router;



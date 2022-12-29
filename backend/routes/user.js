const express = require('express');
const router = express.Router();
const {isAuthenticated, isSuperAdmin} = require("../middleware/auth");
const {userController, userSingleController, userEditController, createUserController, deleteUserController} = require("../controllers/userController");


//ENDPOINT PREFIX /API/V1
router.get("/users/all", isAuthenticated, userController);
router.get("/user/view/:id", isAuthenticated, userSingleController);
router.put("/user/edit/:id", isAuthenticated, isSuperAdmin, userEditController);
router.delete("/user/delete/:id", isAuthenticated, isSuperAdmin,  deleteUserController);
router.post("/user/create", isAuthenticated, isSuperAdmin, createUserController);


module.exports = router;
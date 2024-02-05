// [SECTION] Dependencies and Modules
const express = require("express");

const userController = require("../controllers/user");
const passport = require("passport");

const { verify, verifyAdmin, isLoggedIn } = require("../auth"); 


// [SECTION] Routing Component
const router = express.Router();


// [SECTION] Routes
router.post("/", userController.registerUser);

router.post("/login", userController.loginUser);


//[SECTION] Route for retrieving user details
router.post("/details", verify, userController.getProfile);

//[SECTION] PUT route for resetting the password
router.put('/update-password', verify, userController.updatePassword);

// Route to update another user as an admin
router.put('/:userId/set-as-admin', verify, verifyAdmin, userController.updateAdmin);

module.exports = router;
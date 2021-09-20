const express = require("express");
const router = express.Router();
const { createNewUser, 
		loginUser, 
		resetPassword, 
		updtPassword, 
		logoutUser, 
		verifyUser 
		} = require("../controllers/authController");
const { getUserProfile } = require("../controllers/userController")
const { userAuthorization } = require("../middlewares/authorization.middleware");

const {
	resetPassReqValidation,
	updatePassValidation,
	newUserValidation,
} = require("../middlewares/formValidation.middleware");




router.all("/", (req, res, next) => {
	// res.json({ message: "return form user router" });

	next();
});

// Get user profile router
router.get("/", userAuthorization, getUserProfile);

///very user after user is sign up
router.patch("/verify", verifyUser);

// Create new user router
router.post("/", newUserValidation, createNewUser)
//User Login in Router
router.post("/login", loginUser)
router.post("/reset-password", resetPassReqValidation, resetPassword);

router.patch("/reset-password", updatePassValidation, updtPassword);
// User logout and invalidate jwts

router.delete("/logout", userAuthorization, logoutUser);

module.exports = router;

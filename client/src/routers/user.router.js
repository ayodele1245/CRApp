const express = require("express");
const { route, post } = require("./ticket.router");
const router = express.Router();
const { createNewUser, loginUser, resetPassword, updatePassword, logoutUser, verifyUser } = require("../controllers/authController")
const {
	insertUser,
	getUserByEmail,
	getUserById,
	updatePassword,
	storeUserRefreshJWT,
	verifyUser,
} = require("../model/user/User.model");

const {
	userAuthorization,
} = require("../middlewares/authorization.middleware");

const {
	resetPassReqValidation,
	updatePassValidation,
	newUserValidation,
} = require("../middlewares/formValidation.middleware");


const verificationURL = "http://localhost:3000/verification/";

router.all("/", (req, res, next) => {
	// res.json({ message: "return form user router" });

	next();
});

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {
	//this data coming form database
	const _id = req.userId;

	const userProf = await getUserById(_id);
	const { name, email } = userProf;
	res.json({
		user: {
			_id,
			name,
			email,
		},
	});
});

///very user after user is sign up
router.patch("/verify", verifyUser);

// Create new user router
router.post("/", newUserValidation, createNewUser)
//User Login in Router
router.post("/login", loginUser)
router.post("/reset-password", resetPassReqValidation, resetPassword);

router.patch("/reset-password", updatePassValidation, updatePassword);
// User logout and invalidate jwts

router.delete("/logout", userAuthorization, logoutUser);

module.exports = router;

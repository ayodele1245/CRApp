const UserSchema=require("../model/user/User.schema")
const {
	insertUser,
	getUserByEmail,
	updatePassword,
	storeUserRefreshJWT,
	verify,
} = require("../model/user/User.model");
const {
	setPasswordRestPin,
	getPinByEmailPin,
	deletePin,
} = require("../model/restPin/RestPin.model");
const { emailProcessor } = require("../helpers/email.helper");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { crateAccessJWT, crateRefreshJWT } = require("../helpers/jwt.helper");
//const { verify } = require("jsonwebtoken");

const { deleteJWT } = require("../helpers/redis.helper");
const verificationURL = "http://localhost:3000/verification/";

const createNewUser = async (req, res) => {
	const { name, company, address, phone, email, password } = req.body;

	try {
		//hash password
		const hashedPass = await hashPassword(password);

		const newUserObj = {
			name,
			company,
			address,
			phone,
			email,
			password: hashedPass,
		};

		const result = await insertUser(newUserObj);
		console.log(result);

		await emailProcessor({
			email,
			type: "new-user-confirmation-required",
			verificationLink: verificationURL + result._id + "/" + email,
		});

		res.json({ status: "success", message: "New user created", result });
	} catch (error) {
		console.log(error);

		let message =
			"Unable to create new user at the moment, Please try again or contact administration!";
		if (error.message.includes("duplicate key error collection")) {
			message = "this email already has an account";
		}
		res.json({ status: "error", message });
	}
};


const loginUser = async (req, res) => {
	console.log(req.body);
	const { email, password } = req.body;
	if (!email || !password) {
		return res.json({ status: "error", message: "Invalid form submission!" });
	}

	const user = await getUserByEmail(email);
	if (!user) {
		return res.json({
			status: "error",
			message:
				"Your account has not been verified. Please check your email and verify your account before able to login!",
		});
	}

	const passFromDb = user && user._id ? user.password : null;
	if (!passFromDb)
		return res.json({ status: "error", message: "Invalid email or password!" });

	const result = await comparePassword(password, passFromDb);
	if (!result) {
		return res.json({ status: "error", message: "Invalid email or password!" });
	}

	const accessJWT = await crateAccessJWT(user.email, `${user._id}`);
	const refreshJWT = await crateRefreshJWT(user.email, `${user._id}`);

	res.json({
		status: "success",
		message: "Login Successfully!",
		accessJWT,
		refreshJWT,
	});
};



const resetPassword = async (req, res) => {
	const { email } = req.body;

	const user = await getUserByEmail(email);

	if (user && user._id) {
		/// crate// 2. create unique 6 digit pin
		const setPin = await setPasswordRestPin(email);
		await emailProcessor({
			email,
			pin: setPin.pin,
			type: "request-new-password",
		});
	}

	res.json({
		status: "success",
		message:
			"If the email exists in our database, the password reset pin will be sent shortly.",
	});
};


const updtPassword = async (req, res) => {
	const { pin, email, newPassword } = req.body;

	const getPin = await getPinByEmailPin(email, pin);
	// 2. validate pin
	if (getPin?._id) {
		const dbDate = getPin.addedAt;
		const expiresIn = 1;

		let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);

		const today = new Date();

		if (today > expDate) {
			return res.json({ status: "error", message: "Invalid or expired pin." });
		}

		// encrypt new password
		const hashedPass = await hashPassword(newPassword);

		const user = await updatePassword(email, hashedPass);

		if (user._id) {
			// send email notification
			await emailProcessor({ email, type: "update-password-success" });

			////delete pin from database
			deletePin(email, pin);

			return res.json({
				status: "success",
				message: "Your password has been updated",
			});
		}
	}
	res.json({
		status: "error",
		message: "We are unable to update your password. please try again later",
	});
};


const logoutUser = async (req, res) => {
	const { authorization } = req.headers;
	//this data is coming form database
	const _id = req.userId;

	// 2. delete accessJWT from redis database
	deleteJWT(authorization);

	// 3. delete refreshJWT from mongodb
	const result = await storeUserRefreshJWT(_id, "");

	if (result._id) {
		return res.json({ status: "success", message: "Loged out successfully" });
	}

	res.json({
		status: "error",
		message: "Unable to logg you out, plz try again later",
	});
};



const verifyUser = async (req, res) => {
	try {
		const { _id, email } = req.body;
		console.log(_id, email);

		const result = await verify(_id, email);

		if (result && result.id) {
			return res.json({
				status: "success",
				message: "Your account has been activated, you may sign in now.",
			});
		}

		return res.json({
			status: "error",
			message: "Invalid request!",
		});
	} catch (error) {
		console.log(error);
		return res.json({
			status: "error",
			message: "Invalid request!",
		});
	}
};


module.exports = {
	createNewUser,
	loginUser,
	resetPassword,
	updtPassword,
	logoutUser,
	verifyUser,
}
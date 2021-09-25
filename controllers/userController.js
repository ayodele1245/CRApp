const { getUserById } = require("../model/user/User.model");


const getUserProfile=async (req, res) => {
	//this data coming form database
	const _id = req.userId;

	const userProfile = await getUserById(_id);
	const { name, email } = userProfile;
	res.json({
		user: {
			_id,
			name,
			email,
		},
	});
};


module.exports = {
	getUserProfile,
}

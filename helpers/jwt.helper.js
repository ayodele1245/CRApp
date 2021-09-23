const jwt = require("jsonwebtoken");
const { setJWT, getJWT } = require("./redis.helper");
const { storeUserRefreshJWT } = require("../model/user/User.model");
const { token } = require("morgan");

const crateAccessJWT = async (email, _id) => {
  try {
    const accessJWT = await jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m", 
    });

    await setJWT(accessJWT, _id);

    return(accessJWT);
  } catch (error) {
    return (error);
  }
};

const crateRefreshJWT = async (email, _id) => {
  try {
    const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "10d",
    });

    await storeUserRefreshJWT(_id, refreshJWT);

    return(refreshJWT);
  } catch (error) {
    return (error);
  }
};

const verifyAccessJWT = (userJWT) => {
  try {
    return (jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET));
  } catch (error) {
    return Promise.resolve(error);
  }
};
const verifyRefreshJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, process.env.JWT_REFRESH_SECRET));
  } catch (error) {
    return Promise.resolve(error);
  }
};

module.exports = {
  crateAccessJWT,
  crateRefreshJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
};

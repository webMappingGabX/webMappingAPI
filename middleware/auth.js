const jwt = require('jsonwebtoken');

// import jwt from "jsonwebtoken";

module.exports = (req, res, next) => {
//export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log({ "Auth token" : token , "Decoded Token" : decodedToken });
    req.userData = { userId: decodedToken.id, name: decodedToken.name };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Echec de l\'authentification' });
  }
};
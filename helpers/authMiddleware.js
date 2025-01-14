const jwt = require("jsonwebtoken");
const HttpError = require("./HttpError");
const dotenv = require('dotenv');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';

dotenv.config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

function authMiddleware(request, response, next) {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new HttpError(401, "Authorization token is missing"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = { user_id: decoded.id }; 
       
        next();
    } catch (error) {
        next(new HttpError(401, "Invalid token"));
    }
}

module.exports = authMiddleware;

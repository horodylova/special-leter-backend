const jwt = require("jsonwebtoken");
const HttpError = require("./HttpError");
const dotenv = require('dotenv');

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES,
	});

    const checkToken = (token) => {
        if (!token) throw new HttpError(401, "Not logged in..");
    
        try {
            const { id } = jwt.verify(token, process.env.JWT_SECRET);
    
            return id;
        } catch (err) {
            throw new HttpError(401, "Not logged in..");
        }
    };

module.exports = { checkToken, signToken };
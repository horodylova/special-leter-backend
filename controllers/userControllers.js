const bcrypt = require("bcrypt");

const {
  getUsersModel,
  getUserModel,
  postUserModel,
} = require("../models/userModels");
const checkUserExists = require("../models/utils/checkUserExists");
const HttpError = require("../helpers/HttpError.js");

const { signToken, checkToken } = require("../helpers/JWTHandling.js");
const hashPassword = require("../helpers/hashPasswords.js");

function getUsers(request, response, next) {
  getUsersModel()
    .then((users) => {
      if (!users.length) {
        throw HttpError(404, "No users found");
      }
      response.status(200).send({ users });
    })
    .catch((error) => {
      next(error);
    });
}

function getUser(request, response, next) {
  const { username, password } = request.body;

  getUserModel(username, password)
    .then((user) => {
      if (!user) {
        throw HttpError(404, "User not found");
      }
      return bcrypt.compare(password, user.password_hash).then((match) => {
        if (!match) {
          throw HttpError(401, "Invalid credentials");
        }
        const token = signToken(user.id);
        response.status(200).send({ user, token });
      });
    })
    .catch((error) => {
      next(error);
    });
}

function createUser(request, response, next) {
  const { username, password } = request.body;

  console.log("[createUser] Incoming request body:", { username, passwordExists: !!password });

  if (!password) {
    console.warn("[createUser] Missing password in request");
    return next(HttpError(400, "Password is required"));
  }

  console.log("[createUser] Checking if user exists:", username);

  checkUserExists(username)
    .then((userExists) => {
      console.log("[createUser] User exists check result:", userExists);

      if (!userExists) {
        console.log("[createUser] User does not exist, hashing password");
        
        return hashPassword(password).then((hashedPassword) => {
          console.log("[createUser] Password hashed, creating user");
          return postUserModel(username, hashedPassword);
        });
      }

      console.warn("[createUser] User already exists:", username);
      throw HttpError(409, "A user with the same name already exists");
    })
    .then((user) => {
      console.log("[createUser] User created successfully:", user);
      
      const token = signToken(user.id);
      console.log("[createUser] Token generated for user:", token);
      
      response.status(201).send({ user, token });
    })
    .catch((error) => {
      console.error("[createUser] Error occurred:", error.message);
      next(error);
    });
}


function logoutUser(request, response, next) {
  const token = request.headers.authorization?.split(" ")[1];

  try {
    checkToken(token);
    response.status(200).send({ message: "User logged out successfully" });
  } catch (err) {
    next(HttpError(401, "Invalid or expired token"));
  }
}

module.exports = { getUsers, getUser, createUser, logoutUser };

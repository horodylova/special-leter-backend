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

  if (!password) {
      throw new Error("Password is required");
  }

  checkUserExists(username)  
  .then((userExists) => {
    console.log("User exists?", userExists);   
    if (!userExists) {
        return hashPassword(password).then((hashedPassword) => {
            return postUserModel(username, hashedPassword);
        });
    }
    throw HttpError(409, "A user with the same name already exists");
})
    .then((user) => {
      const token = signToken(user.id);
      response.status(201).send({ user, token });
    })
    .catch((error) => {
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

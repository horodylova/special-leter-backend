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
  
  if (!username || !password) {
    return next(HttpError(400, "Username and password are required"));
  }

  getUserModel(username)
    .then((user) => {
      if (!user) {
        throw HttpError(401, "Invalid username or password");
      }
      return bcrypt.compare(password, user.password_hash)
        .then((match) => {
          if (!match) {
            throw HttpError(401, "Invalid username or password");
          }
          const token = signToken(user.id);
          const userData = {
            id: user.id,
            username: user.username
          };
          response.status(200).send({ user: userData, token });
        });
    })
    .catch((error) => {
      // Если это не HttpError, преобразуем в 500
      if (!error.status) {
        error = HttpError(500, "Internal server error");
      }
      next(error);
    });
}

function createUser(request, response, next) {
  const { username, password } = request.body;
  
  if (!username || !password) {
    return next(HttpError(400, "Username and password are required"));
  }

  checkUserExists(username)
    .then((userExists) => {
      if (userExists) {
        throw HttpError(409, "A user with the same name already exists");
      }
      return hashPassword(password);
    })
    .then((hashedPassword) => {
      return postUserModel(username, hashedPassword);
    })
    .then((user) => {
      const token = signToken(user.id);
      const userData = {
        id: user.id,
        username: user.username
      };
      response.status(201).send({ user: userData, token });
    })
    .catch((error) => {
      // Если это не HttpError, преобразуем в 500
      if (!error.status) {
        error = HttpError(500, "Internal server error");
      }
      next(error);
    });
}

function logoutUser(request, response, next) {
  const token = request.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return next(HttpError(401, "No token provided"));
  }

  try {
    checkToken(token);
    response.status(200).send({ message: "User logged out successfully" });
  } catch (err) {
    next(HttpError(401, "Invalid or expired token"));
  }
}

module.exports = { getUsers, getUser, createUser, logoutUser };

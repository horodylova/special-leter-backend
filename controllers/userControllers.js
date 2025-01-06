const {getUsersModel, getTheUserModel, postTheUserModel} = require('../models/userModels');
const checkUserExists = require("../models/utils/checkUserExists")

function getUsers(request, response, next) {
    getUsersModel()
    .then((users) => {
        response.status(200).send({users})
    })
    .catch((error) => {
        next(error)
    })
}

function getTheUser (request, response, next) {
    const {username} = request.params;

    getTheUserModel(username)
    .then((user) => {
        response.status(200).send({user})
    })
    .catch((error) => {
        next(error)
    })
}

function createUser (request, response, next) {
    const {username} = request.params;
    
    checkUserExists(username)
    .then((userExists) => {
        if(!userExists) {
            return postTheUserModel(username)
        }
        return Promise.reject({status: 409, msg: "A user with the same name already exists"})
    }) 
    .then((user) => {
        response.status(201).send({user})
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = {getUsers, getTheUser, createUser}
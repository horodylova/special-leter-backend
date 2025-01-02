const {getUsersModel, getTheUserModel} = require('../models/userModels');

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

module.exports = {getUsers, getTheUser}
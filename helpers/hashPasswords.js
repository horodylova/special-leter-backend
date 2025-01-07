const bcrypt = require('bcrypt');


const hashPassword = async (password) => {
    const saltRounds = 10;
    if (!password) {
        throw new Error("Password is required for hashing");
    }
    return await bcrypt.hash(password, saltRounds);
};

module.exports = hashPassword;
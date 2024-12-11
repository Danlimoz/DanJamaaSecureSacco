// modules/userManagement.js
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Corrected path to User model

class UserManagement {
    async registerUser(userInfo) {
        const existingUser = await User.findOne({ username: userInfo.username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        userInfo.password = await bcrypt.hash(userInfo.password, 10); // Hash the password
        const newUser = new User(userInfo);
        await newUser.save();
        return newUser;
    }

    async login(username, password) {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        return user; // Return user object if login is successful
    }
}

module.exports = new UserManagement();
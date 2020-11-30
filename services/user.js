const mangoose = require('mongoose');
const Token = mangoose.model('Token');
const User = mangoose.model('User');

module.exports = {
    registerUser: async function (name, email, password, dob) {
        let user = new User({ name, email, password, dob });

        try {
            await user.save();
        } catch (err) {
            console.log(err);
            return 'Unable to save user';
        }
        return 'User is created';
    },
    loginCredentialsVerification: async function (email, password) {
        try {
            let user = await User.findOne({ 'email': email });
            if (!user)
                return 'User is not registered'
            if (!user.isVerified)
                return 'Please verify your email';
            if (user.password !== password) {
                return 'User login failied';
            }

        } catch (err) {
            console.log(err);
            return 'Unable to login user';
        }

        return 'User loggged in successfully';
    },
    veryfyEmail: async function (userId, token) {
        try {
            let tokenObj = await Token.findOne({ 'userId': userId });
            console.log('tokenObj', tokenObj);
            if (tokenObj == null)
            //validTill
            //delete token
                return 'Token not found';
            if (tokenObj.token != token) {
                return 'Token verification failed';
            }
        } catch (err) {
            console.log(err);
            return 'Error occured in email verification. please try agian.'
        }
        return 'Email verified.'
    }
};
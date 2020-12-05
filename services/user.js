const mangoose = require('mongoose');
const Token = mangoose.model('Token');
const User = mangoose.model('User');

module.exports = {
    registerUser: async function (name, email, password, dob) {
        let user = new User({ name, email, password, dob });

        try {
            await user.save();
        } catch (err) {
            console.log('err.errors stringify',JSON.stringify(err.errors).includes('invalid email address'));
            if(JSON.stringify(err.errors).includes('invalid email address')){
                return { 'success': false, 'msg': 'invalid_email_address' };
            }
            if (err.code == 11000)
                return { 'success': false, 'msg': 'duplicate_key' };
            return { 'success': false, 'msg': 'unable_to_save_user' };
        }
        return { 'success': true, 'msg': 'user_created' };
    },
    loginCredentialsVerification: async function (email, password) {
        try {
            console.log('Before', await User.find({}));
            let user = await User.findOne({ 'email': email });
            console.log('After', await User.find({}));
            console.log('User', user);
            if (!user)
                return { 'success': false, 'msg': 'login_failied' };
            if (!user.isVerified)
                return { 'success': false, 'msg': 'email_not_verified' };
            if (user.password !== password) {
                return { 'success': false, 'msg': 'login_failied' };
            }

        } catch (err) {
            console.log(err);
            return { 'success': false, 'msg': 'login_failied' };
        }

        return { 'success': true, 'msg': 'user_logged_in' };
    },
    veryfyEmail: async function (userId, token) {
        try {
            let tokenObj = await Token.findOne({ 'userId': userId });
            console.log('tokenObj', tokenObj);
            if (tokenObj == null)
                return { 'success': false, 'msg': 'verification_failied' };
            // if(tokenObj.validTill)    
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
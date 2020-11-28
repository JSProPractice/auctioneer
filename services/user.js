const mangoose = require('mongoose');
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
    }
};
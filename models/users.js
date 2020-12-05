const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, 
          unique: true, 
          required: true,
          // validate: {
          //   validator: function(v) {
          //     return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
          //   },
          //   message: props => `${props.value} is not a valid email address!`
          // }
  
  },
  password: {type: String, required: true},
  dob: Date,
  createdAt: {type: Date, default: Date.now},
  isVerified: {type: Boolean, default: false}
});
const validator = function(v) {
  console.log('inside validator',v);
      // return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
      return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
    };

userSchema.path('email').validate(validator,"invalid email address!");
const User = mongoose.model('User', userSchema);
module.exports = User;
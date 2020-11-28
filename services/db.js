const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    connect: function () {
        mongoose.connect(process.env.DB_URL, { 'useNewUrlParser': true, 'useFindAndModify': false, 'useCreateIndex': true, 'useUnifiedTopology': true }).then(() => {
            console.log('Database connected successfully')
        }).catch(err => {
            console.log('Error', err);
        })
    }
};

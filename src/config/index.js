const mongodb = require('./mongo.config');
const jwt = require('./jwt.config');
const mail = require('./mail.config')
module.exports = {
    port:process.env.PORT || 3000,
    mongodb:mongodb,
    jwt:jwt,
    mail:mail
};
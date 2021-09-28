const mongodb = require('./mongo.config');
module.exports = {
    port:process.env.PORT || 3000,
    mongodb:mongodb
}
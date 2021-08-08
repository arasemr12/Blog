const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log('Db connected!')).catch((err) => console.log(err));
}

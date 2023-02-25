const mongoose = require('mongoose');

const connectDb = async () => {
    console.log('connecting to mongo')
    // return mongoose.connect(process.env.DATABASE_URL);
    // return mongoose.connect('mongodb://127.0.0.1:27018/my_database');

}

module.exports = connectDb;

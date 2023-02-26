const mongoose = require('mongoose');

const connectToDb = async (connectionStr, options) => {
  await mongoose.connect(connectionStr, options);
}

module.exports = connectToDb;
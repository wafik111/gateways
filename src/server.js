const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { server, database } = require('./config/config');
const apiController = require('./api/index');
const connectToDb = require('./database');
let httpServer;

const connectionString = `mongodb://${database.host}:${database.port}/${(process.env.NODE_ENV === 'testing') ? database.dbNameTesting : database.dbName}`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

(async function () {
  await connectToDb(connectionString, options);
}());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', apiController);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error handling middleware function
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

httpServer = app.listen(server.port, () => console.log(`Listening at port ${server.port}`));

module.exports = app;
module.exports.httpServer = httpServer;
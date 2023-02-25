require('dotenv').load();
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const fs = require('fs');
const config = require('./config')
const debug = require('debug')('tenex-business-services:server');
const http = require('http');
const mongoose = require('mongoose')
const initDbConnection = require('./sdk/repositories/db/index')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async function () {
  try {
    console.log('connecting to mongo')
    await initDbConnection()
    // await mongoose.connect(`mongodb://${config.DB.HOST}/my_database`);
    console.log('connected succefully ')

  }catch (e){
    console.log('error connecting to mongo', e)
  }

}());


const files = fs.readdirSync('./apis');
files.forEach((file) => {
  if (file.endsWith('.js')) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    app.use(`/api/${file.split('.js')[0]}`, require(`./apis/${file}`));
  }
});

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

express.response.json = function (response) {
  this.setHeader('Content-Type', 'application/json');
  this.send(JSON.stringify(response, null, 4));
};

express.response.success = function (response) {
  this.json({ result: 'success', message: response });
};

express.response.err = function (response, errorcode) {
  if (errorcode === undefined) { errorcode = 404; }
  this.json({ result: 'error', message: response, code: errorcode });
};

const port = !config.HTTP.PORT ? '3000' : config.HTTP.PORT;
app.set('port', port);
const server = http.createServer(app);
server.listen(port);
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
});

module.exports = app;
module.exports.server = server;

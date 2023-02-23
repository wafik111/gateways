require('dotenv').load();
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const fs = require('fs');
const config = require('./config')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const debug = require('debug')('tenex-business-services:server');
const http = require('http');
const mongoose = require('mongoose')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// get the domains from the white labels table and poulate redis with it
(async function () {
  try {
    await mongoose.connect('mongodb://127.0.0.1/my_database');
    console.log('connected succefully ')

  }catch (e){
    console.log('error connecting to mongo', e)
  }

  // const whiteLabels = await whiteLabelsDAO.findAll();
  // const subDomains = mapWhiteLabels(whiteLabels);
  // client = await redisClient.client();
  // await client.set(subdomains, JSON.stringify(subDomains));
}());

// swagger definition
// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Tenex service APIS. with Swagger',
//       version: '0.1.0',
//       description:
//         'This is a swagger documentation for tenex service APIS.',
//       license: {
//         name: 'MIT',
//         url: 'https://spdx.org/licenses/MIT.html',
//       },
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000',
//       },
//     ],
//   },
//   apis: ['./apis/*.js'],
// };
// const specs = swaggerJsdoc(options);
// app.use(
//   '/api-docs',
//   swaggerUi.serve,
//   swaggerUi.setup(specs, { explorer: true }),
// );

/// /////////

// app.use((req, res, next) => {
//   // req.models = models(sequelize);
//   // req.db = sequelize;
//   // req.redis = client;
//   next();
// });

const files = fs.readdirSync('./apis');
files.forEach((file) => {
  if (file.endsWith('.js')) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    app.use(`/api/${file.split('.js')[0]}`, require(`./apis/${file}`));
  }
});

app.use((req, res, next) => {
  next(createError(res.statusCode));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send('<!-- Error -->');
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
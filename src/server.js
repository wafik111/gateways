const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { server, database } = require('./config/config');
const apiController = require('./api/index');

const connectToDb = require('./database');

(async () => {
  const connectionString = `mongodb://${database.host}:${database.port}/${(process.env.NODE_ENV === 'testing') ? database.dbNameTesting : database.dbName }`;
  const options = { useNewUrlParser: true, useUnifiedTopology: true };

  await connectToDb(connectionString, options);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  app.use('/api', apiController);

  app.all('*', async () => {
    throw new Error("Could not find requested url");
  });
  
  app.listen(server.port, () => {
    console.log(`Server started at ${server.port} ...`);
  });
})();
module.exports = {
  server: {
    port: process.env.NODE_SERVER_PORT || 3000
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '27017',
    dbName: process.env.DB_NAME || 'gateways_dev',
    dbNameTesting: process.env.TESTING_DB_NAME || 'gateways_test'

  }
}
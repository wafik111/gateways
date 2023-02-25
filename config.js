module.exports = {
  __DEV__: (process.env.__DEV__ == 'true') ? true:false,

  DB: {
    HOST: process.env.DBhost,
    NAME: process.env.DBname,
    USERNAME: process.env.DBuser,
    PASSWORD: process.env.DBpassword
  },
  HTTP:{
    PORT: '3001'
  }

};

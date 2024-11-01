const dotenv= require('dotenv');

dotenv.config({
    path : "./.env",
});

const cred = {
  db: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true,
    insecureAuth: true,
    connectTimeout: 60000,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};


module.exports = cred;
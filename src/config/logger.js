const dotenv= require('dotenv');

dotenv.config({
    path : "./.env",
});

const winston = require('winston');
const { combine, timestamp, printf, align } = winston.format;

const Logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
      timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
      align(),
      printf((info) => `${info.timestamp} ${info.level} ${info.message}`)
    ),
    transports: [new(winston.transports.File)({filename: process.env.LOG_FILE_LOCATION || 'logs/util.log'})],
})
module.exports = Logger;


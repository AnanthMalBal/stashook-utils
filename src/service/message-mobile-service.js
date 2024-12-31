const Queries = require('../queries/configuration-message-queries');
const Formatter = require('./message-data-formatter');
const Logger = require('../config/logger');

module.exports = {
    sendMobile: async (req, res, next) => {
        Formatter.getMediaConfiguration(req);
    }
}

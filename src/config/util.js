const moment = require('moment');

module.exports = {

    UserType: Object.freeze({
        SuperAdmin: 'SuperAdmin', Admin: 'Admin', Employee: 'Employee'
    }),

    primaryId(key) {
        return key + Date.now();
    },

    getDate(_DateFormat = 'YYYY-MM-DD HH:mm:ss') {
        return moment(Date.now()).format(_DateFormat);
    },

    withPercent(data) {
        return "%" + data + "%";
    },

    withQuote(data) {
        return "'" + data + "'";
    },

    sendError500(req, res, excep) {
        const statusCode = excep.statusCoderes || 500;
        res.status(statusCode, "Error").json({ success: 0, message: excep.message, status: statusCode });
    },

    sendError401(res, message)
    {
        res.status(401).send({
            message: message
        });
        res.end();
    },

    sendError403(res, message)
    {
        res.status(401).send({
            message: message
        });
        res.end();
    },
    
   
}

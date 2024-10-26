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

    getDateRange(fromDate, toDate) {
        if (moment(fromDate, 'YYYY-MM-DD').isSame(moment(toDate, 'YYYY-MM-DD'), 'day'))
            return [toDate];
        let tmpDate = fromDate;
        const dates = [tmpDate];
        do {
            tmpDate = moment(tmpDate).add(1, 'day');
            dates.push(tmpDate.format('YYYY-MM-DD'));
        } while (moment(tmpDate).isBefore(toDate));
        return dates;
    },

    getDateRangeByDays(fromDate, noOfDays) {
        let toDate = moment(fromDate).add(noOfDays, 'day');
        return getDateRange(fromDate, toDate);
    },

    withPercent(data) {
        return "%" + data + "%";
    },

    withQuote(data) {
        return "'" + data + "'";
    },

    sendError500(req, res, excep) {
        const statusCode = excep.statusCoderes || 500;
        res.status(statusCode, "Error").send({ type: 'error', message: excep.message });
        res.end();
    },

    sendError401(res, message) {
        res.status(401).send({
            type: 'error',
            message: message
        });
        res.end();
    },

    sendError403(res, message) {
        res.status(401).send({
            type: 'error',
            message: message
        });
        res.end();
    }
}

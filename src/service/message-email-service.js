const Queries = require('../queries/configuration-message-queries');
const Formatter = require('./message-data-formatter');
const Logger = require('../config/logger');
const nodemailer = require('nodemailer');
const Connection = require('../config/db-connect.js');

module.exports = {
    sendEmail: async (req, res, next) => {
        
        Formatter.getMediaConfiguration(req);

        Connection.query(Queries.MessageTemplate, ['Email', req.body.messageId], function (error, results) {

            if (error)
                Util.sendError401(res, Message.UNABLE_TO_SEND_EMAIL);
            if (results && results.length > 0) {

                let options = emailOptions(req, results[0])
                
                if (req.body.config.value) {

                    const transporter = nodemailer.createTransport(req.body.config.value);

                    transporter.sendMail(options, function (error, infoResults) {

                        if (error)
                            Logger.error("Unable To Send Email " + error + ":: " + JSON.stringify(req.body.email));
                        else
                            Logger.info("Email Send Successfully.");
                    });
                }
            }
        });
    }
}

function emailOptions(req, template) {

    let finalMap = {};

    Formatter.templateMapGenerator(finalMap, req.body.email.dataMap, req.body.email.keyBaseName); //Construct SingleKey For Nested Object
    Formatter.renderSubject(finalMap, template); // Render Template Subject with Data
    Formatter.renderBody(finalMap, template); // Render Template Body Message with Data
    return {
        from: `"${req.body.config.value.auth.displayName}" <${req.body.config.value.auth.user}>`,
        to: req.body.email.to,
        cc: req.body.email.cc,
        bcc: req.body.email.bcc,
        subject: template.subject,
        html: template.message
    };
}

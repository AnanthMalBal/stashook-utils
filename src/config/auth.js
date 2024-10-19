const jsonWebToken = require('jsonwebtoken');
const Util = require('./util');
const AUTHORIZATION = 'authorization';
const APPLICATION_JSON = 'application/json';
const ORIGIN = ' <origin>';
const INVALID_TOKEN = "Unauthorized Access. Invalid Credentials or Token Expired.";
module.exports = {

    validateToken: async function (req, res, next) {
        headers = {

            'Content-Type': APPLICATION_JSON,
            "Access-Control-Allow-Origin": ORIGIN,
            "Access-Control-Allow-Credentials": true
        };

        const token = req.headers[AUTHORIZATION];
        //console.log("::::::::::process.env.ACCESS_TOKEN:::::::::: " + process.env.ACCESS_TOKEN);
        //console.log("::::::::::TOKEN:::::::::: " + token);
        if (!token || token == null) { Util.sendError401(res, INVALID_TOKEN); return ;}

        jsonWebToken.verify(token, process.env.ACCESS_TOKEN, (err, obj) => {

            if (err) { Util.sendError401(res, INVALID_TOKEN); return ;}
            //console.log("::::::::::Embedded Token Details ::::::: " + JSON.stringify(obj));

            req.sessionUser = obj ;
            
            next();
        })
    }
}



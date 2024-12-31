const NodeCache = require("node-cache");
const mediaConfigCache = new NodeCache();
const Queries = require('../queries/configuration-message-queries.js');
const Connection = require('../config/db-connect.js');
const Util = require('../config/util.js');

module.exports = {

    getMediaConfiguration: async (req) => {

        let config_value = mediaConfigCache.get(req.body.config.key);

        if (config_value) {
            req.body.config.value = config_value;
        }
        else {
            let producerId = '';
            if(req.sessionUser && req.sessionUser.producerId) 
                producerId = req.sessionUser.producerId ;
            else if(req.body && req.body.producerId) 
                producerId = req.body.producerId ;
            
            Connection.query(Queries.ProducerConfiguration, [Util.withPercent(producerId), req.body.config.property], function (error, results) {
                if (error)
                    req.body.config.value = undefined;
                else if (results && results.length > 0) {
                    config_value = JSON.parse(results[0].value);
                    mediaConfigCache.set(req.body.config.key, config_value);
                    req.body.config.value = config_value;
                }
            });
        }

    },

    renderSubject: async (finalMap, template) => {
        if (finalMap) {
            for (let [key, value] of Object.entries(finalMap)) {
                let source = '{{' + key + '}}';
                value = value ? value : '';
                template.subject = template.subject.replace(source, value);
            }
        }
    },

    renderBody: async (finalMap, template) => {

        if (finalMap) {
            for (let [key, value] of Object.entries(finalMap)) {
                let source = '{{' + key + '}}';
                value = value ? value : '';
                template.message = template.message.replace(source, value);
            }
        }
    },

    templateMapGenerator: async (finalMap, dataMap, uKey = '') => {
        dataMapGenerator(finalMap, dataMap, uKey);
        //console.log(":::::::dataMap::::::: " + JSON.stringify(dataMap));
        //console.log(":::::::finalMap:::::: " + JSON.stringify(finalMap));
    }
}

function dataMapGenerator(finalMap, dataMap, uKey = ''){
    let pKey = uKey.trim();
    if (dataMap) {
        for (let [key, value] of Object.entries(dataMap)) {
            pKey = (pKey === '') ? key : pKey + '.' + key;
            if (value instanceof Object && !Array.isArray(value)) {
                dataMapGenerator(finalMap, value, pKey); // Recursive Call
            }
            else {
                finalMap[pKey] = value;
                pKey = uKey;
            }
        }
    }
}
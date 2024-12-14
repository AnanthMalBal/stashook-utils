const moment = require('moment');

moment.createFromInputFallback = function (config) {
    // unreliable string magic, or
    config._d = new Date(config._i);
};

module.exports = {

    mask(results, field) {
        const alpha = ['a', 'b', 'c', 'p', 'q', 'r', 's', 'x', 'y', 'z']
        results.forEach(row => {
            let value = row[field] + '';
            let result = '';
            for (i = 0; i < value.length; i++) {
                let char = value.charAt(i);
                if (isNumeric(char))
                    result = result + alpha[char];
                else
                    result = result + char;
            }
            row[field] = result;
            // console.log(">>>>mask>>>>>row[field] >>>>>>> " +  row[field]);
        });

    },

    maskField(value) {
        const alpha = ['a', 'b', 'c', 'p', 'q', 'r', 's', 'x', 'y', 'z']
        let result = '';
        for (i = 0; i < value.length; i++) {
            let char = value.charAt(i);
            if (isNumeric(char))
                result = result + alpha[char];
            else
                result = result + char;
        }
        // console.log(">>>>mask>>>>>row[field] >>>>>>> " +  row[field]);
        return result;
    },

    unmask(results, field) {

        results.forEach(row => {
            row[field] = this.unmaskField(row[field]);
            //console.log(">>>>unmask>>>>>row[field] >>>>>>> " +  row[field]);
        });
    },

    unmaskField(value) {
        const alpha = 'abcpqrsxyz'
        let result = '';
        for (i = 0; i < value.length; i++) {
            let char = value.charAt(i);

            if (isUpperCase(char))
                result = result + char;
            else
                result = result + alpha.indexOf(char);

        }
        console.log(":::::::unmaskField(value)::::::: " + result);
        return result;
    },

    ignore(results, ignores) {
        const keys = jsonKeys(results);

        results.forEach(row => {
            ignores.forEach(key => {
                if (keys.contains(key)) {
                    delete row[key];
                }
            });
        });
    },

    nulls(results, emptyToo = false) {
        const keys = jsonKeys(results);
        results.forEach(row => {
            keys.forEach(key => {
                if (row[key] == null || (emptyToo && row[key] === ""))
                    delete row[key];
            });
        });
    },

    empty(results) {
        this.nulls(results, true);
    },

    dates(results, field, _DateFormat = 'YYYY-MM-DD HH:mm:ss') {

        results.forEach(row => {
            let value = row[field];
            if (value !== undefined && value !== null)
                row[field] = moment(value + '').format(_DateFormat) + '';
            // console.log(">>>>dates>>>>>row[field] >>>>>>> " +  row[field]);
        });
    },

    format(results, field, fn) {

        results.forEach(row => {
            let value = row[field];
            if (value !== undefined && value !== null)
                row[field] = fn(row[field]);
            // console.log(">>>>dates>>>>>row[field] >>>>>>> " +  row[field]);
        });
    },

    bitToInt(results, field) {
        results.forEach(row => {
            let value = row[field];
            if (value === undefined || value === null)
                row[field] = 0;
            else
                row[field] = !!row[field] ? 1 : 0;
            //console.log(">>>>bitAsInt>>>>>row[field] >>>>>>> " +  row[field]);
        });
    }

}


Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};

function jsonKeys(results) {
    let block = true;
    let keys = [];
    results.forEach(row => {
        if (block) {
            keys = Object.keys(row);
            block = false;
        }
    });

    return keys;
};

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseInt(str)) // ...and ensure strings of whitespace fail
};

function isUpperCase(char) {
    const charCode = char.charCodeAt(0);
    return charCode >= 65 && charCode <= 90;
}
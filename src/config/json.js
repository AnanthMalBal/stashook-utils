module.exports = {

    mask(results, field) {
        const alpha = ['a', 'b', 'c', 'p', 'q', 'r', 's', 'x', 'y', 'z']
        results.forEach(row => {
            let value = row[field];
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

    null(results, emptyToo = false) {
        const keys = jsonKeys(results);
        results.forEach(row => {
            keys.forEach(key => {
                if (row[key] == null || (emptyToo && row[key] === ""))
                    delete row[key];
            });
        });
    },

    empty(results) {
        this.null(results, true);
    },
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
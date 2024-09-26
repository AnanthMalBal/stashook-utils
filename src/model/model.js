const config = require('../config/cred');
const helper = require('../config/helper');
const connection = require('../config/db-connect');

module.exports = class Model {

    constructor(table) {
        this.table = table;
    }

    //find all table rows and return the result object:
    findAll(page = 1) {

        let cThis = this;
        return new Promise(function (myResolve, myReject) {
            const offset = helper.getOffset(page, config.listPerPage);

            connection.query('SELECT * FROM ?? LIMIT ?, ?', [cThis.table, offset, config.listPerPage], function (error, result) {
                if (error) throw error;


                myResolve(result);
            });
        });
    }

    //get row by id and return the result object:
    findById(colName, colValue, page = 1) {

        let cThis = this;
        return new Promise(function (myResolve, myReject) {

            const offset = helper.getOffset(page, config.listPerPage);

            connection.query('SELECT * FROM ?? WHERE ? = ? LIMIT ?, ?', [cThis.table, colName, colValue, offset, config.listPerPage], function (error, result) {
                if (error) throw error;
                myResolve(result[0]);
            })
        });

    }

    //insert data via object such as {id: 1, title: 'Hello MySQL'} 
    create(idCol, data) {

        let cThis = this;
        return new Promise(function (myResolve, myReject) {
            connection.query('INSERT INTO ?? SET ?', [cThis.table, data], function (error, result) {

                console.log( cThis.table + " ::: create ::: " + JSON.stringify(result));

                if (error) throw error;

                let data = cThis.findById(idCol, result.insertId, 1);
                data.then(function (value) { myResolve(value) })
                    .catch(function (error) { myReject(error) });

            });
        });

    }


    //update row and return new data as an object
    update(idCol, idVal, data) {

        let cThis = this;
        return new Promise(function (myResolve, myReject) {
            connection.query('UPDATE  ?? SET ? WHERE ? = ?', [cThis.table, data, idCol, idVal], function (error, result) {
                if (error) throw error;

                console.log( cThis.table + " ::: update ::: " + JSON.stringify(result));

                let data = cThis.findById(idCol, idVal);
                data.then(function (value) { myResolve(value) })
                    .catch(function (error) { myReject(error) });

            });
        });

    }

    //update row and return new data as an object as soft delete ... Change status column value 0<=>1
    delete(idCol, idVal, data) {

        let cThis = this;
        return new Promise(function (myResolve, myReject) {
            connection.query('UPDATE  ?? SET status = ? WHERE ? = ?', [cThis.table, data.status, idCol, idVal], function (error, result) {
                if (error) throw error;
                
                console.log( cThis.table + " ::: delete ::: " + JSON.stringify(result));

                let data = cThis.findById(idCol, idVal);
                data.then(function (value) { myResolve(value) })
                    .catch(function (error) { myReject(error) });

            });
        });

    }


    //delete row and return info
    // {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}

    permanentDelete(idCol, idVal) {

        let cThis = this;
        return new Promise(function (myResolve, myReject) {
            connection.query('DELETE FROM  ??  WHERE ? = ?', [cThis.table, idCol, idVal], function (error, result) {
                if (error) throw error;

                console.log( cThis.table + " ::: permanentDelete ::: " + JSON.stringify(result));

                myResolve(result)

            });
        });

    }



}
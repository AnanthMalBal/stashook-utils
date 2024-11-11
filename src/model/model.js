const connection = require('../config/db-connect');

module.exports = class Model {

    constructor(table) {
        this.table = table;
    }

    SearchWithLimit(req, Query)
    {
        const offset = this.getOffset(req);
        return Query + ' ORDER BY ' + req.body.sort + ' LIMIT '+ offset + ',' + req.body.perPage + ';';
        //console.log("::SearchWithLimit:: " + Query);
    }

    searchResults(req, res, results) {
        let cThis = this;
        connection.query(`SELECT COUNT(*) AS totalRows FROM ??`, [this.table], function (error, cntResult) {

            let finalResult = {}

            finalResult.data = results;
            finalResult.sort = req.body.sort;
            finalResult.page = req.body.page;
            finalResult.perPage = req.body.perPage;
            
            if (error || cntResult === undefined) finalResult.totalRows = 0 ;
            else finalResult.totalRows = cntResult[0].totalRows;

            res.json(finalResult);

        });
    }

    getOffset(req) {

        const page = req.body.page ? req.body.page : 1;
        const perPage = req.body.perPage ? req.body.perPage : 10;

        return (page - 1) * [perPage];
    }

    emptyOrRows(rows) {
        if (!rows) {
            return [];
        }
        return rows;
    }

    //insert data via object such as {id: 1, title: 'Hello MySQL'} 
    create(data, idCol) {

        let cThis = this;
        return new Promise(function (myResolve, myReject) {

            connection.query('INSERT INTO ?? SET ?', [cThis.table, data], function (error, result) {

                console.log("::Queries::data:: " + JSON.stringify(data));

                if (error) myReject(error);

                console.log("::Queries::Create:: " + JSON.stringify(error));

                if (result !== undefined && result.affectedRows > 0) {
                    if (idCol)
                        result.insertId = data[idCol];
                    myResolve(result);
                }
                else
                    myReject(new Error("Unable to Insert Data"));
            });
            return;
        });

    }


    //insert data via object such as {id: 1, title: 'Hello MySQL'} 
    createBulk(data) {
        console.log("::Queries::data:: " + JSON.stringify(data));
        let cThis = this;
        return new Promise(function (myResolve, myReject) {

            let cols = '';
            data.cols.forEach(elt => {
                cols = cols + "`" + elt + "`,";
            });

            cols = cols.substring(0, cols.lastIndexOf(','));

            console.log("::Queries::cols:: " + cols);

            connection.query('INSERT INTO ?? (' + cols + ') VALUES ?', [cThis.table, data.values], function (error, result) {

                console.log("::Queries::Create:: " + JSON.stringify(result));

                if (error || result !== undefined && result.affectedRows === 0) myReject(error);

                if (result && result.affectedRows > 0)
                    myResolve(result);
                else
                    myReject(new Error("Unable to Insert Data"));
            });
            return;
        });

    }
}
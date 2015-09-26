var pg = require('pg');
var connectionString = 'postgres://postgres:qwertyisbad@localhost:5432/linguadesk';

function DBClient() {
};

DBClient.get = DBClient.put = function(querySettings, next) {
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query(querySettings.sql, querySettings.parameters);
        
        query.on('row', function(row, result) {
            result.addRow(row);
        });
        
        query.on('end', function(result) {
            var parsedResult = result.rows;
            
            if (querySettings.type) {
                parsedResult = parsedResult.map(function(item){ return new querySettings.type(item); });
            }
            if (querySettings.uniq) {
                parsedResult = parsedResult[0];
            }
                
            return next(err, parsedResult);
        });
        
        if(err) {
          return next(err, null);
        }
        
        done();
    });
};

DBClient.delete = function(strQuery, parameters) {
    pg.connect(connectionString, function(err, client, done) {
        client.query(strQuery, parameters);
        query.on('end', function() {
            client.end();
        });
        if(err) {
          console.log(err);
        }
    });
};

module.exports = DBClient;
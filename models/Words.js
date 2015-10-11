module.exports = function (db)
{
    return {
        add: function (word, id, next) {
            db.get({
                sql: "select * from words where boardid=($1) and original=($2)",
                parameters: [id, word],
                uniq: true
            }, function(err, result) {
                if (err) {
                    return next(err, null);
                } else if (!result) {
                    db.put({
                        sql: "insert into words (boardid, original) values($1, $2)",
                        parameters: [id, word]
                    }, function(err, result) {
                        if (err) {
                            return next(err, null);
                        } else {
                            return next(null, true);
                        }
                    });
                } else {
                    next(null, false);
                }
            });
        },
        addTranslate: function (word, translate, id, next) {
            db.get({
                sql: "select translate from words where boardid=($1) and original=($2)",
                parameters: [id, word],
                uniq: true
            }, function(err, result) {
                if (err) {
                    return next(err, null);
                } else {
                    result = result && result.translate || [];
                    console.log(result);
                    if (result.indexOf(translate) === -1) {
                        result.push(translate);
                        db.put({
                            sql: "update words set translate=($1) where boardid=($2) and original=($3)",
                            parameters: [result, id, word]
                        }, function(err, result) {
                            if (err) {
                                return next(err, null);
                            } else {
                                return next(null, true);
                            }
                        });
                    } else {
                        return (null, false);
                    }
                }
            });
        },
        getAll: function (id, next) {
            if (!isNaN(id) && isFinite(id)) {
                db.get({
                    sql: "select * from words where boardid=($1) order by id",
                    parameters: [id]
                }, function(err, result){
                    if (err) {
                        return next(err, []);
                    } else {
                        return next(null, result || []);
                    }
                });
            }
        }
    }
};
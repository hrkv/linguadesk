var dbClient = require("../models/database");

function Words () {
    
}

Words.add = function (word) {
    translate = translate || "";
    dbClient.put("insert into words values($1)", [word]);
};

Words.getAll = function () {
    return dbClient.getAll("select * from words");
};
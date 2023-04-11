const mysql = require("mysql");

module.exports = {
    insertKanjiSQL: function () {
        const con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "password"
        });
        con.connect((err) => {
            if (err) console.log(err);
            console.log("Connection Established");
        })
        con.query("USE kanjiList");
        //con.query(`INSERT INTO memory (kanji, meaning, reading, stage, lastReviewTime) VALUES ('${data.kanjiToBeReviewed}', '${data.meaningToBeReviewed}', '${data.readingToBeReviewed}', 0, new Date().getTime());`);
        con.query("SELECT * FROM memory", function (err, result) {
            if (err) console.log(err);
            console.log(result);
        })
        console.log(new Date().getTime());

        con.end();
    },

    variousSQL: function () {
        //con.query("CREATE TABLE memory (ID int AUTO_INCREMENT, primary key(ID), kanji varchar(50), meaning varchar(255), reading varchar(50), stage int, latestReviewTime int);")
        //con.query("DROP TABLE memory");
    }
}
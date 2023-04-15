const mysql = require("mysql");

const sqlHost = "localhost";
const sqlUser = "root";
const sqlPassword = "password";

module.exports = {
    insertKanjiSQL: function () {
        const con = mysql.createConnection({
            host: sqlHost,
            user: sqlUser,
            password: sqlPassword
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

    insertUserPass: function (data) {
        const con = mysql.createConnection({
            host: sqlHost,
            user: sqlUser,
            password: sqlPassword
        });
        con.connect((err) => {
            if (err) console.log(err);
            console.log("Connection Established");
        })

        con.query("USE kanjiList");
        con.query(`INSERT INTO userPass (username, password) VALUES ('${data.username}', '${data.password}';`);
        con.query("SELECT * FROM userPass", function (err, result) {
            if (err) console.log(err);
            console.log(result);
        })

        con.end();
    },

    variousSQL: function () {
        const con = mysql.createConnection({
            host: sqlHost,
            user: sqlUser,
            password: sqlPassword
        });
        con.connect((err) => {
            if (err) console.log(err);
        })
        console.log("Connection Established");
        con.query("USE kanjiList");
        con.query("CREATE TABLE userPass (ID int AUTO_INCREMENT, primary key(ID), username varchar(30), password varchar(30);")
        con.query("CREATE TABLE memory (ID int AUTO_INCREMENT, primary key(ID), kanji varchar(50), meaning varchar(255), reading varchar(50), stage int, latestReviewTime int);")
        //con.query("DROP TABLE memory");

        con.end();
    }
}
const mysql = require("mysql");


function makeConnection() {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "kanjiList"
    });
    con.connect((err) => {
        if (err) console.log(err);
        console.log("Connection Established");
    })

    return con;
}

module.exports = {
    insertKanjiSQL: function () {
        let con = makeConnection();

        try {
            con.query(`INSERT INTO memory (kanji, meaning, reading, stage, lastReviewTime) VALUES ('${data.kanjiToBeReviewed}', '${data.meaningToBeReviewed}', '${data.readingToBeReviewed}', 0, new Date().getTime());`);
            con.query("SELECT * FROM memory", function (err, result) {
                if (err) console.log(err);
                console.log(result);
            })
        }
        finally {
            con.end();
        }
    },

    insertEmailPass: function (data) {
        let con = makeConnection();

        try {
            con.query(`INSERT INTO emailPass (email, password) VALUES ('${data.email}', '${data.password}');`);
        }
        finally {
            con.end();
        }
    },

    getEmailPass: function (data) {
        return new Promise(function (resolve, reject) {
            let con = makeConnection();

            con.query(`SELECT * FROM emailPass WHERE email LIKE '%${data.email}%'`, function (err, result) {
                if (err) console.log(err);
                return resolve(result);
            })
        });
    },

    variousSQL: function () {
        let con = makeConnection();

        //con.query("CREATE TABLE emailPass (ID int AUTO_INCREMENT, primary key(ID), email varchar(30), password varchar(30));")
        //con.query("CREATE TABLE memory (ID int AUTO_INCREMENT, primary key(ID), kanji varchar(50), meaning varchar(255), reading varchar(50), stage int, latestReviewTime int);")
        //con.query("DROP TABLE userPass");
        //con.query("DELETE FROM emailPass);
        //con.query("SELECT * FROM emailPass", function (err, result) {if (err) console.log(err); console.log(result);})

        con.end();
    }
}
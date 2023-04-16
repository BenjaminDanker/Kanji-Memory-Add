const mysql = require("mysql");

// mySQL connection 
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
    // Put vocabulary info into database from script
    insertKanjiSQL: function (data) {
        let con = makeConnection();

        try {
            timeOfReview = new Date().getTime()
            con.query(`INSERT INTO memory (kanji, meaning, reading, stage, latestReviewTime) VALUES ('${data.kanjiToBeReviewed}', '${data.meaningToBeReviewed}', '${data.readingToBeReviewed}', 0, ${timeOfReview});`);
            con.query("SELECT * FROM memory", function (err, result) {
                if (err) console.log(err);
                console.log(result);
            })
        }
        finally {
            con.end();
        }
    },

    // Put email and password into database from signup
    insertEmailPass: function (data) {
        let con = makeConnection();

        try {
            con.query(`INSERT INTO emailPass (email, password) VALUES ('${data.email}', '${data.password}');`);
        }
        finally {
            con.end();
        }
    },

    // Get email and password
    getEmailPass: function (data) {
        // uses Promise to wait for query, then return result
        return new Promise(function (resolve, reject) {
            let con = makeConnection();

            try {
                con.query(`SELECT * FROM emailPass WHERE email LIKE '${data.email}'`, function (err, result) {
                    if (err) console.log(err);
                    return resolve(result);
                })
            }
            finally {
                con.end();
            }
        });
    },

    // Miscellaneous mySQL usage
    variousSQL: function () {
        let con = makeConnection();

        //con.query("CREATE TABLE emailPass (ID int AUTO_INCREMENT, primary key(ID), email varchar(30), password varchar(30));")
        //con.query("CREATE TABLE memory (ID int AUTO_INCREMENT, primary key(ID), kanji varchar(50), meaning varchar(255), reading varchar(50), stage int, latestReviewTime bigint);")
        //con.query("DROP TABLE memory");
        //con.query("DELETE FROM memory");
        //con.query("SELECT * FROM emailPass", function (err, result) {if (err) console.log(err); console.log(result);})

        con.end();
    }
}
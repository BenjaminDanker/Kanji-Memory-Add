const mysql = require("mysql");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);


const options = {
    host: "localhost",
    user: "root",
    password: "password",
    database: "kanjiList"
}

// create mySQL connection 
function makeConnection() {
    const con = mysql.createConnection(options);
    con.connect((err) => {
        if (err) console.log(err);
        console.log("Connection Established");
    })

    return con;
}

module.exports = {
    // Put vocabulary info into database from userscript
    insertVocab: function (data, userID) {
        let con = makeConnection();

        try {
            currentTime = new Date().getTime()
            const fourhours = 1000 * 60 * 60 * 4
            nextReviewTime = currentTime + fourhours

            con.query(`INSERT INTO vocab (parent_ID, kanji, meaning, reading, stage, nextReviewTime) VALUES ('${userID}', '${data.kanjiToBeReviewed}', '${data.meaningToBeReviewed}', '${data.readingToBeReviewed}', 0, ${nextReviewTime});`);
        }
        finally {
            con.end();
        }
    },

    // get msqyl connection for session storage
    getSessionConnection: function () {
        const con = mysql.createConnection(options);
        const sessionStore = new MySQLStore({}, con);

        return sessionStore;
    },

    // Get vocab
    getVocab: function (userID) {
        return new Promise(function (resolve, reject) {
            let con = makeConnection();

            try {
                con.query(`SELECT * FROM vocab WHERE parent_ID LIKE ${userID}`, function (err, vocabList) {
                    if (err) console.log(err);
                    return resolve(vocabList);
                })
            }
            finally {
                con.end();
            }
        });
    },

    // Updates database at review end
    updateVocab: function (reviewList) {
        let con = makeConnection();

        try {
            for (let i = 0; i < reviewList.length; i++) {
                con.query(`UPDATE vocab SET stage=${reviewList[i].stage}, nextReviewTime=${reviewList[i].nextReviewTime} WHERE vocabID=${reviewList[i].vocabID}`)
            }
        }
        finally {
            con.end();
        }
    },

    // Put email and password into database from signup
    insertUserInfo: function (data) {
        let con = makeConnection();

        try {
            con.query(`INSERT INTO userInfo (username, email, password) VALUES ('${data.username}', '${data.email}', '${data.password}');`);
        }
        finally {
            con.end();
        }
    },

    // Get email and password
    getUserInfo: function (data) {
        // uses Promise to wait for query, then return result
        return new Promise(function (resolve, reject) {
            let con = makeConnection();

            try {
                con.query(`SELECT * FROM userInfo WHERE email LIKE '${data.email}'`, function (err, result) {
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

        //con.query("CREATE TABLE userInfo (userID int AUTO_INCREMENT, primary key(userID), username varchar(50), email varchar(30), password varchar(30))")
        //con.query("CREATE TABLE vocab (parent_ID int, INDEX index_parent_ID (parent_ID), FOREIGN KEY (parent_ID) REFERENCES userInfo(userID) ON UPDATE CASCADE ON DELETE CASCADE, vocabID int AUTO_INCREMENT, primary key(vocabID), kanji varchar(50), meaning varchar(255), reading varchar(50), stage int, nextReviewTime bigint)")
        //con.query("DROP TABLE vocab");
        //con.query("DROP TABLE userInfo");
        //con.query(`INSERT INTO test (kanji, meaning, reading, stage, latestReviewTime) VALUES ('${data.kanjiToBeReviewed}', '${data.meaningToBeReviewed}', '${data.readingToBeReviewed}', 0, ${timeOfReview});`);
        //con.query(`SELECT * FROM vocab WHERE parent_ID LIKE 3`, function (err, result) { if (err) console.log(err); console.log(result); })
        //con.query("SELECT * FROM userInfo", function (err, result) { if (err) console.log(err); console.log(result); })
        con.query("SELECT * FROM sessions", function (err, result) { if (err) console.log(err); console.log(result); })
        //con.query("DELETE FROM sessions");
        con.end();
    }
}
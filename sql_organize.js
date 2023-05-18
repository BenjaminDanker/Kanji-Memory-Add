const mysql2 = require("mysql2");
const mysql = require("mysql2/promise");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

// hashmap creation
const fourhours = 1000 * 60 * 60 * 4
const eighthours = 1000 * 60 * 60 * 4
const oneday = 1000 * 60 * 60 * 24
const twodays = 1000 * 60 * 60 * 24 * 2
const oneweek = 1000 * 60 * 60 * 24 * 7
const twoweeks = 1000 * 60 * 60 * 24 * 7 * 2
const fourmonths = 10512000000

const stageTimesMap = new Map();
stageTimesMap.set(0, fourhours);
stageTimesMap.set(1, eighthours);
stageTimesMap.set(2, oneday);
stageTimesMap.set(3, twodays);
stageTimesMap.set(4, oneweek);
stageTimesMap.set(5, twoweeks);
stageTimesMap.set(6, fourmonths);
//

const options = {
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "password",
    database: process.env.MYSQLDATABASE || "kanjiList",
    port: process.env.MYSQLPORT || ""
}

// create mySQL connection 
function makeConnection() {
    const con = mysql.createConnection(process.env.JAWSDB_URL);
    console.log("Connection Established")

    return con;
}

module.exports = {
    // get msqyl connection for session storage
    getSessionConnection: function () {
        const con = mysql2.createConnection(process.env.JAWSDB_URL);
        const sessionStore = new MySQLStore({}, con);

        return sessionStore;
    },

    // Put vocabulary info into database from userscript
    insertVocab: async function (data, userID) {
        let con = await makeConnection();

        try {
            currentTime = new Date().getTime();
            const fourhours = 1000 * 60 * 60 * 4;
            nextReviewTime = currentTime + fourhours;

            await con.query(`INSERT INTO vocab (parent_ID, kanji, meaning, reading, stage, nextReviewTime) VALUES ("${userID}", "${data.kanjiToBeReviewed}", "${data.meaningToBeReviewed}", "${data.readingToBeReviewed}", 0, ${nextReviewTime});`);
        }
        finally {
            con.end();
        }
    },

    // Get vocab
    getVocab: async function (userID) {
        let con = await makeConnection();

        try {
            let [result, fields] = await con.query(`SELECT * FROM vocab WHERE parent_ID LIKE ${userID}`);
            return result
        }
        finally {
            con.end();
        }
    },

    // Updates database at review end
    updateVocab: async function (checkIfList, reviewList) {
        let con = await makeConnection();

        try {
            for (let i = 0; i < checkIfList.length; i++) {
                if (checkIfList[i].check === true) {
                    // set the next time to review
                    currentTime = new Date().getTime();
                    var nextTime = stageTimesMap.get(parseInt(reviewList[i].stage));

                    reviewList[i].nextReviewTime = currentTime + nextTime;
                    //

                    reviewList[i].stage += 1;

                    await con.query(`UPDATE vocab SET stage=${reviewList[i].stage}, nextReviewTime=${reviewList[i].nextReviewTime} WHERE vocabID=${reviewList[i].vocabID}`);
                }
            }
        }
        finally {
            con.end();
        }
    },

    // Put email and password into database from signup
    insertUserInfo: async function (data) {
        let con = await makeConnection();

        try {
            await con.query(`INSERT INTO userInfo (username, email, password) VALUES ('${data.username}', '${data.email}', '${data.password}');`);
        }
        finally {
            con.end();
        }
    },

    // Get email and password
    getUserInfo: async function (data) {
        let con = await makeConnection();

        try {
            let [result, fields] = await con.query(`SELECT * FROM userInfo WHERE email LIKE '${data.email}'`)
            return result
        }
        finally {
            con.end();
        }
    },

    // Miscellaneous mySQL usage
    variousSQL: async function () {
        let con = await makeConnection();

        //con.query("CREATE TABLE userInfo (userID int AUTO_INCREMENT, primary key(userID), username varchar(50), email varchar(30), password varchar(30))")
        //con.query("CREATE TABLE vocab (parent_ID int, INDEX index_parent_ID (parent_ID), FOREIGN KEY (parent_ID) REFERENCES userInfo(userID) ON UPDATE CASCADE ON DELETE CASCADE, vocabID int AUTO_INCREMENT, primary key(vocabID), kanji varchar(50), meaning varchar(1000), reading varchar(50), stage int, nextReviewTime bigint)")
        //con.query("DROP TABLE vocab");
        //con.query("DROP TABLE userInfo");
        //con.query(`INSERT INTO test (kanji, meaning, reading, stage, latestReviewTime) VALUES ('${data.kanjiToBeReviewed}', '${data.meaningToBeReviewed}', '${data.readingToBeReviewed}', 0, ${timeOfReview});`);
        //con.query(`SELECT * FROM vocab WHERE parent_ID LIKE 2`, function (err, result) { if (err) console.log(err); console.log(result); })
        //let [result, fields] = await con.query("SELECT * FROM userInfo")
        let [result, fields] = await con.query("SELECT * FROM sessions")
        //con.query("DELETE FROM userInfo");
        console.log(result)
        con.end();
    }
}
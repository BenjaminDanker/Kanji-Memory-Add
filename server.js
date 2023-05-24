const sql_organize = require("./sql_organize");
const util_functions = require("./util_functions");
const express = require("express");
const session = require("express-session");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");


const address = "kanji-memory.herokuapp";


const app = express();
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            scriptSrc: ["'self'", "'unsafe-inline'", address]
        }
    }
}));
app.use(RateLimit({
    windowMs: 1000 * 60,
    max: 20
}));
app.use(session({
    secret: "unknownsecret",
    store: sql_organize.getSessionConnection(),
    cookie: { secure: true, maxAge: 500000000000 },
    proxy: true,
    resave: false,
    saveUninitialized: false
}));
app.use(compression());
app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3000);


// Handle request to check for vocabulary in database
app.post("/checkForVocab", async function (req, res) {
    let data = req.body;
    console.log("/checkForVocab res", data)
    // get user information stored in database
    let userInfo = await sql_organize.getUserInfo(data);

    if (typeof userInfo !== "undefined") {
        //  check if password matches
        if (userInfo[0].password === data.password) {
            // check if sent vocab is already in database
            let ifVocabList = await sql_organize.checkVocab(userInfo[0].userID, data.kanjiList.split(","));

            res.send(JSON.stringify(ifVocabList));
        }
    }
});

// Handle request to add vocabulary to database
app.post("/addVocab", async function (req, res) {
    let data = req.body;

    // get user information stored in database
    let userInfo = await sql_organize.getUserInfo(data);

    //  check if password matches
    if (userInfo[0].password === data.password) {
        // put vocab into database
        sql_organize.insertVocab(data, userInfo[0].userID);

        res.send("Added");
    }
});

// Handle home page between logged in and logged out
app.get("/", async function (req, res) {
    if (req.session.userID === undefined) {
        res.render("index.ejs", { loggedin: false });
    }
    else {
        let vocabList = await sql_organize.getVocab(req.session.userID);

        let currentTime = new Date().getTime();
        let reviewList = util_functions.getReviewList(vocabList, currentTime);

        res.render("index.ejs", {
            loggedin: true,
            username: req.session.username,
            reviewLength: reviewList.length
        });
    }
});

// Handle signup page
app.get("/signup", function (req, res) {
    res.render("signup.ejs", { ifInfo: false});
});

// Handle request to signup
app.post("/addSignup", async function (req, res) {
    let data = req.body;

    // if already registered
    let tempInfo = await sql_organize.getUserInfo(data);
    if (tempInfo.length > 0) {
        res.render("signup.ejs", { ifInfo: true });
    }
    else {
        // put username, email, and password into database
        await sql_organize.insertUserInfo(data);

        // make user session from signup data then send back to index.ejs
        let userInfo = await sql_organize.getUserInfo(data);

        req.session.userID = userInfo[0].userID;
        req.session.username = userInfo[0].username;

        res.redirect("/");
        //
    }
});

// Handle login page
app.get("/login", function (req, res) {
    res.render("login.ejs", { ifInfo: true });
});

// Handle request to login
app.post("/addLogin", async function (req, res) {
    let data = req.body;

  // get/verify email and password, then make user session
    let userInfo = await sql_organize.getUserInfo(data);

    if (userInfo.length === 0) {
        res.render("login.ejs", { ifInfo: false });
    }
    else {
        req.session.userID = userInfo[0].userID;
        req.session.username = userInfo[0].username;

        res.redirect("/");
    }
  //
});

// Handle request to logout
app.get("/logout", function (req, res) {
    req.session.destroy();

    res.render("index.ejs", { loggedin: false });
});

// Redirects to home page if not logged in
//    currently only used on review page
function isLoggedin(req, res, next) {
    if (req.session.userID) {
        next();
    }
    else {
        res.redirect("/");
    }
}

// Handle review page
app.get("/review", isLoggedin, async function (req, res) {
    let vocabList = await sql_organize.getVocab(req.session.userID);

    let currentTime = new Date().getTime();
    let reviewList = util_functions.getReviewList(vocabList, currentTime);

    // put time of when review is started into session
    req.session.currentTime = currentTime;

    if (reviewList.length > 0) {
        res.render("review.ejs", { reviewList });
    }
    else {
        res.redirect("/");
    }
});

// Handles call for end of review
app.post("/reviewEnd", async function (req, res) {
    let checkIfList = JSON.parse(req.body.checkIfList);

    let vocabList = await sql_organize.getVocab(req.session.userID);
    let reviewList = util_functions.getReviewList(vocabList, req.session.currentTime);

    sql_organize.updateVocab(checkIfList, reviewList);

    // reset session current time for debugging purposes
    req.session.currentTime = 0;

    res.redirect("/");
});

//sql_organize.variousSQL();
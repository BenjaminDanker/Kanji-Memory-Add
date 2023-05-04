const sql_organize = require("./sql_organize");
const util_functions = require("./util_functions");
const express = require("express");
const session = require("express-session");


const app = express();
app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "unknownsecret",
    store: sql_organize.getSessionConnection(),
    cookie: {secure: false, maxAge: 500000000000},
    resave: false,
    saveUninitialized: false
}));
app.listen(3000);


// Handle request to add vocabulary to database
app.post("/addVocab", async function (req, res) {
    data = req.body;

  // get/verify email and password, to put into database
    let userInfo = await sql_organize.getUserInfo(data)
    if (userInfo[0].password === data.password) {
        sql_organize.insertVocab(data, userInfo[0].userID);
    }
  //
});

// Handle home page between logged in and logged out
app.get("/", async function (req, res) {
    if (req.session.userID === undefined) {
        res.render("index.ejs", { loggedin: false });
    }
    else {
        let vocabList = await sql_organize.getVocab(req.session.userID)
        let reviewList = util_functions.getReviewList(vocabList);

        res.render("index.ejs", {
            loggedin: true,
            username: req.session.username,
            reviewLength: reviewList.length
        });
    }
});

// Handle signup page
app.get("/signup", function (req, res) {
    res.render("signup.ejs");
});

// Handle request to signup
app.post("/addSignup", async function (req, res) {
    data = req.body;

    // put username, email, and password into database
    await sql_organize.insertUserInfo(data);

  // make user session then send back to index.ejs
    let userInfo = await sql_organize.getUserInfo(data);

    req.session.userID = userInfo[0].userID;
    req.session.username = userInfo[0].username;

    res.redirect("/");
  //
});

// Handle login page
app.get("/login", function (req, res) {
    res.render("login.ejs", { ifInfo: true });
});

// Handle request to login
app.post("/addLogin", async function (req, res) {
    data = req.body;

  // get/verify email and password, then make user session
    let userInfo = await sql_organize.getUserInfo(data)

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
    let vocabList = await sql_organize.getVocab(req.session.userID)

    let reviewList = util_functions.getReviewList(vocabList);

    req.session.reviewList = reviewList;

    if (reviewList.length > 0) {
        res.render("review.ejs", { reviewList });
    }
    else {
        res.redirect("/");
    }
});

// Handles call for end of review
app.post("/reviewEnd", function (req, res) {
    let checkIfList = JSON.parse(req.body.checkIfList);

    sql_organize.updateVocab(checkIfList, req.session.reviewList);

    req.session.reviewList = [];

    res.redirect("/");
});

//sql_organize.variousSQL();
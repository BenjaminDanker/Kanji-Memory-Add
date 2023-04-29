const sql_organize = require("./sql_organize");
const util_functions = require("./util_functions")
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
app.post("/addVocab", function (req, res) {
    data = req.body;

  // get/verify email and password, to put into database
    sql_organize.getUserInfo(data).then(function (result) {
        if (result[0].password === data.password) {
            sql_organize.insertVocab(data, result[0].userID);
        }
    }).catch((err) => setImmediate(() => { throw err; }));
  //
});

// Handle home page between logged in and logged out
app.get("/", function (req, res) {
    if (req.session.userID === undefined) {
        res.render("index.ejs", { loggedin: false });
    }
    else {
        sql_organize.getVocab(req.session.userID).then(function (vocabList) {
            let reviewList = util_functions.getReviewList(vocabList);

            res.render("index.ejs", {
                loggedin: true,
                username: req.session.username,
                reviewLength: reviewList.length
            });
        });
    }
});

// Handle request to signup
app.post("/addSignup", function (req, res) {
    data = req.body;

    // put email and password into database
    sql_organize.insertUserInfo(data);

    res.redirect("/login.html");
});

// Handle request to login
app.post("/addLogin", function (req, res) {
    data = req.body;

  // get/verify email and password, then make user session
    sql_organize.getUserInfo(data).then(function (userInfo) {
        if (userInfo[0].password === data.password) {
            req.session.userID = userInfo[0].userID;
            req.session.username = userInfo[0].username

            res.redirect("/");
        }
    }).catch((err) => setImmediate(() => { throw err; }));
  //
});

// Handle request to logout
app.get("/logout", function (req, res) {
    req.session.userID = undefined;

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
app.get("/review", isLoggedin, function (req, res) {
    sql_organize.getVocab(req.session.userID).then(function (vocabList) {
        let reviewList = util_functions.getReviewList(vocabList);

        if (reviewList.length > 0) {
            res.render("review.ejs", { reviewList });
        }
        else {
            res.redirect("/");
        }
    })
});

// Handles call for end of review
app.post("/reviewEnd", function (req, res) {
    let reviewList = JSON.parse(req.body.reviewList);

    sql_organize.updateVocab(reviewList);

    res.redirect("/");
});

//sql_organize.variousSQL();
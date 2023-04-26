const sql_organize = require("./sql_organize");
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
app.post("/addVocab", (req, res) => {
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
        res.render("index.ejs", { loggedin: true, username: req.session.username });
    }
});

// Handle request to signup
app.post("/addSignup", (req, res) => {
    data = req.body;

    // put email and password into database
    sql_organize.insertUserInfo(data);

    res.redirect("/login.html");
});

// Handle request to login
app.post("/addLogin", (req, res) => {
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
app.get("/logout", (req, res) => {
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
app.get("/review", isLoggedin, (req, res) => {
    sql_organize.getVocab(req.session.userID).then(function (vocabList) {
      // put only vocab past review due date into new list
        currentTime = new Date().getTime();
        let reviewList = [];
        for (let i = 0; i < vocabList.length; i++) {
            // if current vocab stage less than max (7), and current time is greater than next review time
            if (vocabList[i].stage < 7 && vocabList[i].nextReviewTime < currentTime) {
                reviewList.push(vocabList[i]);
            }
        }
      //

        if (reviewList.length > 0) {
            // add 'end' as an indicator to stop review
            reviewList.push("end");

            res.render("review.ejs", { reviewList });
        }
        else {
            res.redirect("/");
        }
    })
});

// Handles call for end of review
//      due to using ajax for the call, redirect is done in page script
app.post("/reviewEnd", (req, res) => {
    let reviewList = req.body.reviewList;

    // remove 'end'
    reviewList.pop();

    sql_organize.updateVocab(reviewList);
});

//sql_organize.variousSQL();
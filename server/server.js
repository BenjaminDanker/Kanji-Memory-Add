const sql_organize = require("./sql_organize");
const express = require("express");
const session = require("express-session");


const app = express();
app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "unknownsecret",
    //cookie: { secure: true }
}))
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
    if (req.session.user === undefined) {
        res.render("index.ejs", { loggedin: false });
    }
    else {
        res.render("index.ejs", { loggedin: true });
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
            req.session.user = userInfo[0].userID;
            res.redirect("/");
        }
    }).catch((err) => setImmediate(() => { throw err; }));
  //
});

// Handle request to logout
app.get("/logout", (req, res) => {
    req.session.user = undefined;

    res.render("index.ejs", { loggedin: false });
});

// Checks if already logged in
//    currently only used on review page
function isLoggedin(req, res, next) {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect("/");
    }
}

// Handle review page
app.get("/review", isLoggedin, (req, res) => {
    sql_organize.getVocab(req.session.user).then(function (reviewList) {
        // add 'end' as an indicator to stop review
        reviewList.push("end");

        res.render("review.ejs", { reviewList });
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
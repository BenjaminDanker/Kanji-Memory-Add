const sql_organize = require("./sql_organize");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");


const app = express();
app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "unknownsecret",
    //cookie: { secure: true }
}))
app.listen(3000);


let data = null;


// Handle request to add vocabulary to database
app.post("/addKanji", (req, res) => {
    data = req.body;

  // get/verify email and password, to put into database
    sql_organize.getEmailPass(data).then(function (result) {
        if (result[0].password === data.password) {
            sql_organize.insertKanjiSQL(data);
        }
    }).catch((err) => setImmediate(() => { throw err; }));
  //
});

// Handle request to signup
app.post("/addSignup", (req, res) => {
    data = req.body;

    // put email and password into database
    sql_organize.insertEmailPass(data);

    // make user session to stay logged in
    req.session.user = data.email;

    res.redirect("/login.html");
});

// Handle request to login
app.post("/addLogin", (req, res) => {
    data = req.body;

  // get/verify email and password, then make user session
    sql_organize.getEmailPass(data).then(function (result) {
        if (result[0].password === data.password) {
            req.session.user = result[0].email;
            res.redirect("..");
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

// Handle request to logout
app.get("/logout", (req, res) => {
    req.session.user = undefined;

    res.render("index.ejs", { loggedin: false });
});

//sql_organize.variousSQL();
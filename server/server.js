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
const email = "123";
const server_password = "123";


app.post("/addKanji", (req, res) => {
    data = req.body;

    if (data.email === email && data.password === server_password) {
        sql_organize.insertKanjiSQL();
    }
});

app.post("/addSignup", (req, res) => {
    data = req.body;

    sql_organize.insertEmailPass(data);

    req.session.user = data.email;

    res.redirect("/login.html");
});

app.post("/addLogin", (req, res) => {
    data = req.body;

    sql_organize.getEmailPass(data).then(function (result) {
        req.session.user = result[0].email;
        res.redirect("..");
    }).catch((err) => setImmediate(() => { throw err; }));
});

app.get("/", function (req, res) {
    if (req.session.user === undefined) {
        res.render("index.ejs", { loggedin: false });
    }
    else {
        res.render("index.ejs", { loggedin: true });
    }
});

app.get("/logout", (req, res) => {
    req.session.user = undefined;

    res.render("index.ejs", { loggedin: false });
});

//sql_organize.variousSQL();
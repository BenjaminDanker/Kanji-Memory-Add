const sql_organize = require("./sql_organize");
const express = require("express");


const app = express();
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.listen(3000);

let data = null;
const email = "123";
const server_password = "123";

app.post("/addKanji", (req, res) => {
    data = req.body;
    console.log(data);
    res.send("Received");

    if (data.email === email && data.password === server_password) {
        let val = sql_organize.insertKanjiSQL();
    }
});

app.post("/addSignup", (req, res) => {
    data = req.body;

    let val = sql_organize.insertUserPass(data);

    res.redirect("/index")
})

sql_organize.variousSQL();
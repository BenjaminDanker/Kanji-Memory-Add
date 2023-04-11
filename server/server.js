const sql_organize = require("./sql_organize");
const express = require("express");


const app = express();
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.listen(3000);

let data = null;
const server_password = "123";

app.post("/", (req, res) => {
    data = req.body;
    console.log(data);
    res.send("Received");

    if (checkPassword() === true) {
        let val = sql_organize.insertKanjiSQL();
    }
});
sql_organize.variousSQL();
function checkPassword() {
    if (data.password === server_password) {
        return true;
    }
}
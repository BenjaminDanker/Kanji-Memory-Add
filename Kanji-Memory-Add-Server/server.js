const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.listen(3000);
app.post("/", (req, res) => {
    let data = req.body;
    console.log(data.kanjiList);
    res.send("Received");
})
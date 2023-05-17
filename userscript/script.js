// ==UserScript==
// @name         Kanji Memory Add
// @version      0.1
// @description  Takes kanji from jisho.org and adds to memory bank.
// @author       SilverGem
// @match        https://jisho.org/search/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==


(function () {
    const kanjiList = [];
    const meaningList = [];
    const readingList = [];
    const URL = "http://localhost:3000/addVocab";
    const EMAIL = "";
    const PASSWORD = "";
    // Put kanji, meaning, reading into respective lists
    function getElementsWords() {
        // get all words columns
        const elementsWordsList = document.getElementsByClassName("concept_light clearfix");
        //
        for (let i = 0; i < elementsWordsList.length; i++) {
            // create kanji string list
            var kanjiTextElement = elementsWordsList[i].getElementsByClassName("text")
            if (kanjiTextElement.length > 0) {
                kanjiList.push(kanjiTextElement[0].innerText);
            }
            //
            // create meaning string list
            const tempMeaningList = [];
            const elementsMeaningList = elementsWordsList[i].getElementsByClassName("meaning-meaning");
            for (let i2 = 0; i2 < elementsMeaningList.length; i2++) {
                tempMeaningList.push(elementsMeaningList[i2].innerText);
            }
            meaningList.push(tempMeaningList);
            //
            // create reading string list
            readingList.push(document.getElementsByClassName("furigana")[i].innerText);
            //
        }
    }
    // Create button for each kanji tied to sendData
    function createButtons() {
        for (let i = 0; i < kanjiList.length; i++) {
            // create button
            var btn = document.createElement('button');
            btn.innerHTML = `<button id='myButton${i}' type='button' style='height:10px'> +`;
            btn.addEventListener('click', function () {
                sendData(kanjiList[i], meaningList[i], readingList[i]);
            });
            //
            // put button onto website page
            document.getElementsByClassName("concept_light-representation")[i].appendChild(btn);
            //
        }
    }
    // Send data tied to singular button
    function sendData(kanjiToBeReviewed, meaningToBeReviewed, readingToBeReviewed) {
        GM_xmlhttpRequest({
            method: "POST",
            url: URL,
            data: "email=" + encodeURIComponent(EMAIL) + "&" +
                "password=" + encodeURIComponent(PASSWORD) + "&" +
                "kanjiToBeReviewed=" + encodeURIComponent(kanjiToBeReviewed) + "&" +
                "meaningToBeReviewed=" + encodeURIComponent(meaningToBeReviewed) + "&" +
                "readingToBeReviewed=" + encodeURIComponent(readingToBeReviewed)
            ,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function (response) {
                console.log(response.responseText);
            }
        });
    }
    getElementsWords();
    createButtons();
})();
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
    const URL = "http://localhost:3000/addKanji";
    const PASSWORD = "123";
    function getElementsWords() {
        // get all words columns
        const elementsWordsList = document.getElementsByClassName("concept_light clearfix");
        //
        for (let i = 0; i < elementsWordsList.length; i++) {
            // create kanji string list
            kanjiList.push(elementsWordsList[i].getElementsByClassName("text")[0].innerText);
            //
            // create meaning string list
            const tempMeaningList = []
            const elementsMeaningList = elementsWordsList[i].getElementsByClassName("meaning-meaning");
            for (let i2 = 0; i2 < elementsMeaningList.length; i2++) {
                tempMeaningList.push(elementsMeaningList[i2].innerText);
            }
            meaningList.push(tempMeaningList);
            //
            // create reading string list
            readingList.push(document.getElementsByClassName("furigana")[i].innerText)
        }
    }
    function createButtons() {
        for (let i = 0; i < kanjiList.length; i++) {
            var btn = document.createElement('button');
            btn.innerHTML = `<button id='myButton${i}' type='button' style='height:10px'> +`;
            btn.addEventListener('click', function () {
                sendData(kanjiList[i], meaningList[i], readingList[i]);
            });
            document.getElementsByClassName("concept_light-representation")[i].appendChild(btn);
        }
    }
    function sendData(kanjiToBeReviewed, meaningToBeReviewed, readingToBeReviewed) {
        GM_xmlhttpRequest({
            method: "POST",
            url: URL,
            data: "email=" + encodeURIComponent("123") + "&" +
                "password=" + encodeURIComponent("123") + "&" +
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
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
    const URL = "https://kanji-memory.herokuapp.com/addVocab";
    const EMAIL = "";
    const PASSWORD = "";
    // Put kanji, reading, and meaning into respective lists
    function getElementsWords() {
        const elementsKanjiReadingList = document.getElementsByClassName("concept_light-representation");
        const elementsHolderMeaningList = document.getElementsByClassName("concept_light-meanings");
        //
        for (let i = 0; i < elementsKanjiReadingList.length; i++) {
            kanjiList.push(elementsKanjiReadingList[i].children["1"].innerText); // kanji string list
            readingList.push(elementsKanjiReadingList[i].children["0"].innerText); // reading string list
            // nested meaning string list
            var elementsMeaningList = elementsHolderMeaningList[i].getElementsByClassName("meaning-meaning");
            var meaningString = "";
            for (let j = 0; j < elementsMeaningList.length; j++) {
                //grammar string
                var grammarString = elementsMeaningList[j].parentNode.parentNode.previousSibling.innerText;
                meaningString += grammarString + '\n';
                //
                // meaning string
                meaningString += elementsMeaningList[j].innerText;
                meaningString += "\n\n";
                //
            }
            meaningList.push(meaningString);
            //
        }
    }
    // Create button for each kanji tied to sendData
    function createButtons() {
        for (let i = 0; i < kanjiList.length; i++) {
            // create button
            var btn = document.createElement('button');
            btn.innerHTML = `<button id='sendButton${i}' type='button' style='height:0px'> + </button>`;
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
    try {
        getElementsWords();
        createButtons();
    }
    catch (exception) { }
})();
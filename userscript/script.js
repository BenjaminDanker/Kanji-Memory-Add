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
    // Create hyperlink for each kanji tied to sendData
    function createHLink() {
        for (let i = 0; i < kanjiList.length; i++) {
            // create hyperlink
            var hLink = document.createElement('a');
            // change hyperlink attributes
            hLink.id = `sendHLink${i}`;
            hLink.style.textDecoration = 'none';
            hLink.innerText = "+";
            //
            hLink.addEventListener("click", clickedLink.bind(null, i), { once: true });
            //
            // put hyperlink onto website page
            document.getElementsByClassName("concept_light-representation")[i].appendChild(hLink);
            //
        }
    }
    // event listener calling
    function clickedLink(i) {
        // change hyperlink to green when clicked
        var hLinkElementChange = document.getElementById(`sendHLink${i}`);
        hLinkElementChange.style.color = 'green';
        //
        // send clicked hyperlink's connected kanji data
        sendData(kanjiList[i], meaningList[i], readingList[i]);
    }
    // Send data tied to singular hyper link
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
        createHLink();
    }
    catch (exception) { }
})();
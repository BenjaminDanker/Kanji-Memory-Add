// ==UserScript==
// @name         Japanese Memory Add
// @version      0.1
// @description  Takes kanji from jisho.org and adds to memory bank.
// @author       SilverGem
// @match        https://jisho.org/search/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==


(function() {
    const btnLst = [];
    const kanjiList = [];
    const meaningList = [];
    const URL = "http://localhost:3000/"
    function getElementsWords() {
      // get all words columns
        const elementsWordsList = document.getElementsByClassName("concept_light clearfix");
      //
        for (let i=0; i < elementsWordsList.length; i++) {
          // create kanji string list
            kanjiList.push(elementsWordsList[i].getElementsByClassName("text")[0].innerText);
          //
          // create meaning string list
            const tempMeaningList = []
            const elementsMeaningList = elementsWordsList[i].getElementsByClassName("meaning-meaning");
            for (let i=0; i < elementsMeaningList.length; i++) {
                tempMeaningList.push(elementsMeaningList[i].innerText);
            }
            meaningList.push(tempMeaningList);
          //
        }
    }
    function createButtons() {
        for (let i=0; i < kanjiList.length; i++) {
            var btn = document.createElement('button');
            btn.innerHTML = `<button id='myButton${i}' type='button' style='height:10px'> +`;
            btn.addEventListener('click', function () {
            });
            btnLst.push(btn);
            document.getElementsByClassName("concept_light-representation")[i].appendChild(btn);
        }
    }
    function sendData() {
        GM_xmlhttpRequest( {
            method:     "POST",
            url:        URL,
            data:       "kanjiList=" + encodeURIComponent(kanjiList) + "&" +
            "meaningList=" + encodeURIComponent(meaningList)
            ,
            headers:    {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload:     function (response) {
                console.log (response.responseText);
            }
        });
    }
    getElementsWords();
    createButtons();
    sendData();
})();
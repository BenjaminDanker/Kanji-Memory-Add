module.exports = {
    // Put only vocab past review due date into new list
    getReviewList: function (vocabList, currentTime) {
        let reviewList = [];

        for (let i = 0; i < vocabList.length; i++) {
            // if current vocab stage less than max (7), and current time is greater than next review time
            if (vocabList[i].stage < 7 && vocabList[i].nextReviewTime < currentTime) {
                reviewList.push(vocabList[i]);
            }
        }

        return reviewList;
    }
}
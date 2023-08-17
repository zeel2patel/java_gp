const libraryScores = (function () {
    let numTurns = 0;
    let numMatches = 0;
    const scoresKey = "memoryGameScores";

    function saveScoresToLocalStorage(scores) {
        localStorage.setItem(scoresKey, JSON.stringify(scores));
    }

    function getScoresFromLocalStorage() {
        const storedScores = localStorage.getItem(scoresKey);
        return storedScores ? JSON.parse(storedScores) : {};
    }

    const scores = {
        incrementTurns: function () {
            numTurns++;
            console.log("numTurns", numTurns);
        },
        incrementMatches: function () {
            numMatches++;
            console.log("numMatches", numMatches);
        },
        showMatch: function () {
            return this.numMatches;
        },
        calculatePercentage: function (totalCards) {
            if (numTurns === 0) {
                return 0;
            }
            console.log("calculatePercentage:", "numMatches=", numMatches, "numTurns=",numTurns );
            return (numMatches / numTurns) * 100;
        },
        compareScores: function (playerScore) {
            const savedScores = getScoresFromLocalStorage();
            const previousHighScore = savedScores[playerScore.playerName] || 0;
            if (playerScore.score > previousHighScore) {
                savedScores[playerScore.playerName] = playerScore.score;
                saveScoresToLocalStorage(savedScores);
            }
        },
        displayHighScore: function (playerName) {
            const savedScores = getScoresFromLocalStorage();
            const highScore = savedScores[playerName] || 0;
            console.log(`${playerName}'s High Score: ${highScore}`);
            //$("#high_score").val(highScore);
        }
    };

    return scores;
})();

export default libraryScores;

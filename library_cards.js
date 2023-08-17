const libraryCards = (function () {
    const cardBackSrc = 'images/back.png';
    const blankCardSrc = 'images/blank.png';
    let numImages = 0;

    function preloadImages(imagePaths, callback) {
        let loadedImages = 0;
        for (let i = 0; i < imagePaths.length; i++) {
            const img = new Image();
            img.onload = function () {
                loadedImages++;
                if (loadedImages === imagePaths.length) {
                    callback();
                }
            };
            img.src = imagePaths[i];
        }
    }

    function createCardHTML(imgSrc) {
        const cardDiv = $("<div>").addClass("card").append($("<img>").attr("src", cardBackSrc).attr("data-original-src", imgSrc));
        //              $("<div>").addClass("card").append($("<img>").attr("src", "images/back.png").attr("data-original-src", imgSrc));
        return cardDiv;
    }

    /* ------------------- errorus to implement ------------------------
    function flipCardFadeEffect(img) {
        img.fadeOut(200, function () {
            img.attr("src", newSrc);
            img.fadeIn(200);
        });
    }
    function flipCardSlideEffect(img) {
        img.slideUp(400, function () {
            img.attr("src", "images/blank.png");
            img.slideDown(400);
        });
    }*/

    function getNumImages() {
        return numImages;
    }

    function getCardBackSrc() {
        return cardBackSrc;
    }

    function getBlankCardSrc() {
        return blankCardSrc;
    }

    // Function to shuffle an array using the Fisher-Yates algorithm
    function shuffleArray(array) {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }

    function generateFinalImagePaths(shuffledImagePaths, numCards) {
        const numUniqueCards = Math.floor(numCards / 2);
        const shuffledUniqueImagePaths = shuffleArray(shuffledImagePaths.slice(0, numUniqueCards));
        const pairedImagePaths = [...shuffledUniqueImagePaths, ...shuffledUniqueImagePaths];
        return shuffleArray(pairedImagePaths);
    }

    return {
        preloadImages,
        createCardHTML,
        //flipCardFadeEffect,
        //flipCardSlideEffect,
        getNumImages,
        getCardBackSrc,
        getBlankCardSrc,
        shuffleArray,
        generateFinalImagePaths
    };
})();

export default libraryCards;
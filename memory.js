import memoryGameSettings from './library_settings.js';
import libraryScores from './library_scores.js';
import libraryCards from './library_cards.js';
import libraryCard from './library_card.js';

$(function () {
    $("#tabs").tabs();

    const imagePaths = [
        //'images/back.png',
        //'images/blank.png',
        'images/card_1.png',
        'images/card_2.png',
        'images/card_3.png',
        'images/card_4.png',
        'images/card_5.png',
        'images/card_6.png',
        'images/card_7.png',
        'images/card_8.png',
        'images/card_9.png',
        'images/card_10.png',
        'images/card_11.png',
        'images/card_12.png',
        'images/card_13.png',
        'images/card_14.png',
        'images/card_15.png',
        'images/card_16.png',
        'images/card_17.png',
        'images/card_18.png',
        'images/card_19.png',
        'images/card_20.png',
        'images/card_21.png',
        'images/card_22.png',
        'images/card_23.png',
        'images/card_24.png'
    ];

    // Preload images and display them in the 'cards' div
    libraryCards.preloadImages(imagePaths, function () {
        // Set default values for player name and number of cards
        const defaultPlayerName = "Krunal_Default";
        const defaultNumCards = 48;

        // Load player name from session storage or use default
        const savedSettings = sessionStorage.getItem("memoryGameSettings")
            ? JSON.parse(sessionStorage.getItem("memoryGameSettings"))
            : { playerName: defaultPlayerName, numCards: defaultNumCards };

        //$("#player_name").val(savedSettings.playerName);
        //$("#num_cards").val(savedSettings.numCards);

        // Load player name from memoryGameSettings object and update input field
        $("#player_name").val(memoryGameSettings.playerName);
        // Load number of cards from memoryGameSettings object and update input field
        $("#num_cards").val(memoryGameSettings.numCards);

        // Update the player name display
        updatePlayerNameDisplay();

        // Update the card layout
        updateCardLayout(savedSettings.numCards);

        // Suppose highScore is the value you want to save
        //const maxscore = 0;
        //const maxscore = parseInt(sessionStorage.getItem("memoryGameHighScore"), 10) || 0;

        // Save the high score in session storage
        //sessionStorage.setItem("memoryGameHighScore", maxscore);
        const memoryGameScores = JSON.parse(localStorage.getItem("memoryGameScores"));

        if (memoryGameScores && memoryGameScores[memoryGameSettings.playerName]) {
            const highScore = memoryGameScores[memoryGameSettings.playerName];
            $("#high_score").text("HighScore: Player: " + highScore);
        } else {
            $("#high_score").text("HighScore: Yet to score.");
        }
    });

    // ::Task-8
    let flippedCards = [];
    let matchedPairs = 0;

    // Function to update card layout
    function updateCardLayout(numCards) {


        // Clear existing cards
        const cardsDiv = $("#cards");
        cardsDiv.empty();

        // Calculate rows and columns
        const numRows = Math.ceil(numCards / 8);


        // Randomly shuffle the image paths
        const shuffledImagePaths = libraryCards.shuffleArray(imagePaths);

        // Calculate the number of unique cards to display (half of numCards)
        const numUniqueCards = Math.floor(numCards / 2);


        /* 
        // ----------------------------- used in libraryCards.generateFinalImagePaths() function:------------------------------------------------------
            // Calculate the number of unique cards to display (half of numCards)
            const numUniqueCards = Math.floor(numCards / 2);
            // Select the first numUniqueCards images for uniqueness
            const uniqueImagePaths = shuffledImagePaths.slice(0, numUniqueCards);
            // Shuffle the unique image paths to randomize their order
            const shuffledUniqueImagePaths = libraryCards.shuffleArray(uniqueImagePaths);
            // Duplicate the shuffled unique image paths to ensure pairs
            const pairedImagePaths = [...shuffledUniqueImagePaths, ...shuffledUniqueImagePaths];
            // Shuffle the paired image paths to randomize their order
            const finalImagePaths = libraryCards.shuffleArray(pairedImagePaths);
        */

        const finalImagePaths = libraryCards.generateFinalImagePaths(shuffledImagePaths, numCards);

        // Generate the card elements and append them to the row divs
        for (let row = 0; row < numRows; row++) {
            const rowDiv = $("<div>").addClass("card-row");

            for (let col = 0; col < 8; col++) {
                const cardIndex = row * 8 + col;
                const imgSrc = finalImagePaths[cardIndex % finalImagePaths.length];
                const cardDiv = libraryCards.createCardHTML(imgSrc);
                rowDiv.append(cardDiv);
            }

            cardsDiv.append(rowDiv);
        }

        // Add click handling to the images
        /*$(".card img").on("click", function () {
            const img = $(this);
            const currentSrc = img.attr("src");
            const newSrc = currentSrc.includes("back.png") ? img.attr("data-original-src") : "images/back.png";

            img.fadeOut(200, function () {
                img.attr("src", newSrc);
                img.fadeIn(200);
            });
        });*/

        $(".card img").on("click", function () {
            const img = $(this);

            const anchorTag = img.closest('a');
            const cardObject = libraryCard.createCardObject(anchorTag);

            const currentSrc = img.attr("src");
            const newSrc = currentSrc.includes(libraryCards.getCardBackSrc()) ? img.attr("data-original-src") : libraryCards.getCardBackSrc();
            //const newSrc = currentSrc.includes("back.png") ? img.attr("data-original-src") : "images/back.png";

            // Check if the card is already flipped or is a matching card with "blank.png" source
            if (!img.hasClass("flipped") && newSrc !== libraryCards.getBlankCardSrc()) {
                // libraryCards.flipCardFadeEffect(img, newSrc, function () {  --> error To-do:3
                img.fadeOut(200, function () {
                    img.attr("src", newSrc);
                    img.fadeIn(200);

                    if (flippedCards.length < 2) {
                        flippedCards.push(img);

                        if (flippedCards.length === 2) {
                            // Increment the number of turns
                            libraryScores.incrementTurns();

                            const firstCard = flippedCards[0];
                            const secondCard = flippedCards[1];

                            if (firstCard.attr("data-original-src") === secondCard.attr("data-original-src")) {
                                // Cards match, slide them off the board
                                firstCard.slideUp(400, function () {
                                    firstCard.attr("src", "images/blank.png");
                                    firstCard.slideDown(400);
                                });

                                secondCard.slideUp(400, function () {
                                    secondCard.attr("src", "images/blank.png");
                                    secondCard.slideDown(400);
                                });

                                // Mark matching cards as flipped
                                firstCard.addClass("flipped");
                                secondCard.addClass("flipped");
                                console.log("matched");

                                // Increment matched pairs count
                                matchedPairs++;
                                libraryScores.incrementMatches();

                                console.log("macthed pair: ", matchedPairs);
                                console.log("numUniqueCards: ", numUniqueCards);


                                // Check if all pairs have been matched
                                /*if (matchedPairs === imagePaths.length / 2) {
                                    const highScore = imagePaths.length / 2;
                                    alert("Congratulations! You've matched all pairs. Your high score is: " + highScore);
                                }*/
                                if (matchedPairs === numUniqueCards) {
                                    const highScore = matchedPairs * 2;

                                    const playerName = memoryGameSettings.playerName;
                                    // Create a playerScore object
                                    const playerScore = {
                                        playerName: playerName,
                                        score: highScore
                                    };
                                    //const playerName = memoryGameSettings.playerName;
                                    // Create a playerScore object
                                    /*const playerScore = {
                                        playerName: playerName,
                                        score: libraryScores.showMatch()
                                    };*/

                                    // Compare and save high score
                                    libraryScores.compareScores(playerScore);
                                    console.log("------------------------------------------------------------");
                                    console.log(playerScore);

                                    // Display high score
                                    libraryScores.displayHighScore(playerName);

                                    // Show congratulations alert
                                    alert("Congratulations! You've matched all pairs. \nYour high score is: " + highScore);
                                    window.location.reload();
                                    
                                    /*if (highScore > parseInt(sessionStorage.getItem("memoryGameHighScore"), 10)) {
                                        sessionStorage.setItem("memoryGameHighScore", highScore);
                                        console.log("new highscore: ", highScore);
                                        console.log("new highscore: ", parseInt(sessionStorage.getItem("memoryGameHighScore"), 10));
                                    }
                                    alert("Congratulations! You've matched all pairs. \nYour high score is: " + highScore);*/
                                }
                                // Display the score
                                const percentage = libraryScores.calculatePercentage(numUniqueCards * 2);
                                $("#correct").text(`Correct: ${percentage.toFixed(2)}%`);
                            } else {
                                // Cards do not match, flip them back
                                setTimeout(function () {
                                    firstCard.fadeOut(200, function () {
                                        firstCard.attr("src", "images/back.png");
                                        firstCard.fadeIn(200);
                                    });
                                    secondCard.fadeOut(200, function () {
                                        secondCard.attr("src", "images/back.png");
                                        secondCard.fadeIn(200);
                                    });
                                }, 1000);
                            }
                            flippedCards = [];
                        }
                    }
                });
            }
        });


    }

    // Function to update player name display
    function updatePlayerNameDisplay() {
        const playerName = sessionStorage.getItem("memoryGameSettings")
            ? JSON.parse(sessionStorage.getItem("memoryGameSettings")).playerName
            : "";

        $("#player").text("Player: " + playerName);
    }

    // Load player name from session storage on page load
    updatePlayerNameDisplay();

    // Handle Save Settings button click
    $("#save_settings").click(function () {
        const playerName = $("#player_name").val();
        const numCards = parseInt($("#num_cards").val(), 10);

        // Save settings in session storage
        //saveSettingsToSessionStorage(playerName, numCards);
        // Update memoryGameSettings object
        memoryGameSettings.playerName = playerName;
        memoryGameSettings.numCards = numCards;

        // Update the player name and card layout
        updatePlayerNameDisplay();
        updateCardLayout(numCards);

        // Reload the page
        location.reload();
    });

    // Function to save settings in session storage
    /*function saveSettingsToSessionStorage(playerName, numCards) {
        const settings = {
            playerName: playerName,
            numCards: numCards
        };

        sessionStorage.setItem("memoryGameSettings", JSON.stringify(settings));
    }*/
});
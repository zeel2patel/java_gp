document.addEventListener('DOMContentLoaded', function() {
  var playerName;
  var highScore;
  var numCards;
  var flippedCards = [];

  var playerNameInput = document.getElementById('player_name');
  var numCardsSelect = document.getElementById('num_cards');
  var saveSettingsBtn = document.getElementById('save_settings');
  var newGameLink = document.getElementById('new_game');
  var playerElem = document.getElementById('player');
  var playerHighScoreElem = document.getElementById('high_score');
  var playerScoreElem = document.getElementById('correct');
  var cardsContainer = document.getElementById('cards');

  function generateGameCards() {
    // Generate an array of card objects based on the selected number of cards
    var imagesArray = [
      'card_1.png',
      'card_2.png',
      // Add more image sources here for all the card images
    ];

    var cardsArray = [];

    for (var i = 0; i < numCards / 2; i++) {
      var imageIndex = i % imagesArray.length;
      var card1 = {
        id: 'card_' + i + '_1',
        src: imagesArray[imageIndex],
        flipped: false
      };

      var card2 = {
        id: 'card_' + i + '_2',
        src: imagesArray[imageIndex],
        flipped: false
      };

      cardsArray.push(card1);
      cardsArray.push(card2);
    }

    // Shuffle the cards array
    cardsArray.sort(function() {
      return 0.5 - Math.random();
    });

    return cardsArray;
  }

  function renderGameCards() {
    var cardsArray = generateGameCards();

    cardsContainer.innerHTML = ''; // Clear the existing cards

    for (var i = 0; i < cardsArray.length; i++) {
      var card = cardsArray[i];

      var cardLink = document.createElement('a');
      cardLink.setAttribute('id', card.id);
      cardLink.setAttribute('href', '#');
      cardLink.addEventListener('click', function() {
        handleCardClick(card);
      });

      var cardImage = document.createElement('img');
      cardImage.setAttribute('src', 'back.png');
      cardImage.setAttribute('alt', '');

      cardLink.appendChild(cardImage);
      cardsContainer.appendChild(cardLink);
    }
  }

  function handleCardClick(card) {
    if (flippedCards.length < 2 && !card.flipped) {
      flipCard(card);
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        cardsContainer.removeEventListener('click', handleCardClick);
        setTimeout(checkForMatch, 1000);
      }
    }
  }

  function flipCard(card) {
    card.flipped = true;
    var imgElem = document.querySelector('#' + card.id + ' img');
    imgElem.src = card.src;
  }

  function checkForMatch() {
    var card1 = flippedCards[0];
    var card2 = flippedCards[1];

    if (card1.src === card2.src) {
      removeMatchedCards(card1, card2);
    } else {
      unflipCards(card1, card2);
    }

    flippedCards = []; // Clear the flipped cards array
  }

  function removeMatchedCards(card1, card2) {
    var card1Elem = document.getElementById(card1.id);
    var card2Elem = document.getElementById(card2.id);

    card1Elem.style.transition = 'transform 0.5s ease-out';
    card1Elem.style.transform = 'translateX(-100%)';
    card2Elem.style.transition = 'transform 0.5s ease-out';
    card2Elem.style.transform = 'translateX(100%)';

    setTimeout(function() {
      card1Elem.style.display = 'none';
      card2Elem.style.display = 'none';

      updateScore();
      checkGameEnd();
    }, 500);
  }

  function unflipCards(card1, card2) {
    var card1Elem = document.getElementById(card1.id);
    var card2Elem = document.getElementById(card2.id);

    card1Elem.style.transition = 'opacity 0.5s ease-out';
    card1Elem.style.opacity = '0';
    card2Elem.style.transition = 'opacity 0.5s ease-out';
    card2Elem.style.opacity = '0';

    setTimeout(function() {
      card1Elem.style.transition = '';
      card1Elem.style.opacity = '1';
      card2Elem.style.transition = '';
      card2Elem.style.opacity = '1';

      var img1Elem = document.querySelector('#' + card1.id + ' img');
      var img2Elem = document.querySelector('#' + card2.id + ' img');

      img1Elem.src = 'back.png';
      img2Elem.src = 'back.png';

      updateScore();
      checkGameEnd();
    }, 2000);
  }

  function updateScore() {
    var numCorrect = cardsContainer.getElementsByClassName('hidden').length;
    var percentage = (numCorrect / numCards) * 100;
    playerScoreElem.textContent = 'Score: ' + percentage.toFixed(2) + '%';

    if (percentage > highScore) {
      highScore = percentage;
      playerHighScoreElem.textContent = 'High Score: ' + highScore.toFixed(2) + '%';
      localStorage.setItem('highScore', highScore.toFixed(2));
    }
  }

  function checkGameEnd() {
    var hiddenCards = cardsContainer.getElementsByClassName('hidden');

    if (hiddenCards.length === numCards) {
      cardsContainer.removeEventListener('click', handleCardClick);
      playerScoreElem.textContent = 'Game Over!';
    } else {
      cardsContainer.addEventListener('click', handleCardClick);
    }
  }

  function loadSettings() {
    playerName = sessionStorage.getItem('playerName');
    highScore = parseFloat(localStorage.getItem('highScore'));
    numCards = parseInt(sessionStorage.getItem('numCards'));

    if (!playerName) {
      playerName = 'Player';
    }

    if (!highScore || isNaN(highScore)) {
      highScore = 0;
    }

    if (!numCards || isNaN(numCards)) {
      numCards = 48;
    }

    playerNameInput.value = playerName;
    numCardsSelect.value = numCards;
    playerElem.textContent = 'Player: ' + playerName;
    playerHighScoreElem.textContent = 'High Score: ' + highScore.toFixed(2) + '%';
  }

  function saveSettings() {
    playerName = playerNameInput.value;
    numCards = parseInt(numCardsSelect.value);

    sessionStorage.setItem('playerName', playerName);
    sessionStorage.setItem('numCards', numCards);

    location.reload();
  }

  function startNewGame() {
    loadSettings();
    generateGameCards();
    renderGameCards();
    flippedCards = []; // Clear the flipped cards array
    playerScoreElem.textContent = 'Score: 0%';

    cardsContainer.addEventListener('click', handleCardClick);
  }

  saveSettingsBtn.addEventListener('click', saveSettings);
  newGameLink.addEventListener('click', startNewGame);

  function preloadImages(imageSources, callback) {
    var loadedImages = 0;
    var totalImages = imageSources.length;

    function imageLoaded() {
      loadedImages++;

      if (loadedImages === totalImages) {
        callback();
      }
    }

    for (var i = 0; i < totalImages; i++) {
      var image = new Image();
      image.onload = imageLoaded;
      image.src = imageSources[i];
    }
  }

  var imageSources = [
    'back.png',
    'card_1.png',
    'card_2.png',
    // Add more image sources here for all the card images
  ];

  preloadImages(imageSources, startNewGame);
});

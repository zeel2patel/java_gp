$(document).ready(function() {
    // Preload images
    var images = [
        'card_1.png', 'card_2.png', 'card_3.png', 'card_4.png',
        'card_5.png', 'card_6.png', 'card_7.png', 'card_8.png',
        'card_9.png', 'card_10.png', 'card_11.png', 'card_12.png',
        'card_13.png', 'card_14.png', 'card_15.png', 'card_16.png',
        'card_17.png', 'card_18.png', 'card_19.png', 'card_20.png',
        'card_21.png', 'card_22.png', 'card_23.png', 'card_24.png',
        'back.png', 'blank.png'
    ];
    preloadImages(images);

    // Initialize game
    var playerName = sessionStorage.getItem('playerName') || 'Player';
    var numCards = sessionStorage.getItem('numCards') || 48;
    initializeGame(playerName, numCards);

    // Event listeners
    $('#new_game a').on('click', function(e) {
        e.preventDefault();
        resetGame();
    });

    $('#save_settings').on('click', function() {
        var playerName = $('#player_name').val();
        var numCards = $('#num_cards').val();
        sessionStorage.setItem('playerName', playerName);
        sessionStorage.setItem('numCards', numCards);
        location.reload();
    });

    // Functions
    function preloadImages(images) {
        for (var i = 0; i < images.length; i++) {
            var img = new Image();
            img.src = 'images/' + images[i];
        }
    }

    function generateCards(numCards) {
        var cardImages = [];
        for (var i = 1; i <= numCards / 2; i++) {
            cardImages.push('card_' + i + '.png');
            cardImages.push('card_' + i + '.png');
        }
        shuffleArray(cardImages);
        return cardImages;
    }

    function initializeGame(playerName, numCards) {
        $('#player').text('Player: ' + playerName);
        $('#num_cards').val(numCards);

        var cards = generateCards(numCards);
        displayCards(cards);
    }

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    function displayCards(cards) {
        var $cardsContainer = $('#cards');
        $cardsContainer.empty();
      
        var numRows = Math.ceil(cards.length / 8);
        for (var i = 0; i < numRows; i++) {
          var $row = $('<div class="card-row"></div>');
          for (var j = 0; j < 8; j++) {
            var cardIndex = i * 8 + j;
            if (cardIndex < cards.length) {
              var cardImage = cards[cardIndex];
              var $card = $('<a href="#"><div class="card"><div class="card-front"><img src="images/back.png" alt=""></div><div class="card-back"><img src="images/' + cardImage + '" alt=""></div></div></a>');
              $row.append($card);
            } else {
              var $blankCard = $('<a href="#"><div class="card"><div class="card-front"><img src="images/blank.png" alt=""></div><div class="card-back"><img src="images/blank.png" alt=""></div></div></a>');
              $row.append($blankCard);
            }
          }
          $cardsContainer.append($row);
        }
      
        $cardsContainer.on('click', '.card', function(e) {
          e.preventDefault();
          var $card = $(this);
          var $front = $card.find('.card-front');
          var $back = $card.find('.card-back');
      
          if (!$card.hasClass('flipped')) {
            $front.fadeOut(500, function() {
              $back.fadeIn(500);
              $card.addClass('flipped');
            });
          } else {
            $back.fadeOut(500, function() {
              $front.fadeIn(500);
              $card.removeClass('flipped');
            });
          }
        });
      }
});

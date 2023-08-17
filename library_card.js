class Card {
    constructor(aTag) {
        this.cardId = aTag.attr('id');
        this.imgTag = aTag.find('img');
    }

    isRevealedOrBlank() {
        //     img.hasClass("flipped") && newSrc !== libraryCards.getBlankCardSrc()
        return this.imgTag.hasClass('flipped') || this.imgTag.attr('src') === libraryCard.getBlankCardSrc();
    }

    isMatching(firstCard) {
        //     firstCard.attr("data-original-src") === secondCard.attr("data-original-src")
        return this.cardId === firstCard.cardId;
    }
}

const libraryCard = {
    createCardObject(atag) {
        return new Card(atag);
    }
};

export default libraryCard;
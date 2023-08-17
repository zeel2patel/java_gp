// Create a settings object for the memory game
const memoryGameSettings = {    
    set numCards(num) {
        const settings = JSON.parse(sessionStorage.getItem("memoryGameSettings")) || {};
        settings.numCards = num;
        sessionStorage.setItem("memoryGameSettings", JSON.stringify(settings));
    },
    set playerName(name) {
        const settings = JSON.parse(sessionStorage.getItem("memoryGameSettings")) || {};
        settings.playerName = name;
        sessionStorage.setItem("memoryGameSettings", JSON.stringify(settings));
    },
    get numCards() {
        const savedSettings = sessionStorage.getItem("memoryGameSettings");
        if (savedSettings) {
            return JSON.parse(savedSettings).numCards;
        } else {
            return 48;
        }
    },
    get playerName() {
        const savedSettings = sessionStorage.getItem("memoryGameSettings");
        if (savedSettings) {
            return JSON.parse(savedSettings).playerName;
        } else {
            return "Krunal_Default";
        }
    }
};

// Export the settings object
export default memoryGameSettings;

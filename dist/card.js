"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
function createCard(data) {
    const heroCards = [];
    for (let i = 0; i < data.length; i++) {
        heroCards.push(createHeroCard(data[i]));
    }
    return botbuilder_1.MessageFactory.carousel(heroCards);
}
exports.createCard = createCard;
function createHeroCard(data) {
    let img = `https://db.pokemongohub.net/images/official/detail/${data.dex}.png`;
    let button = {
        type: botbuilder_1.ActionTypes.OpenUrl,
        title: "Learn more...",
        value: `https://db.pokemongohub.net/pokemon/${data.dex}`
    };
    let title = data.species;
    let text = `HP: ${data.HP} | ATK: ${data.attack} | DEF: ${data.defense}
              Types: ${data.types}
              Speed: ${data.speed}
              Sp Attack: ${data.spattack} | Sp Defense: ${data.spdefense}`;
    return botbuilder_1.CardFactory.thumbnailCard(title, text, [img], botbuilder_1.CardFactory.actions([button]));
}
exports.createHeroCard = createHeroCard;
//# sourceMappingURL=card.js.map
import { Pokemon } from './types';
import { MessageFactory, CardFactory, ActionTypes } from "botbuilder";

export function createCard(data: Pokemon[]) {
  const heroCards = [];
  for (let i = 0; i < data.length; i ++) {
      heroCards.push(createHeroCard(data[i]));
  }
  return MessageFactory.carousel(heroCards);
}

export function createHeroCard(data: Pokemon) {
  let img:string = `https://db.pokemongohub.net/images/official/detail/${data.dex}.png`;
  let button = {
    type: ActionTypes.OpenUrl,
    title: "Learn more...",
    value: `https://db.pokemongohub.net/pokemon/${data.dex}`
  }
  let title = data.species;
  let text = `HP: ${data.HP} | ATK: ${data.attack} | DEF: ${data.defense}
              Types: ${data.types}
              Speed: ${data.speed}
              Sp Attack: ${data.spattack} | Sp Defense: ${data.spdefense}`;
  return CardFactory.thumbnailCard(title, text, [img], CardFactory.actions([button]) );
}
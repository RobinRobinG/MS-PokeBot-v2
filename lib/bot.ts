import { TurnContext, Activity } from "botbuilder";
import { QnAMaker, LuisRecognizer } from "botbuilder-ai";
import { Pokemon } from "./types";
import { getData } from "./parser";
import { createCard } from "./card";

export class PokeBot {
  private _qnaMaker: QnAMaker;
  private _luis: LuisRecognizer;
  constructor(  qnaMaker: QnAMaker, luis: LuisRecognizer) {
    this._qnaMaker = qnaMaker;
    this._luis = luis;
  }
  async onTurn(context: TurnContext) {
    if(context.activity.type === "message") {
      if(!context.responded){
        const qnaResults = await this._qnaMaker.generateAnswer(context.activity.text);
        if(qnaResults.length > 0  && qnaResults[0].score > 0.65 ) {
          await context.sendActivity(qnaResults[0].answer);
        } else {
          await this._luis.recognize(context).then (async res => {
            const top = await LuisRecognizer.topIntent(res);
            //context.sendActivity(`The top intent found was ${top}`);
            let data: Pokemon[] = await getData(res.entities);
            if (data.length >= 1) {
              if (top === "Pokemon") {
                  await context.sendActivity(createCard(data));
                } else if (top === "Types") {
                  await context.sendActivity(`${res.entities.subject}'s types are ${data[0].types}`);
                } else if (top === "Abilities") {
                  await context.sendActivity(`${res.entities.subject}'s abilities are ${data[0].abilities}`);
                } else if (top === "HiddenAbility") {
                  await context.sendActivity(`${res.entities.subject}'s hidden ability is ${data[0].HP}`);
                } else if (top === "HP") {
                  await context.sendActivity(`${res.entities.subject}'s HP is ${data[0].HP}`);
                } else if (top === "Attack") {
                  await context.sendActivity(`${res.entities.subject}'s attack is ${data[0].attack}`);
                } else if (top === "Defense") {
                  await context.sendActivity(`${res.entities.subject}'s defense is ${data[0].defense}`);
                } else if (top === "Speed") {
                  await context.sendActivity(`${res.entities.subject}'s speed is ${data[0].speed}`);
                } else if (top === "SpAttack") {
                  await context.sendActivity(`${res.entities.subject}'s special attack is ${data[0].spattack}`);
                } else if (top === "SpDefense") {
                  await context.sendActivity(`${res.entities.subject}'s special defense is ${data[0].spdefense}`);
                } else if (top === "Experience") {
                  await context.sendActivity(`${res.entities.subject}'s experience is ${data[0].experience}`);
                } else if (top === "RateType") {
                  await context.sendActivity(`${res.entities.subject}'s rate type is ${data[0].ratetype}`);
                } else {
                  await context.sendActivity(`Bzzzz, sorry, I'm not a psychic type, I couldn't figure out what you meant.`);
                }
            } else {
              await context.sendActivity(`Bzzzz, sorry, I can't find ${res.entities.subject} in my database. ☠`);
            }
        }).catch(err => {console.log(err)})
      }
    } else {
      await context.sendActivity(`<mr mime face>`);
      }
    }
  }
}
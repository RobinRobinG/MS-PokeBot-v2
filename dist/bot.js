"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const botbuilder_ai_1 = require("botbuilder-ai");
const parser_1 = require("./parser");
const card_1 = require("./card");
class PokeBot {
    constructor(qnaMaker, luis) {
        this._qnaMaker = qnaMaker;
        this._luis = luis;
    }
    onTurn(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.activity.type === botbuilder_1.ActivityTypes.Message) {
                if (!context.responded) {
                    const qnaResults = yield this._qnaMaker.generateAnswer(context.activity.text);
                    if (qnaResults.length > 0 && qnaResults[0].score > 0.65) {
                        yield context.sendActivity(qnaResults[0].answer);
                    }
                    else {
                        yield this._luis.recognize(context).then((res) => __awaiter(this, void 0, void 0, function* () {
                            const top = yield botbuilder_ai_1.LuisRecognizer.topIntent(res);
                            let data = yield parser_1.getData(res.entities);
                            if (data.length >= 1) {
                                if (top === "Pokemon") {
                                    yield context.sendActivity(card_1.createCard(data));
                                }
                                else if (top === "Types") {
                                    yield context.sendActivity(`${res.entities.subject}'s types are ${data[0].types}`);
                                }
                                else if (top === "Abilities") {
                                    yield context.sendActivity(`${res.entities.subject}'s abilities are ${data[0].abilities}`);
                                }
                                else if (top === "HiddenAbility") {
                                    yield context.sendActivity(`${res.entities.subject}'s hidden ability is ${data[0].HP}`);
                                }
                                else if (top === "HP") {
                                    yield context.sendActivity(`${res.entities.subject}'s HP is ${data[0].HP}`);
                                }
                                else if (top === "Attack") {
                                    yield context.sendActivity(`${res.entities.subject}'s attack is ${data[0].attack}`);
                                }
                                else if (top === "Defense") {
                                    yield context.sendActivity(`${res.entities.subject}'s defense is ${data[0].defense}`);
                                }
                                else if (top === "Speed") {
                                    yield context.sendActivity(`${res.entities.subject}'s speed is ${data[0].speed}`);
                                }
                                else if (top === "SpAttack") {
                                    yield context.sendActivity(`${res.entities.subject}'s special attack is ${data[0].spattack}`);
                                }
                                else if (top === "SpDefense") {
                                    yield context.sendActivity(`${res.entities.subject}'s special defense is ${data[0].spdefense}`);
                                }
                                else if (top === "Experience") {
                                    yield context.sendActivity(`${res.entities.subject}'s experience is ${data[0].experience}`);
                                }
                                else if (top === "RateType") {
                                    yield context.sendActivity(`${res.entities.subject}'s rate type is ${data[0].ratetype}`);
                                }
                                else {
                                    yield context.sendActivity(`Bzzzz, sorry, I'm not a psychic type, I couldn't figure out what you meant.`);
                                }
                            }
                            else {
                                yield context.sendActivity(`Bzzzz, sorry, I can't find ${res.entities.subject} in my database. ☠`);
                            }
                        })).catch(err => { console.log(err); });
                    }
                }
                else {
                    yield context.sendActivity(`<mr mime face>`);
                }
            }
        });
    }
}
exports.PokeBot = PokeBot;
//# sourceMappingURL=bot.js.map
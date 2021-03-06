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
const botframework_config_1 = require("botframework-config");
const restify = require("restify");
const bot_1 = require("./bot");
const dotenv_1 = require("dotenv");
dotenv_1.config();
const botConfig = botframework_config_1.BotConfiguration.loadSync("./Rotom.bot", process.env.botFileSecret);
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`${server.name} listening on ${server.url}`);
});
const adapter = new botbuilder_1.BotFrameworkAdapter({
    appId: process.env.microsoftAppID,
    appPassword: process.env.microsoftAppPassword,
    channelService: process.env.ChannelService,
    openIdMetadata: process.env.BotOpenIdMetadata
});
const qnamaker = new botbuilder_ai_1.QnAMaker({
    knowledgeBaseId: botConfig.findServiceByNameOrId("PokeBotKB").kbId,
    endpointKey: botConfig.findServiceByNameOrId("PokeBotKB").endpointKey,
    host: botConfig.findServiceByNameOrId("PokeBotKB").hostname,
});
const luis = new botbuilder_ai_1.LuisRecognizer({
    applicationId: botConfig.findServiceByNameOrId("pokeBot").appId,
    endpointKey: botConfig.findServiceByNameOrId("pokeBot").subscriptionKey,
    endpoint: botConfig.findServiceByNameOrId("pokeBot").getEndpoint(),
});
let poke;
try {
    poke = new bot_1.PokeBot(qnamaker, luis);
}
catch (err) {
    console.error(`[botInitializationError]: ${err}`);
    process.exit();
}
server.post('/api/messages', (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        yield poke.onTurn(context);
    }));
}));
//# sourceMappingURL=app.js.map
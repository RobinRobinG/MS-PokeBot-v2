import { BotFrameworkAdapter } from "botbuilder";
import { QnAMaker, LuisRecognizer } from "botbuilder-ai";
import { IQnAService, ILuisService, BotConfiguration } from "botframework-config";
import * as restify from "restify";
import { PokeBot } from "./bot";
import { config } from "dotenv";

config();

const botConfig = BotConfiguration.loadSync("./Rotom.bot", process.env.botFileSecret);

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`${server.name} listening on ${server.url}`);
});

const adapter = new BotFrameworkAdapter({
  appId: process.env.microsoftAppID,
  appPassword: process.env.microsoftAppPassword,
  channelService: process.env.ChannelService,
  openIdMetadata: process.env.BotOpenIdMetadata

});

const qnamaker = new QnAMaker({
  knowledgeBaseId: (<IQnAService>botConfig.findServiceByNameOrId("PokeBotQna")).kbId,
  endpointKey: (<IQnAService>botConfig.findServiceByNameOrId("PokeBotQna")).endpointKey,
  host: (<IQnAService>botConfig.findServiceByNameOrId("PokeBotQna")).hostname,
});

const luis = new LuisRecognizer({
  applicationId: (<ILuisService>botConfig.findServiceByNameOrId("pokeBot")).appId,
  endpointKey: (<ILuisService>botConfig.findServiceByNameOrId("pokeBot")).subscriptionKey,
  endpoint: (<ILuisService>botConfig.findServiceByNameOrId("pokeBot")).getEndpoint(),
})



let poke;
try {
    poke = new PokeBot(qnamaker, luis);
} catch (err) {
    console.error(`[botInitializationError]: ${ err }`);
    process.exit();
}

server.post('/api/messages', async (req, res) => {
  await adapter.processActivity(req, res, async (context) => {
    await poke.onTurn(context);
  });
});
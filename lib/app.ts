import { BotFrameworkAdapter } from "botbuilder";
import { QnAMaker, LuisRecognizer } from "botbuilder-ai";
import { IQnAService, ILuisService, BotConfiguration } from "botframework-config";
import * as restify from "restify";
import { PokeBot } from "./bot";
import { config } from "dotenv";

config();

const botConfig = BotConfiguration.loadSync("./Rotom.bot", process.env.BOT_FILE_SECRET);

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`${server.name} listening on ${server.url}`);
});

const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
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

const poke: PokeBot = new PokeBot(
          qnamaker,
          luis);

server.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await poke.onTurn(context);
  });
});
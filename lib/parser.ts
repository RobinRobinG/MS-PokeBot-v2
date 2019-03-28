import * as fs from "fs";
import { load as CheerioLoad } from "cheerio";
import { Pokemon } from "./types";

const file: string = fs.readFileSync("./data/pokemon.xml", "utf-8");
const xml: CheerioStatic = CheerioLoad(file);

export function getData(entities: any): Pokemon[] {
  if(entities != null) {
      let subject = entities["subject"];
      if(subject != null) {
        let result = getSessionBySubject((subject instanceof Array) ? subject[0] : subject);
          return result
      }
  }
  return []
}

function getSessionBySubject(subject: string): Pokemon[] {
  return writePoke(getPokeNodes("species", subject));
}

function getPokeNodes(s: string, t: string): CheerioElement[] {
  var pokemon: CheerioElement[] = [];
  xml(s).each((idx: number, elem: CheerioElement) => {
      if(xml(elem).text().toLowerCase().indexOf(t.toLowerCase()) > -1) {
          pokemon.push(elem.parent);
      }
  });
  return pokemon;
}

function writePoke(pokemon: Array<CheerioElement>): Pokemon[] {
  var results: Pokemon[] = [];
  for(let i = 0; i < pokemon.length; i++) {
      let elem = xml(pokemon[i]);
      let r: Pokemon = {
            species: elem.find("species").text(),
            dex: elem.find("dex").text(),
            types: elem.find("type").text().toLowerCase(),
            abilities: elem.find("ability").text().toLowerCase(),
            hiddenability: elem.find("dream").text(),
            HP: elem.find("HP").text(),
            attack: elem.find("ATK").text(),
            defense: elem.find("DEF").text(),
            speed: elem.find("SPD").text(),
            spattack: elem.find("SATK").text(),
            spdefense: elem.find("SDEF").text(),
            experience: elem.find("experience").text(),
            ratetype: elem.find("rateType").text().toLowerCase(),
      };
      results.push(r);
  }
  return results;
}




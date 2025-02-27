let gameSettings = {};

async function loadConfig() {
  try {
    const respone = await fetch("config.json");
    const json = await respone.json();
    gameSettings = json;
    if (respone.ok) console.log("Successfully loaded config.json");
  } catch (error) {}
}

loadConfig();

export default class Game {
  constructor() {
    this.level = 1;
    this.tileSize = gameSettings.global.tileSize;
    this.map = gameSettings.levels[this.level].map;
  }
}

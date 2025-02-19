let START_MENU = null;
let ACTION_MENU = null;
let GAMESTART_MENU = null;
let CREATECHAR_MENU = null;
let gameStarted = false;
let locales = {};

async function initializeGame() {
  await loadConfig();
  if (!gameStarted) {
    console.log("Starting game");
    StartMenu();
  }
}

async function loadConfig() {
  try {
    const response = await fetch("locales.json");
    const json = await response.json();
    locales = json;
    if (response.ok) console.log("Successfully loaded locales.json");
  } catch {
    console.error("Failed fetching locales.json");
  }
}

async function StartMenu() {
  await Transition("start");

  START_MENU.innerHTML = `
    <h1>Cybergame</h1>
    <p>${locales.de.startMessage}</p>
    `;
  window.addEventListener("keyup", handleStartGame);
}

function handleStartGame(e) {
  if (e.code === "Space") {
    window.removeEventListener("keyup", handleStartGame);
    ActionMenu();
  }
}

async function ActionMenu() {
  await Transition("start-to-action");

  ACTION_MENU.innerHTML = `
    <h1>Cybergame</h1>

    <ul>
        <li><button id="action-menu-start" type="button">Start</button></li>
        <li><button type="button">Shop</button></li>
        <li><button type="button">Settings</button></li>
        <li><button type="button">Quit</button></li>
    </ul>
  `;

  const ACTION_MENU_START = document.querySelector("#action-menu-start");
  ACTION_MENU_START.addEventListener("click", () => handleActionStart(false));
}

async function handleActionStart(action) {
  if (!action) {
    await Transition("action-to-gamestart");
  }
  localStorage.removeItem("character");
  let character = localStorage.getItem("character");
  //console.log(character);
  if (character) {
    character = JSON.parse(character);
    GAMESTART_MENU.innerHTML = `
        <div>
            <p>Name: ${character.name}</p>
            <p>Level: ${character.level}</p>
            <p>Coins: ${character.coins}</p>
            <button>Continue playing as <b>${character.name}</b></button>
        </div>
    `;
  } else {
    console.log(GAMESTART_MENU);
    GAMESTART_MENU.innerHTML = `
        <div>
            <button id="gamestart-menu-createchar" type="button">Create new character</button>
        </div>
    `;
    const GAMESTART_MENU_CREATECHAR = document.querySelector(
      "#gamestart-menu-createchar"
    );
    GAMESTART_MENU_CREATECHAR.addEventListener("click", handleCreateCharacter);
  }
  //console.log(character);
}

async function handleCreateCharacter(e) {
  console.log("ughfdudiusdhgiudgh");
  await Transition("gamestart-to-createchar");
  CREATECHAR_MENU.innerHTML = `
    <h2>Create Character:</h2>
    <form id="createchar-menu-form">
        <label for="createchar-menu-form-name">Name: </label>
        <input id="createchar-menu-form-name" type="text" placeholder="Name..." name="name" />
        <br>
        <button type="submit">Create Character</button>
    </form>
  `;
  const CREATECHAR_MENU_FORM = document.querySelector("#createchar-menu-form");
  CREATECHAR_MENU_FORM.addEventListener("submit", handleCreateCharacterSubmit);
}

function handleCreateCharacterSubmit(e) {
  e.preventDefault();
  const charName = document.querySelector("#createchar-menu-form-name").value;
  const newCharacter = {
    name: charName,
    level: 1,
    coins: 0,
    items: {},
    perks: [],
  };
  localStorage.setItem("character", JSON.stringify(newCharacter));
  Transition("createchar-to-gamestart");
}

function Transition(type) {
  return new Promise((resolve) => {
    document.body.style.backgroundColor = "black";
    setTimeout(() => {
      document.body.style.backgroundColor = "white";
      switch (type) {
        case "start":
          if (!START_MENU) {
            START_MENU = document.createElement("div");
            START_MENU.setAttribute("id", "start-menu");
            document.body.appendChild(START_MENU);
          }
          break;
        case "start-to-action":
          START_MENU.remove();
          if (!ACTION_MENU) {
            ACTION_MENU = document.createElement("div");
            ACTION_MENU.setAttribute("id", "action-menu");
            document.body.appendChild(ACTION_MENU);
          }
          break;
        case "action-to-gamestart":
          ACTION_MENU.remove();
          console.log(GAMESTART_MENU);
          if (!GAMESTART_MENU) {
            GAMESTART_MENU = document.createElement("div");
            GAMESTART_MENU.setAttribute("id", "gamestart-menu");
            document.body.appendChild(GAMESTART_MENU);
          }
          break;
        case "gamestart-to-createchar":
          GAMESTART_MENU.remove();
          if (!CREATECHAR_MENU) {
            CREATECHAR_MENU = document.createElement("div");
            CREATECHAR_MENU.setAttribute("id", "createchar-menu");
            document.body.appendChild(CREATECHAR_MENU);
          }
          break;
        case "createchar-to-gamestart":
          CREATECHAR_MENU.remove();
          console.log(GAMESTART_MENU);
          if (!GAMESTART_MENU) {
            GAMESTART_MENU = document.createElement("div");
            GAMESTART_MENU.setAttribute("id", "createchar-menu");
            document.body.appendChild(GAMESTART_MENU);
          }
          handleActionStart(false);
          break;
      }
      resolve();
    }, 1000);
  });
}

document.addEventListener("DOMContentLoaded", initializeGame);

function resetStorage() {
  localStorage.removeItem("character");
}

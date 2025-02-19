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
  await ChangeTab("start");

  START_MENU.innerHTML = `
    <h1>Cybergame</h1>
    <p>${locales.de.startStartMessage}</p>
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
  await ChangeTab("action");

  ACTION_MENU.innerHTML = `
    <h1>Cybergame</h1>

    <ul>
        <li><button id="action-menu-start" type="button">${locales.de.actionStartButton}</button></li>
        <li><button type="button">${locales.de.actionSettingsButton}</button></li>
        <li><button id="action-menu-quit" type="button">${locales.de.actionQuitButton}</button></li>
    </ul>
  `;
  const ACTION_MENU_QUIT = document.querySelector("#action-menu-quit");
  ACTION_MENU_QUIT.addEventListener("click", () => {
    window.location.href = "/myapache/cybergame";
  });
  const ACTION_MENU_START = document.querySelector("#action-menu-start");
  ACTION_MENU_START.addEventListener("click", async function () {
    await ChangeTab("gamestart");
    handleActionStart(true);
  });
}

async function handleActionStart(reset) {
  //if (reset) localStorage.removeItem("characters");

  let characters = localStorage.getItem("characters");
  if (characters) {
    characters = JSON.parse(characters);
    for (let character of characters) {
      GAMESTART_MENU.innerHTML += `
        <div>
            <p>${locales.de.gameStartName}: ${character.name}</p>
            <p>${locales.de.gameStartLevel}: ${character.level}</p>
            <p>${locales.de.gameStartCoins}: ${character.coins}</p>
            <button>${locales.de.gameStartPlayButton} <b>${character.name}</b></button>
            <button class="gamestart-menu-delete" data-id="${character.id}">${locales.de.gameStartDeleteButton}</button>
        </div>
    `;
      const GAMESTART_MENU_DELETE = document.querySelectorAll(
        ".gamestart-menu-delete"
      );
      for (let button of GAMESTART_MENU_DELETE) {
        button.addEventListener("click", handleDeleteCharacter);
      }
    }
  } else {
    GAMESTART_MENU.innerHTML = `
        <div>
            <button id="gamestart-menu-createchar" type="button">${locales.de.gameStartCreateCharButton}</button>
            <button id="gamestart-menu-back" type="button">${locales.de.gameStartBackButton}</button>
        </div>
    `;
  }
  const GAMESTART_MENU_BACK = document.querySelector("#gamestart-menu-back");
  GAMESTART_MENU_BACK.addEventListener("click", ActionMenu);
  const GAMESTART_MENU_CREATECHAR = document.querySelector(
    "#gamestart-menu-createchar"
  );
  GAMESTART_MENU_CREATECHAR.addEventListener("click", handleCreateCharacter);
}

function handleDeleteCharacter(e) {
  const oldCharacters = JSON.parse(localStorage.getItem("characters"));
  const newCharacters = oldCharacters.filter(
    (character) => Number(character.id) !== Number(e.target.dataset.id)
  );

  localStorage.setItem("characters", JSON.stringify(newCharacters));
  e.target.parentElement.remove();
}

async function handleCreateCharacter(e) {
  const characters = JSON.parse(localStorage.getItem("characters"));
  if (characters && characters.length >= 3) {
    alert("Du hast das Maximum an Charaktären erreicht");
    return;
  }
  await ChangeTab("createchar");
  CREATECHAR_MENU.innerHTML = `
    <h2>${locales.de.createCharTitle}</h2>
    <form id="createchar-menu-form">
        <label for="createchar-menu-form-name">${locales.de.createCharName}: </label>
        <input id="createchar-menu-form-name" type="text" placeholder="${locales.de.createCharName}..." name="name" required />
        <br>
        <button type="submit">${locales.de.createCharSubmitButton}</button>
        <button id="createchar-menu-form-back" type="button">${locales.de.createCharBackButton}</button>
    </form>
  `;
  const CREATECHAR_MENU_FORM_BACK = document.querySelector(
    "#createchar-menu-form-back"
  );
  CREATECHAR_MENU_FORM_BACK.addEventListener("click", async () => {
    await ChangeTab("gamestart");
    handleActionStart(false);
  });
  const CREATECHAR_MENU_FORM = document.querySelector("#createchar-menu-form");
  CREATECHAR_MENU_FORM.addEventListener("submit", handleCreateCharacterSubmit);
}

async function handleCreateCharacterSubmit(e) {
  e.preventDefault();
  const charName = document.querySelector("#createchar-menu-form-name").value;
  const characters = JSON.parse(localStorage.getItem("characters"));
  let newCharacters = null;

  if (characters) {
    newCharacters = characters;
    newCharacters.push({
      id: Date.now(),
      name: charName,
      level: 1,
      coins: 0,
      items: {},
      perks: [],
    });
  } else {
    newCharacters = [
      {
        id: Date.now(),
        name: charName,
        level: 1,
        coins: 0,
        items: {},
        perks: [],
      },
    ];
  }

  localStorage.setItem("characters", JSON.stringify(newCharacters));
  await ChangeTab("gamestart");
  handleActionStart(false);
}

function ChangeTab(menu) {
  const box = document.querySelector("#box");
  const content = document.querySelector("#content");
  return new Promise((resolve) => {
    box.style.opacity = "1";
    box.style.zIndex = "2";
    setTimeout(() => {
      box.style.zIndex = "-1";
      box.style.opacity = "0";
      switch (menu) {
        case "start":
          content.innerHTML = "";
          START_MENU = document.createElement("div");
          START_MENU.setAttribute("id", "start-menu");
          content.appendChild(START_MENU);
          break;
        case "action":
          content.innerHTML = "";
          ACTION_MENU = document.createElement("div");
          ACTION_MENU.setAttribute("id", "action-menu");
          content.appendChild(ACTION_MENU);
          break;
        case "gamestart":
          content.innerHTML = "";
          GAMESTART_MENU = document.createElement("div");
          GAMESTART_MENU.setAttribute("id", "gamestart-menu");
          GAMESTART_MENU.innerHTML = `
            <button id="gamestart-menu-back">${locales.de.gameStartBackButton}</button>
            <button id="gamestart-menu-createchar" type="button">${locales.de.gameStartCreateCharButton}</button>
          `;
          content.appendChild(GAMESTART_MENU);
          const GAMESTART_MENU_CREATECHAR = document.querySelector(
            "#gamestart-menu-createchar"
          );
          const GAMESTART_MENU_BACK = document.querySelector(
            "#gamestart-menu-back"
          );
          GAMESTART_MENU_BACK.addEventListener("click", ActionMenu);
          GAMESTART_MENU_CREATECHAR.addEventListener(
            "click",
            handleCreateCharacter
          );
          break;
        case "createchar":
          content.innerHTML = "";
          CREATECHAR_MENU = document.createElement("div");
          CREATECHAR_MENU.setAttribute("id", "createchar-menu");
          content.appendChild(CREATECHAR_MENU);
          break;
      }
      resolve();
    }, 1000);
  });
}

document.addEventListener("DOMContentLoaded", initializeGame);

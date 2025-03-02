`use strict`;

// INIT.
const INIT_FOLDER = "init";
const P_BOOTLOADER = `${INIT_FOLDER}/bootloader.txt`;
const P_LOGIN = `${INIT_FOLDER}/login.txt`;
const P_SYSTEMD = `${INIT_FOLDER}/systemd.txt`;

// DATA.
const DATA_FOLDER = "data";
const P_ABOUT_ME = `${DATA_FOLDER}/aboutME.txt`;
const P_CONTACT = `${DATA_FOLDER}/contact.txt`;
const P_SKILLS = `${DATA_FOLDER}/skills.txt`;

// DOM.

const tty = document.getElementById("tty");
const ttyPrompt = document.getElementById("tty-prompt");

const screenDOM = document.getElementById("screen");

const terminalDOM1 = document.getElementById("terminal1");
const terminalPrompt1 = document.getElementById("terminal1-prompt");

const terminalDOM2 = document.getElementById("terminal2");
const terminalPrompt2 = document.getElementById("terminal2-prompt");

const terminalDOM3 = document.getElementById("terminal3");
const terminalPrompt3 = document.getElementById("terminal3-prompt");

// OTHER.

const commandText = "startx /usr/bin/bspwm";
const commandTerminal1 = "man 9 ManuelEscalante";
const commandTerminal2 = "cat /var/mail/contact.dat";
const commandTerminal3 = "ls -1 /dev/skills/ | xargs cat";
const PS1 =
  'guest@<span class="terminal__hostname">Skala</span> ~ # <span class="terminal__animated prompt-animated"></span>';
const bgDesktop = "img/background.webp";
const bgMobile = "img/background.webp";
const mediaMaxWidth = "1000px";

// AUX.

const readFile = async (fileName) => fetch(fileName).then((res) => res.text());
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const clearTty = () => (ttyPrompt.innerHTML = "");
const clearTerminal1 = () => (terminalPrompt1.innerHTML = "");
const clearTerminal2 = () => (terminalPrompt2.innerHTML = "");
const clearTerminal3 = () => (terminalPrompt3.innerHTML = "");
const scrollDown = (container) => window.scrollTo(0, container.scrollHeight);
const alternateTty = () => (tty.hidden = tty.hidden ? false : true);
const disableTty = () => (tty.hidden = true);
const enableTty = () => (tty.hidden = false);
const disableScreen = () => (screenDOM.hidden = true);
const enableScreen = () => (screenDOM.hidden = false);
const disableTerminal1 = () => (terminalDOM1.hidden = true);
const disableTerminal2 = () => (terminalDOM2.hidden = true);
const disableTerminal3 = () => (terminalDOM3.hidden = true);
const enableTerminal1 = () => (terminalDOM1.hidden = false);
const enableTerminal2 = () => (terminalDOM2.hidden = false);
const enableTerminal3 = () => (terminalDOM3.hidden = false);
const isDesktop = () => window.matchMedia("(min-width: 500px)").matches;
const changeBodyBackground = (backgroundFile) =>
  (document.body.style.background = `url(${backgroundFile}) repeat center`);
const changeScreenBackground = (backgroundFile) =>
  (document.getElementById(
    "screen"
  ).style.background = `url(${backgroundFile}) center cover`);
const backgroundHandler = (event, bgCallback) =>
  event?.matches ? bgCallback(bgMobile) : bgCallback(bgDesktop);
const backgroundAddEventListener = (media) =>
  media?.addEventListener("change", (event) =>
    backgroundHandler(event, changeScreenBackground)
  );

// FUN.

const setBackground = () => {
  const maxWidth = window.matchMedia(`(max-width: ${mediaMaxWidth})`);
  backgroundHandler(maxWidth, changeBodyBackground);
  backgroundAddEventListener(maxWidth);
  document.body.style.backgroundSize = "cover";
};

const resetBackground = () => {
  const maxWidth = window.matchMedia(`(max-width: ${mediaMaxWidth})`);
  backgroundHandler(maxWidth, changeScreenBackground);
};

const loadImages = () => {
  fetch(bgDesktop);
  fetch(bgMobile);
};

const matchWithTitleTty = async (text) =>
  text.match(/osname/i) ? await sleep(1500) : null;

const matchTheLineNumber = (iterator, line) => iterator === line;

const optionsIsActivated = (activated, iterator, line) =>
  activated && matchTheLineNumber(iterator, line);

const sleepWithOption = async (timeToSleep, sleepEveryLines, auxSleep) => {
  await sleep(timeToSleep);
  return sleepEveryLines + auxSleep;
};

const readFileLineByLine = async (
  fileName,
  speed = 100,
  { activated = false, sleepEveryLines = 20, timeToSleep = 2000 } = {}
) => {
  const auxSleep = sleepEveryLines;
  const text = await readFile(fileName);
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    ttyPrompt.innerHTML += lines[i];
    await matchWithTitleTty(lines[i]);
    optionsIsActivated(activated, i, sleepEveryLines)
      ? (sleepEveryLines = await sleepWithOption(
          timeToSleep,
          sleepEveryLines,
          auxSleep
        ))
      : await sleep(speed);
    scrollDown(tty);
  }
};

const readAboutData = async () => {
  terminalPrompt1.innerHTML = PS1;
  await executeCommandAnimation(commandTerminal1, 100);
  const text = await readFile(P_ABOUT_ME);
  const lines = text.split("\n");
  await sleep(1500);
  clearTerminal1();
  for (let i = 0; i < lines.length; i++) {
    if (i === parseInt(lines.length / 1.5) && !isDesktop()) resetBackground();
    terminalPrompt1.innerHTML += lines[i];
    await sleep(500);
    scrollDown(terminalDOM1);
    scrollDown(screenDOM);
  }
};

const readContactData = async () => {
  terminalPrompt2.innerHTML = PS1;
  await executeCommandAnimation(commandTerminal2, 100);
  const text = await readFile(P_CONTACT);
  const lines = text.split("\n");
  await sleep(1500);
  clearTerminal2();
  for (let i = 0; i < lines.length; i++) {
    terminalPrompt2.innerHTML += lines[i];
    await sleep(500);
    scrollDown(terminalDOM2);
    scrollDown(screenDOM);
  }
};

const readSkillsData = async () => {
  terminalPrompt3.innerHTML = PS1;
  await executeCommandAnimation(commandTerminal3, 100);
  const text = await readFile(P_SKILLS);
  const lines = text.split("\n");
  await sleep(1500);
  clearTerminal3();
  for (let i = 0; i < lines.length; i++) {
    terminalPrompt3.innerHTML += lines[i];
    await sleep(200);
    scrollDown(terminalDOM3);
    scrollDown(screenDOM);
  }
};

const executeCommandAnimation = async (text, speed = 100) => {
  if (!isDesktop()) scrollDown(screenDOM);
  const commandDOM = document.getElementsByClassName("prompt-animated");
  for (let i = 0; i < text.length; i++) {
    commandDOM[0].textContent += text[i];
    await sleep(speed);
  }
};

const openTerminalsDesktop = async () => {
  await sleep(200);
  enableTerminal1();
  await sleep(200);
  enableTerminal2();
  await sleep(200);
  enableTerminal3();
  await sleep(200);
  readAboutData();
  await sleep(4000);
  readContactData();
  await sleep(4500);
  readSkillsData();
  resetBackground();
};

const openTerminalsMobile = async () => {
  await sleep(500);
  enableTerminal1();
  await sleep(200);
  enableTerminal2();
  await sleep(200);
  enableTerminal3();
  await sleep(200);
  await readAboutData();
  await sleep(200);
  await readContactData();
  await sleep(200);
  await readSkillsData();
};

const transitionTtyToScreen = () => {
  clearTty();
  disableTty();
  enableScreen();
  setBackground();
};

const initDOM = () => {
  disableScreen();
  enableTty();
  disableTerminal1();
  disableTerminal2();
  disableTerminal3();
  loadImages();
};

// MAIN.

const main = async () => {
  initDOM();
  if (isDesktop()) {
    await readFileLineByLine(P_BOOTLOADER, 30);
    await sleep(300);
    clearTty();
    await readFileLineByLine(P_SYSTEMD, 10, {
      activated: true,
      timeToSleep: 100,
    });
    await sleep(300);
    clearTty();
  }
  await readFileLineByLine(P_LOGIN, 50);
  await sleep(300);
  await executeCommandAnimation(commandText, 50);
  await sleep(500);
  transitionTtyToScreen();
  await sleep(300);
  isDesktop() ? await openTerminalsDesktop() : await openTerminalsMobile();
};

main();

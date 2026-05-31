const BOOT_MESSAGES = [
  "Initializing Scheduler Engine...",
  "Loading FCFS Module...",
  "Loading SJF Module...",
  "Loading SRTF Module...",
  "Loading Priority Module...",
  "Loading Round Robin Module...",
  "Preparing Visualization Engine...",
];

const CPU_STAGES = [
  {
    label: "PACKAGE_OUTLINE",
    art: String.raw`


                    .--------------------------------------------.
                   /                                              \
                  /                                                \
                 |                                                  |
                 |                                                  |
                 |                                                  |
                 |                                                  |
                 |                                                  |
                  \                                                /
                   \______________________________________________/


`,
  },
  {
    label: "PIN_ARRAY_ONLINE",
    art: String.raw`
          . . . . . . . . . . . . . . . . . . . . . . . . .
        .                                                       .
      .   .--------------------------------------------.          .
    .    /                                              \           .
  .     /                                                \            .
 .  || |                                                  | ||         .
 .  || |                                                  | ||         .
 .  || |                                                  | ||         .
 .  || |                                                  | ||         .
  .     \                                                /            .
    .    \______________________________________________/           .
      .                                                       .
        . . . . . . . . . . . . . . . . . . . . . . . . .
`,
  },
  {
    label: "DIE_TRACE_SYNC",
    art: String.raw`
          . . . . . . . . . . . . . . . . . . . . . . . . .
        .                                                       .
      .   .--------------------------------------------.          .
    .    /   o   o   o   o   o   o   o   o   o   o    \           .
  .     /                                                \            .
 .  || |      +----------------------------------+        | ||         .
 .  || |      |                                  |        | ||         .
 .  || |      |          CPU SCHEDULER           |        | ||         .
 .  || |      |                                  |        | ||         .
  .    \      +----------------------------------+       /            .
    .   \______________________________________________/           .
      .                                                       .
        . . . . . . . . . . . . . . . . . . . . . . . . .
`,
  },
  {
    label: "CORE_READY",
    art: String.raw`
          . . . . . . . . . . . . . . . . . . . . . . . . .
        .                                                       .
      .   .--------------------------------------------.          .
    .    /   o   o   o   o   o   o   o   o   o   o    \           .
  .     /  .----------------------------------------.    \           .
 .  || |   |  AMD RYZEN / INTEL CLASS PACKAGE      |    | ||        .
 .  || |   |  +---------+  +---------+  +--------+  |    | ||        .
 .  || |   |  |  FCFS   |  |  SJF    |  |  SRTF  |  |    | ||        .
 .  || |   |  +---------+  +---------+  +--------+  |    | ||        .
 .  || |   |  +-------------+  +----------------+   |    | ||        .
 .  || |   |  |  PRIORITY   |  |  ROUND ROBIN   |   |    | ||        .
 .  || |   |  +-------------+  +----------------+   |    | ||        .
 .  || |   |  CACHE BUS :: READY QUEUE :: TIMER     |    | ||        .
  .    \  '----------------------------------------'   /            .
    .   \______________________________________________/           .
      .                                                       .
        . . . . . . . . . . . . . . . . . . . . . . . . .
`,
  },
];

const bootScreen = document.querySelector("#bootScreen");
const siteShell = document.querySelector("#siteShell");
const asciiCpu = document.querySelector("#asciiCpu");
const bootLog = document.querySelector("#bootLog");
const bootAccess = document.querySelector("#bootAccess");
const bootStage = document.querySelector("#bootStage");

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function renderCpuStage(stage, isFirstStage = false) {
  bootStage.textContent = stage.label;
  asciiCpu.classList.add("is-refreshing");

  if (!isFirstStage) {
    await wait(110);
  }

  asciiCpu.textContent = stage.art.trim();
  asciiCpu.classList.add("is-visible");
  asciiCpu.classList.remove("is-refreshing");
}

async function typeLine(message) {
  const line = document.createElement("div");
  line.className = "boot-line boot-cursor";
  bootLog.append(line);

  for (const character of message) {
    line.textContent += character;
    await wait(5 + Math.random() * 4);
  }

  line.classList.remove("boot-cursor");
}

async function runBootSequence() {
  await wait(320);

  await renderCpuStage(CPU_STAGES[0], true);
  await wait(760);

  await renderCpuStage(CPU_STAGES[1]);
  await wait(760);

  await renderCpuStage(CPU_STAGES[2]);
  await wait(760);

  await renderCpuStage(CPU_STAGES[3]);
  await wait(500);

  bootStage.textContent = "BOOT_SEQUENCE";

  for (const message of BOOT_MESSAGES) {
    await typeLine(message);
    await wait(48);
  }

  await wait(180);
  bootStage.textContent = "ACCESS_GRANTED";
  bootAccess.classList.add("is-visible");
  bootAccess.setAttribute("aria-hidden", "false");

  await wait(720);
  document.body.classList.remove("booting");

  if (siteShell) {
    siteShell.classList.add("is-visible");
    siteShell.setAttribute("aria-hidden", "false");
  }

  bootScreen.classList.add("is-complete");
}

runBootSequence();

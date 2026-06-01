import { processStore } from "../process/process-store.js";
import { runFcfs } from "./algorithms/fcfs.js";
import { renderScheduleResult, renderSimulationSnapshot } from "./rendering/scheduling-renderer.js";
import { scheduleStore } from "./schedule-store.js";
import { createSimulationEngine } from "./simulation/simulation-engine.js";

const startButton = document.querySelector(".hero__actions .button--primary");
const statusLines = document.querySelectorAll(".hero__status div");
const workspaceBoxes = document.querySelectorAll(".placeholder-box");

const elements = {
  status: statusLines[0],
  algorithm: statusLines[2],
  clock: statusLines[3],
  readyQueue: workspaceBoxes[0],
  gantt: workspaceBoxes[1],
  metrics: workspaceBoxes[2],
  results: workspaceBoxes[3],
};

const simulationEngine = createSimulationEngine();
let processStateSignature = JSON.stringify(processStore.getState().processes);

function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

function runFcfsSchedule() {
  const processes = processStore.getSchedulingInput();

  if (processes.length === 0) {
    setText(elements.gantt, "No process data available");
    return;
  }

  const result = runFcfs(processes);
  scheduleStore.setResult(result);
  simulationEngine.reset(result.timeline);
  simulationEngine.play();
}

if (startButton) {
  startButton.addEventListener("click", runFcfsSchedule);
}

scheduleStore.subscribe((state) =>
  renderScheduleResult(state.result, elements, simulationEngine.getSnapshot(), simulationEngine),
);
simulationEngine.subscribe((snapshot) =>
  renderSimulationSnapshot(snapshot, elements, scheduleStore.getState().result, simulationEngine),
);
processStore.subscribe((state) => {
  const nextSignature = JSON.stringify(state.processes);

  if (nextSignature === processStateSignature) {
    return;
  }

  processStateSignature = nextSignature;
  scheduleStore.reset();
  simulationEngine.reset([]);
});

window.schedulerScheduleStore = scheduleStore;
window.schedulerSimulationEngine = simulationEngine;

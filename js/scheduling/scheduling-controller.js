import { processStore } from "../process/process-store.js";
import { createSchedulerController } from "./controller/scheduler-controller.js";
import { renderScheduleResult, renderSimulationSnapshot } from "./rendering/scheduling-renderer.js";
import { renderComparison } from "./rendering/comparison-renderer.js";
import { renderSchedulingControlPanel } from "./rendering/control-panel-renderer.js";
import { schedulerStateStore } from "./state/scheduler-state-store.js";
import { createSimulationController } from "./simulation/simulation-controller.js";
import { createSimulationEngine } from "./simulation/simulation-engine.js";

const startButton = document.querySelector(".hero__actions .button--primary");
const controlCenter = document.querySelector("#schedulerControlCenter");
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
  comparison: workspaceBoxes[4],
};

const simulationEngine = createSimulationEngine();
const simulationController = createSimulationController(simulationEngine, schedulerStateStore);
const schedulerController = createSchedulerController({
  processStore,
  schedulerStateStore,
  simulationController,
});

function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

function runSimulation() {
  if (processStore.getState().processes.length === 0) {
    setText(elements.gantt, "No process data available");
    schedulerStateStore.setMessage("Process data is required before running a simulation.");
    return;
  }

  schedulerController.runSelectedAlgorithm();
}

if (startButton) {
  startButton.addEventListener("click", runSimulation);
}

processStore.subscribe(() => schedulerController.synchronizeProcessData());

schedulerStateStore.subscribe((state) => {
  if (controlCenter) {
    renderSchedulingControlPanel(controlCenter, state, {
      selectAlgorithm: schedulerStateStore.selectAlgorithm,
      updateSetting: schedulerStateStore.updateAlgorithmSetting,
      runSimulation,
      pauseSimulation: schedulerController.pauseSimulation,
      resumeSimulation: schedulerController.resumeSimulation,
      resetSimulation: schedulerController.resetSimulation,
      setSpeed: schedulerController.setSimulationSpeed,
      compareAllAlgorithms: schedulerController.compareAllAlgorithms,
    });
  }

  renderScheduleResult(
    state.schedulingResult,
    elements,
    state.simulation.snapshot ?? simulationEngine.getSnapshot(),
    simulationEngine,
  );
  renderComparison(elements.comparison, state.comparisonResult);
});

simulationEngine.subscribe((snapshot) =>
  renderSimulationSnapshot(
    snapshot,
    elements,
    schedulerStateStore.getState().schedulingResult,
    simulationEngine,
  ),
);

window.schedulerStateStore = schedulerStateStore;
window.schedulerController = schedulerController;
window.schedulerSimulationEngine = simulationEngine;

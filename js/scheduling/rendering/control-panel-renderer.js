import { getAlgorithms } from "../registry/algorithm-registry.js";
import { SCHEDULING_STATUSES, SIMULATION_SPEEDS } from "../contracts/scheduling-contracts.js";
import { clearElement, createElement } from "./dom-utils.js";

function createButton(label, className = "button button--secondary") {
  const button = createElement("button", className, label);
  button.type = "button";
  return button;
}

function canRun(status) {
  return (
    status === SCHEDULING_STATUSES.IDLE ||
    status === SCHEDULING_STATUSES.READY ||
    status === SCHEDULING_STATUSES.COMPLETE ||
    status === SCHEDULING_STATUSES.ERROR
  );
}

function canPause(status) {
  return status === SCHEDULING_STATUSES.RUNNING;
}

function canResume(status) {
  return status === SCHEDULING_STATUSES.PAUSED;
}

function canReset(status) {
  return status !== SCHEDULING_STATUSES.IDLE;
}

export function renderSchedulingControlPanel(container, state, handlers) {
  clearElement(container);

  const algorithmPanel = createElement("section", "panel scheduler-control-panel");
  const algorithmHeader = createElement("header", "panel__header", "[ALGORITHM SELECTION]");
  const algorithmBody = createElement("div", "panel__body");
  const algorithmGrid = createElement("div", "scheduler-algorithm-grid");

  getAlgorithms().forEach((algorithm) => {
    const button = createButton(algorithm.label, "button button--secondary scheduler-algorithm-button");
    button.dataset.algorithmId = algorithm.id;
    button.dataset.selected = String(algorithm.id === state.selectedAlgorithm);
    button.addEventListener("click", () => handlers.selectAlgorithm(algorithm.id));
    algorithmGrid.append(button);
  });

  algorithmBody.append(algorithmGrid);
  algorithmPanel.append(algorithmHeader, algorithmBody);

  const configPanel = createElement("section", "panel scheduler-control-panel");
  const configHeader = createElement("header", "panel__header", "[ALGORITHM CONFIGURATION]");
  const configBody = createElement("div", "panel__body scheduler-config-panel");
  const selectedAlgorithm = getAlgorithms().find((algorithm) => algorithm.id === state.selectedAlgorithm);

  if (selectedAlgorithm?.settings.length) {
    selectedAlgorithm.settings.forEach((setting) => {
      const label = document.createElement("label");
      const labelText = createElement("span", "", setting.label);
      label.append(labelText);

      if (setting.type === "number") {
        const input = document.createElement("input");
        input.type = "number";
        input.min = String(setting.min ?? 0);
        input.value = state.algorithmSettings[selectedAlgorithm.id]?.[setting.id] ?? setting.defaultValue ?? "";
        input.addEventListener("input", () =>
          handlers.updateSetting(selectedAlgorithm.id, setting.id, Number(input.value)),
        );
        label.append(input);
      } else {
        label.append(createElement("div", "scheduler-config-placeholder", "Configuration hook prepared"));
      }

      configBody.append(label);
    });
  } else {
    configBody.append(createElement("div", "scheduler-config-placeholder", "No extra settings required"));
  }

  configPanel.append(configHeader, configBody);

  const simulationPanel = createElement("section", "panel scheduler-control-panel scheduler-control-panel--wide");
  const simulationHeader = createElement("header", "panel__header", "[SIMULATION CONTROL]");
  const simulationBody = createElement("div", "panel__body");
  const controlRow = createElement("div", "scheduler-control-row");
  const runButton = createButton("Run Simulation", "button button--primary");
  const pauseButton = createButton("Pause Simulation");
  const resumeButton = createButton("Resume Simulation");
  const resetButton = createButton("Reset Simulation", "button button--ghost");
  const compareButton = createButton("Compare All Algorithms");

  runButton.disabled = !canRun(state.simulation.status);
  pauseButton.disabled = !canPause(state.simulation.status);
  resumeButton.disabled = !canResume(state.simulation.status);
  resetButton.disabled = !canReset(state.simulation.status);

  runButton.addEventListener("click", handlers.runSimulation);
  pauseButton.addEventListener("click", handlers.pauseSimulation);
  resumeButton.addEventListener("click", handlers.resumeSimulation);
  resetButton.addEventListener("click", handlers.resetSimulation);
  compareButton.addEventListener("click", handlers.compareAllAlgorithms);

  controlRow.append(runButton, pauseButton, resumeButton, resetButton, compareButton);

  const speedRow = createElement("div", "scheduler-speed-row");
  SIMULATION_SPEEDS.forEach((speed) => {
    const button = createButton(`${speed}x`, "button button--ghost speed-control");
    button.dataset.active = String(state.simulation.speed === speed);
    button.addEventListener("click", () => handlers.setSpeed(speed));
    speedRow.append(button);
  });

  const message = createElement("div", "scheduler-control-message", `[${state.simulation.status.toUpperCase()}] ${state.message}`);

  simulationBody.append(controlRow, speedRow, message);
  simulationPanel.append(simulationHeader, simulationBody);

  container.append(algorithmPanel, configPanel, simulationPanel);
}

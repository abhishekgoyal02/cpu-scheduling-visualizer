import { renderGanttChart } from "./gantt-renderer.js";
import { renderMetricsDashboard } from "./metrics-renderer.js";
import { renderReadyQueue } from "./ready-queue-renderer.js";
import { renderResultsTable } from "./results-table-renderer.js";
import { setText } from "./dom-utils.js";

function formatClock(event) {
  if (!event) {
    return "00:00";
  }

  return String(event.end).padStart(2, "0");
}

export function renderScheduleResult(result, elements, snapshot, simulationEngine) {
  renderReadyQueue(elements.readyQueue, result, snapshot);
  renderGanttChart(elements.gantt, result, snapshot, simulationEngine);
  renderMetricsDashboard(elements.metrics, result?.metrics ?? null);
  renderResultsTable(elements.results, result?.processes ?? []);
}

export function renderSimulationSnapshot(snapshot, elements, result, simulationEngine) {
  if (snapshot.state === "idle") {
    setText(elements.status, "STATUS: IDLE");
    setText(elements.algorithm, "ALGORITHM: NOT_SELECTED");
    setText(elements.clock, "CLOCK: 00:00");
    renderScheduleResult(null, elements, snapshot, simulationEngine);
    return;
  }

  setText(elements.status, `STATUS: ${snapshot.state.toUpperCase()}`);
  setText(elements.algorithm, "ALGORITHM: FCFS");
  setText(elements.clock, `CLOCK: ${formatClock(snapshot.revealedEvents.at(-1))}`);
  renderReadyQueue(elements.readyQueue, result, snapshot);
  renderGanttChart(elements.gantt, result, snapshot, simulationEngine);
}

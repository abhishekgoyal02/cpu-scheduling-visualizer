import { generateRandomProcesses } from "./random-process-generator.js";
import { processStore } from "./process-store.js";
import { renderProcessTable, showProcessMessage } from "./process-table-view.js";
import { validateProcessInput } from "./process-validator.js";

const form = document.querySelector("#processForm");
const tableBody = document.querySelector("#processTableBody");
const messageElement = document.querySelector("#processMessage");
const deleteSelectedButton = document.querySelector("#deleteSelectedProcessButton");
const clearButton = document.querySelector("#clearProcessesButton");
const generateButton = document.querySelector("#generateRandomProcessesButton");
const heroGenerateButton = document.querySelector(".hero__actions .button--secondary");

function getFormInput() {
  const formData = new FormData(form);

  return {
    processId: formData.get("process-id"),
    arrivalTime: formData.get("arrival-time"),
    burstTime: formData.get("burst-time"),
    priority: formData.get("priority"),
  };
}

function addManualProcess(event) {
  event.preventDefault();

  const validation = validateProcessInput(getFormInput(), processStore.getState().processes);

  if (!validation.isValid) {
    showProcessMessage(messageElement, `[VALIDATION_ERROR] ${validation.errors.join(" ")}`, "error");
    return;
  }

  processStore.addProcess(validation.value);
  form.reset();
  showProcessMessage(messageElement, `[PROCESS_ADDED] ${validation.value.processId}`, "success");
}

function deleteSelectedProcess() {
  const deleted = processStore.deleteSelectedProcess();

  showProcessMessage(
    messageElement,
    deleted ? "[PROCESS_DELETED] Selected process removed." : "[NO_SELECTION] Select a process row first.",
    deleted ? "success" : "error",
  );
}

function clearProcesses() {
  processStore.clearProcesses();
  showProcessMessage(messageElement, "[PROCESS_TABLE_CLEARED] Source state reset.", "neutral");
}

function loadRandomProcesses() {
  const generatedProcesses = generateRandomProcesses();
  processStore.replaceProcesses(generatedProcesses);
  showProcessMessage(
    messageElement,
    `[RANDOM_GENERATED] ${generatedProcesses.length} processes loaded into source state.`,
    "success",
  );
}

function selectProcessFromEvent(event) {
  const row = event.target.closest("tr[data-process-id]");

  if (!row) {
    return;
  }

  processStore.selectProcess(row.dataset.processId);
  showProcessMessage(messageElement, `[PROCESS_SELECTED] ${row.dataset.processId}`, "neutral");
}

function selectProcessFromKeyboard(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  selectProcessFromEvent(event);
}

if (form && tableBody && messageElement) {
  processStore.subscribe((state) => renderProcessTable(tableBody, state));

  form.addEventListener("submit", addManualProcess);
  tableBody.addEventListener("click", selectProcessFromEvent);
  tableBody.addEventListener("keydown", selectProcessFromKeyboard);
  deleteSelectedButton.addEventListener("click", deleteSelectedProcess);
  clearButton.addEventListener("click", clearProcesses);
  generateButton.addEventListener("click", loadRandomProcesses);
  heroGenerateButton.addEventListener("click", loadRandomProcesses);

  window.schedulerProcessStore = processStore;
}

import { cloneProcessForScheduling, createProcess } from "./process-model.js";

const initialState = Object.freeze({
  processes: Object.freeze([]),
  selectedProcessId: null,
});

function createProcessStore() {
  let state = initialState;
  const listeners = new Set();

  function notify() {
    const snapshot = getState();
    listeners.forEach((listener) => listener(snapshot));
  }

  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(getState());

    return () => listeners.delete(listener);
  }

  function setProcesses(processes) {
    const selectedProcessStillExists = processes.some(
      (process) => process.id === state.selectedProcessId,
    );

    state = Object.freeze({
      ...state,
      processes: Object.freeze([...processes]),
      selectedProcessId: selectedProcessStillExists ? state.selectedProcessId : null,
    });
    notify();
  }

  function addProcess(input) {
    setProcesses([...state.processes, createProcess(input)]);
  }

  function replaceProcesses(inputs) {
    setProcesses(inputs.map((input) => createProcess(input)));
  }

  function deleteSelectedProcess() {
    if (!state.selectedProcessId) {
      return false;
    }

    setProcesses(state.processes.filter((process) => process.id !== state.selectedProcessId));
    return true;
  }

  function clearProcesses() {
    setProcesses([]);
  }

  function selectProcess(processId) {
    const nextSelection = state.processes.some((process) => process.id === processId)
      ? processId
      : null;

    state = Object.freeze({
      ...state,
      selectedProcessId: nextSelection,
    });
    notify();
  }

  function getSchedulingInput() {
    return state.processes.map((process) => cloneProcessForScheduling(process));
  }

  return {
    getState,
    subscribe,
    addProcess,
    replaceProcesses,
    deleteSelectedProcess,
    clearProcesses,
    selectProcess,
    getSchedulingInput,
  };
}

export const processStore = createProcessStore();

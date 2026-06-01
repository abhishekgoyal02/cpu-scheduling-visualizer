import {
  SCHEDULING_STATUSES,
  SIMULATION_SPEEDS,
  createEmptySchedulingResult,
} from "../contracts/scheduling-contracts.js";

const initialState = Object.freeze({
  selectedAlgorithm: "fcfs",
  algorithmSettings: Object.freeze({
    "round-robin": Object.freeze({ timeQuantum: 2 }),
    priority: Object.freeze({ priorityMode: "default" }),
  }),
  processData: Object.freeze([]),
  schedulingResult: null,
  comparisonResult: null,
  simulation: Object.freeze({
    status: SCHEDULING_STATUSES.IDLE,
    speed: 1,
    snapshot: null,
  }),
  message: "Scheduler control center ready.",
});

function createSchedulerStateStore() {
  let state = initialState;
  const listeners = new Set();

  function getState() {
    return state;
  }

  function notify() {
    const snapshot = getState();
    listeners.forEach((listener) => listener(snapshot));
  }

  function setState(updater) {
    state = Object.freeze(updater(state));
    notify();
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(getState());

    return () => listeners.delete(listener);
  }

  function selectAlgorithm(algorithmId) {
    setState((current) => ({
      ...current,
      selectedAlgorithm: algorithmId,
      schedulingResult: null,
      simulation: {
        ...current.simulation,
        status: SCHEDULING_STATUSES.IDLE,
        snapshot: null,
      },
      message: `${algorithmId.toUpperCase()} selected.`,
    }));
  }

  function updateAlgorithmSetting(algorithmId, settingId, value) {
    setState((current) => ({
      ...current,
      algorithmSettings: {
        ...current.algorithmSettings,
        [algorithmId]: Object.freeze({
          ...(current.algorithmSettings[algorithmId] ?? {}),
          [settingId]: value,
        }),
      },
    }));
  }

  function setProcessData(processData) {
    setState((current) => {
      const isSameProcessData = JSON.stringify(current.processData) === JSON.stringify(processData);

      return {
        ...current,
        processData: Object.freeze([...processData]),
        schedulingResult: isSameProcessData ? current.schedulingResult : null,
        comparisonResult: isSameProcessData ? current.comparisonResult : null,
        simulation: {
          ...current.simulation,
          status: isSameProcessData ? current.simulation.status : SCHEDULING_STATUSES.IDLE,
          snapshot: isSameProcessData ? current.simulation.snapshot : null,
        },
        message: "Process state synchronized.",
      };
    });
  }

  function setSchedulingResult(result) {
    setState((current) => ({
      ...current,
      schedulingResult: result ?? createEmptySchedulingResult(current.selectedAlgorithm),
      message: "Scheduling result dispatched.",
    }));
  }

  function setComparisonResult(comparisonResult) {
    setState((current) => ({
      ...current,
      comparisonResult,
      message: "Algorithm comparison complete.",
    }));
  }

  function setSimulationStatus(status, snapshot = state.simulation.snapshot) {
    setState((current) => ({
      ...current,
      simulation: Object.freeze({
        ...current.simulation,
        status,
        snapshot,
      }),
    }));
  }

  function setSimulationSpeed(speed) {
    const normalizedSpeed = Number(speed);

    if (!SIMULATION_SPEEDS.includes(normalizedSpeed)) {
      return false;
    }

    setState((current) => ({
      ...current,
      simulation: Object.freeze({
        ...current.simulation,
        speed: normalizedSpeed,
      }),
    }));
    return true;
  }

  function setMessage(message) {
    setState((current) => ({
      ...current,
      message,
    }));
  }

  return {
    getState,
    subscribe,
    selectAlgorithm,
    updateAlgorithmSetting,
    setProcessData,
    setSchedulingResult,
    setComparisonResult,
    setSimulationStatus,
    setSimulationSpeed,
    setMessage,
  };
}

export const schedulerStateStore = createSchedulerStateStore();

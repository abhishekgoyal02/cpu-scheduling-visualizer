export const PROCESS_RUNTIME_STATUS = Object.freeze({
  NEW: "new",
  READY: "ready",
  RUNNING: "running",
  WAITING: "waiting",
  COMPLETED: "completed",
});

export function createProcess({ processId, arrivalTime, burstTime, priority }) {
  return Object.freeze({
    id: String(processId).trim(),
    arrivalTime: Number(arrivalTime),
    burstTime: Number(burstTime),
    priority: Number(priority),
  });
}

export function createSimulationProcess(process) {
  return {
    ...process,
    simulation: Object.freeze({
      remainingTime: process.burstTime,
      status: PROCESS_RUNTIME_STATUS.NEW,
      startedAt: null,
      completedAt: null,
      responseTime: null,
      waitingTime: 0,
      turnaroundTime: 0,
    }),
  };
}

export function cloneProcessForScheduling(process) {
  return createSimulationProcess(process);
}

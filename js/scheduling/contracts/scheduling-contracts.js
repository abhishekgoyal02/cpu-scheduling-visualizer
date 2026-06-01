export const SCHEDULING_STATUSES = Object.freeze({
  IDLE: "idle",
  READY: "ready",
  RUNNING: "running",
  PAUSED: "paused",
  COMPLETE: "complete",
  ERROR: "error",
});

export const SIMULATION_SPEEDS = Object.freeze([0.5, 1, 2, 5]);

export function createEmptySchedulingResult(algorithmId = null) {
  return Object.freeze({
    algorithm: algorithmId,
    timeline: Object.freeze([]),
    processes: Object.freeze([]),
    metrics: Object.freeze({
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
      averageResponseTime: 0,
      cpuUtilization: 0,
      throughput: 0,
    }),
    analytics: Object.freeze({
      perProcess: Object.freeze([]),
      comparison: Object.freeze({}),
    }),
  });
}

export function createTimelineEvent({ pid, start, end }) {
  return Object.freeze({
    pid,
    start,
    end,
    duration: end - start,
  });
}

import {
  appendTimelineEvent,
  compareProcessIds,
  createProcessRuntime,
  finalizeSchedulingResult,
  sortByArrivalThenId,
} from "./algorithm-utils.js";

function enqueueArrivals(processes, readyQueue, queuedIds, clock) {
  sortByArrivalThenId(processes)
    .filter((process) => process.remainingTime > 0 && process.arrivalTime <= clock && !queuedIds.has(process.id))
    .forEach((process) => {
      readyQueue.push(process);
      queuedIds.add(process.id);
    });
}

export function runRoundRobin(processes, settings = {}) {
  const timeQuantum = Math.max(1, Number(settings.timeQuantum) || 1);
  const runtimeProcesses = createProcessRuntime(processes);
  const timeline = [];
  const readyQueue = [];
  const queuedIds = new Set();
  let completedCount = 0;
  let clock = 0;

  while (completedCount < runtimeProcesses.length) {
    enqueueArrivals(runtimeProcesses, readyQueue, queuedIds, clock);

    if (readyQueue.length === 0) {
      const nextProcess = runtimeProcesses
        .filter((process) => process.remainingTime > 0)
        .sort((first, second) => first.arrivalTime - second.arrivalTime || compareProcessIds(first, second))[0];
      clock = nextProcess.arrivalTime;
      enqueueArrivals(runtimeProcesses, readyQueue, queuedIds, clock);
    }

    const selectedProcess = readyQueue.shift();

    if (selectedProcess.startTime === null) {
      selectedProcess.startTime = clock;
    }

    const executionTime = Math.min(timeQuantum, selectedProcess.remainingTime);
    const startTime = clock;
    const endTime = clock + executionTime;

    appendTimelineEvent(timeline, selectedProcess.id, startTime, endTime);
    selectedProcess.remainingTime -= executionTime;
    clock = endTime;

    enqueueArrivals(runtimeProcesses, readyQueue, queuedIds, clock);

    if (selectedProcess.remainingTime > 0) {
      readyQueue.push(selectedProcess);
    } else {
      queuedIds.delete(selectedProcess.id);
      selectedProcess.completionTime = clock;
      completedCount += 1;
    }
  }

  return finalizeSchedulingResult("ROUND ROBIN", runtimeProcesses, timeline);
}

import {
  appendTimelineEvent,
  compareProcessIds,
  createProcessRuntime,
  finalizeSchedulingResult,
} from "./algorithm-utils.js";

export function runSjf(processes) {
  const runtimeProcesses = createProcessRuntime(processes);
  const timeline = [];
  let completedCount = 0;
  let clock = 0;

  while (completedCount < runtimeProcesses.length) {
    const availableProcesses = runtimeProcesses
      .filter((process) => process.completionTime === null && process.arrivalTime <= clock)
      .sort((first, second) => {
        if (first.burstTime !== second.burstTime) {
          return first.burstTime - second.burstTime;
        }

        if (first.arrivalTime !== second.arrivalTime) {
          return first.arrivalTime - second.arrivalTime;
        }

        return compareProcessIds(first, second);
      });

    if (availableProcesses.length === 0) {
      const nextProcess = runtimeProcesses
        .filter((process) => process.completionTime === null)
        .sort((first, second) => first.arrivalTime - second.arrivalTime || compareProcessIds(first, second))[0];
      clock = nextProcess.arrivalTime;
      continue;
    }

    const selectedProcess = availableProcesses[0];
    selectedProcess.startTime = clock;
    appendTimelineEvent(timeline, selectedProcess.id, clock, clock + selectedProcess.burstTime);
    clock += selectedProcess.burstTime;
    selectedProcess.remainingTime = 0;
    selectedProcess.completionTime = clock;
    completedCount += 1;
  }

  return finalizeSchedulingResult("SJF", runtimeProcesses, timeline);
}

import {
  appendTimelineEvent,
  compareProcessIds,
  createProcessRuntime,
  finalizeSchedulingResult,
} from "./algorithm-utils.js";

function getNextArrivalTime(processes, clock) {
  const futureArrivals = processes
    .filter((process) => process.remainingTime > 0 && process.arrivalTime > clock)
    .map((process) => process.arrivalTime);

  return futureArrivals.length === 0 ? clock : Math.min(...futureArrivals);
}

export function runSrtf(processes) {
  const runtimeProcesses = createProcessRuntime(processes);
  const timeline = [];
  let completedCount = 0;
  let clock = 0;

  while (completedCount < runtimeProcesses.length) {
    const availableProcesses = runtimeProcesses
      .filter((process) => process.remainingTime > 0 && process.arrivalTime <= clock)
      .sort((first, second) => {
        if (first.remainingTime !== second.remainingTime) {
          return first.remainingTime - second.remainingTime;
        }

        if (first.arrivalTime !== second.arrivalTime) {
          return first.arrivalTime - second.arrivalTime;
        }

        return compareProcessIds(first, second);
      });

    if (availableProcesses.length === 0) {
      clock = getNextArrivalTime(runtimeProcesses, clock);
      continue;
    }

    const selectedProcess = availableProcesses[0];
    const nextArrivalTime = getNextArrivalTime(runtimeProcesses, clock);
    const executionWindow = nextArrivalTime > clock
      ? Math.min(selectedProcess.remainingTime, nextArrivalTime - clock)
      : 1;
    const startTime = clock;
    const endTime = clock + executionWindow;

    if (selectedProcess.startTime === null) {
      selectedProcess.startTime = startTime;
    }

    appendTimelineEvent(timeline, selectedProcess.id, startTime, endTime);
    selectedProcess.remainingTime -= executionWindow;
    clock = endTime;

    if (selectedProcess.remainingTime === 0) {
      selectedProcess.completionTime = clock;
      completedCount += 1;
    }
  }

  return finalizeSchedulingResult("SRTF", runtimeProcesses, timeline);
}

import { calculateMetrics } from "../metrics/metrics-calculator.js";

export function compareProcessIds(first, second) {
  return first.id.localeCompare(second.id, undefined, { numeric: true });
}

export function sortByArrivalThenId(processes) {
  return [...processes].sort((first, second) => {
    if (first.arrivalTime !== second.arrivalTime) {
      return first.arrivalTime - second.arrivalTime;
    }

    return compareProcessIds(first, second);
  });
}

export function appendTimelineEvent(timeline, pid, start, end) {
  if (start === end) {
    return;
  }

  const previousEvent = timeline[timeline.length - 1];

  if (previousEvent?.pid === pid && previousEvent.end === start) {
    previousEvent.end = end;
    return;
  }

  timeline.push({ pid, start, end });
}

export function createProcessRuntime(processes) {
  return sortByArrivalThenId(processes).map((process) => ({
    id: process.id,
    arrivalTime: process.arrivalTime,
    burstTime: process.burstTime,
    priority: process.priority,
    remainingTime: process.burstTime,
    startTime: null,
    completionTime: null,
  }));
}

export function finalizeSchedulingResult(algorithm, runtimeProcesses, timeline) {
  const scheduledProcesses = runtimeProcesses
    .map((process) => {
      const completionTime = process.completionTime ?? process.arrivalTime;
      const turnaroundTime = completionTime - process.arrivalTime;
      const waitingTime = turnaroundTime - process.burstTime;
      const responseTime =
        process.startTime === null ? 0 : process.startTime - process.arrivalTime;

      return {
        pid: process.id,
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        priority: process.priority,
        startTime: process.startTime ?? process.arrivalTime,
        completionTime,
        waitingTime,
        turnaroundTime,
        responseTime,
      };
    })
    .sort((first, second) => first.pid.localeCompare(second.pid, undefined, { numeric: true }));

  return {
    algorithm,
    generatedAt: new Date().toISOString(),
    processes: scheduledProcesses,
    timeline,
    metrics: calculateMetrics(scheduledProcesses, timeline),
  };
}

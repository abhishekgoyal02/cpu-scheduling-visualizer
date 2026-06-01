import { calculateMetrics } from "../metrics/metrics-calculator.js";

function sortByArrivalOrder(processes) {
  return [...processes].sort((first, second) => {
    if (first.arrivalTime !== second.arrivalTime) {
      return first.arrivalTime - second.arrivalTime;
    }

    return first.id.localeCompare(second.id, undefined, { numeric: true });
  });
}

export function runFcfs(processes) {
  const scheduledProcesses = [];
  const timeline = [];
  let clock = 0;

  sortByArrivalOrder(processes).forEach((process) => {
    const startTime = Math.max(clock, process.arrivalTime);
    const completionTime = startTime + process.burstTime;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;
    const responseTime = startTime - process.arrivalTime;

    timeline.push({
      pid: process.id,
      start: startTime,
      end: completionTime,
    });

    scheduledProcesses.push({
      pid: process.id,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      priority: process.priority,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime,
      responseTime,
    });

    clock = completionTime;
  });

  return {
    algorithm: "FCFS",
    generatedAt: new Date().toISOString(),
    processes: scheduledProcesses,
    timeline,
    metrics: calculateMetrics(scheduledProcesses, timeline),
  };
}

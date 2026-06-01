function average(values) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function roundMetric(value) {
  return Number(value.toFixed(2));
}

export function calculateMetrics(processes, timeline) {
  if (processes.length === 0 || timeline.length === 0) {
    return {
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
      averageResponseTime: 0,
      cpuUtilization: 0,
      throughput: 0,
    };
  }

  const lastEndTime = Math.max(...timeline.map((event) => event.end));
  const totalBurstTime = processes.reduce((total, process) => total + process.burstTime, 0);
  const elapsedTime = lastEndTime;

  return {
    averageWaitingTime: roundMetric(average(processes.map((process) => process.waitingTime))),
    averageTurnaroundTime: roundMetric(
      average(processes.map((process) => process.turnaroundTime)),
    ),
    averageResponseTime: roundMetric(average(processes.map((process) => process.responseTime))),
    cpuUtilization: elapsedTime === 0 ? 0 : roundMetric((totalBurstTime / elapsedTime) * 100),
    throughput: elapsedTime === 0 ? 0 : roundMetric(processes.length / elapsedTime),
  };
}

import { clearElement, createElement } from "./dom-utils.js";

const METRIC_LABELS = [
  ["averageWaitingTime", "Average Waiting Time"],
  ["averageTurnaroundTime", "Average Turnaround Time"],
  ["averageResponseTime", "Average Response Time"],
  ["cpuUtilization", "CPU Utilization"],
  ["throughput", "Throughput"],
];

export function renderMetricsDashboard(container, metrics) {
  clearElement(container);
  container.classList.add("visualization-box", "metrics-grid");

  if (!metrics) {
    container.append(createElement("div", "visualization-empty", "WT / TAT / RT / CPU utilization"));
    return;
  }

  METRIC_LABELS.forEach(([key, label]) => {
    const card = createElement("div", "metric-card");
    const metricLabel = createElement("div", "metric-card__label", label);
    const suffix = key === "cpuUtilization" ? "%" : "";
    const metricValue = createElement("div", "metric-card__value", `${metrics[key]}${suffix}`);
    card.append(metricLabel, metricValue);
    container.append(card);
  });
}

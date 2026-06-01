import { clearElement, createElement } from "./dom-utils.js";

const COMPARISON_COLUMNS = [
  ["algorithm", "Algorithm Name"],
  ["averageWaitingTime", "Average Waiting Time"],
  ["averageTurnaroundTime", "Average Turnaround Time"],
  ["averageResponseTime", "Average Response Time"],
  ["cpuUtilization", "CPU Utilization"],
  ["throughput", "Throughput"],
];

const HIGHLIGHT_METRICS = new Set([
  "averageWaitingTime",
  "averageTurnaroundTime",
  "averageResponseTime",
]);

function isHighlighted(comparisonResult, metricName, algorithm) {
  return comparisonResult.highlights[metricName]?.algorithms.includes(algorithm) ?? false;
}

export function renderComparison(container, comparisonResult) {
  clearElement(container);
  container.classList.add("visualization-box", "comparison-output");

  if (!comparisonResult) {
    container.append(createElement("div", "visualization-empty", "Chart rendering area"));
    return;
  }

  const table = createElement("table", "comparison-table");
  const title = createElement("div", "table-section-title", "Algorithm Comparison Results");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const tbody = document.createElement("tbody");
  const summary = createElement("div", "comparison-summary");

  COMPARISON_COLUMNS.forEach(([, label]) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    headerRow.append(th);
  });

  comparisonResult.results.forEach((result) => {
    const row = document.createElement("tr");

    COMPARISON_COLUMNS.forEach(([key]) => {
      const cell = document.createElement("td");
      const value = key === "algorithm" ? result.algorithm : result.metrics[key];
      cell.textContent = key === "cpuUtilization" ? `${value}%` : value;

      if (HIGHLIGHT_METRICS.has(key) && isHighlighted(comparisonResult, key, result.algorithm)) {
        cell.dataset.best = "true";
      }

      row.append(cell);
    });

    tbody.append(row);
  });

  thead.append(headerRow);
  table.append(thead, tbody);

  summary.append(
    createElement("div", "comparison-summary__line", `BEST: ${comparisonResult.summary.bestOverall}`),
    createElement("div", "comparison-summary__line", `WORST: ${comparisonResult.summary.worstOverall}`),
    ...comparisonResult.summary.notes.map((note) =>
      createElement("div", "comparison-summary__note", note),
    ),
  );

  container.append(title, table, summary);
}

import { clearElement, createElement } from "./dom-utils.js";

const RESULT_COLUMNS = [
  ["pid", "Process ID"],
  ["arrivalTime", "Arrival Time"],
  ["burstTime", "Burst Time"],
  ["completionTime", "Completion Time"],
  ["waitingTime", "Waiting Time"],
  ["turnaroundTime", "Turnaround Time"],
  ["responseTime", "Response Time"],
];

export function renderResultsTable(container, processes) {
  clearElement(container);
  container.classList.add("visualization-box", "results-table-shell");

  if (!processes || processes.length === 0) {
    container.append(createElement("div", "visualization-empty", "Algorithm comparison container"));
    return;
  }

  const table = createElement("table", "results-table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const tbody = document.createElement("tbody");

  RESULT_COLUMNS.forEach(([, label]) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    headerRow.append(th);
  });

  processes.forEach((process) => {
    const row = document.createElement("tr");

    RESULT_COLUMNS.forEach(([key]) => {
      const cell = document.createElement("td");
      cell.textContent = process[key];
      row.append(cell);
    });

    tbody.append(row);
  });

  thead.append(headerRow);
  table.append(thead, tbody);
  container.append(table);
}

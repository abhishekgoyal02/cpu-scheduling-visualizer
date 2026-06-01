function createCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

export function renderProcessTable(tableBody, state) {
  tableBody.replaceChildren();

  if (state.processes.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.className = "process-table__empty";
    cell.colSpan = 4;
    cell.textContent = "No processes loaded";
    row.append(cell);
    tableBody.append(row);
    return;
  }

  state.processes.forEach((process) => {
    const row = document.createElement("tr");
    row.tabIndex = 0;
    row.dataset.processId = process.id;
    row.setAttribute("aria-selected", String(process.id === state.selectedProcessId));

    row.append(
      createCell(process.id),
      createCell(process.arrivalTime),
      createCell(process.burstTime),
      createCell(process.priority),
    );

    tableBody.append(row);
  });
}

export function showProcessMessage(messageElement, message, tone = "neutral") {
  messageElement.textContent = message;
  messageElement.dataset.tone = tone;
}

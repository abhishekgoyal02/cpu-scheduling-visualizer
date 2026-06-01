import { clearElement, createElement } from "./dom-utils.js";

export function renderReadyQueue(container, result, snapshot) {
  clearElement(container);
  container.classList.add("visualization-box", "ready-queue");

  if (!result) {
    container.append(createElement("div", "visualization-empty", "Awaiting process data"));
    return;
  }

  const revealedPids = new Set(snapshot.revealedEvents.map((event) => event.pid));
  const queue = result.timeline.filter((event) => !revealedPids.has(event.pid));

  if (queue.length === 0) {
    container.append(createElement("div", "visualization-empty", "Ready queue empty"));
    return;
  }

  queue.forEach((event) => {
    const item = createElement("div", "ready-queue__item", event.pid);
    item.dataset.active = String(snapshot.activeEvent?.pid === event.pid);
    container.append(item);
  });
}

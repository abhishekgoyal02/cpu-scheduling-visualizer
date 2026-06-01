import { clearElement, createElement } from "./dom-utils.js";

export function renderReadyQueue(container, result, snapshot) {
  clearElement(container);
  container.classList.add("visualization-box", "ready-queue");

  if (!result) {
    container.append(createElement("div", "visualization-empty", "Awaiting process data"));
    return;
  }

  const eventKey = (event) => `${event.pid}-${event.start}-${event.end}`;
  const revealedEvents = new Set(snapshot.revealedEvents.map((event) => eventKey(event)));
  const queue = result.timeline.filter((event) => !revealedEvents.has(eventKey(event)));

  if (queue.length === 0) {
    container.append(createElement("div", "visualization-empty", "Ready queue empty"));
    return;
  }

  queue.forEach((event) => {
    const item = createElement("div", "ready-queue__item", event.pid);
    item.dataset.active = String(snapshot.activeEvent && eventKey(snapshot.activeEvent) === eventKey(event));
    container.append(item);
  });
}

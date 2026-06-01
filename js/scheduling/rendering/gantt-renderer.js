import { clearElement, createElement } from "./dom-utils.js";

function getTimelineTotal(timeline) {
  if (timeline.length === 0) {
    return 0;
  }

  return Math.max(...timeline.map((event) => event.end));
}

function createEmptyState(message) {
  return createElement("div", "visualization-empty", message);
}

export function renderGanttChart(container, result, snapshot) {
  clearElement(container);
  container.classList.add("visualization-box", "gantt-visualization");

  if (!result) {
    container.append(createEmptyState("Timeline output container"));
    return;
  }

  const chart = createElement("div", "gantt-chart");
  const track = createElement("div", "gantt-track");
  const timestamps = createElement("div", "gantt-timestamps");
  const totalTime = getTimelineTotal(result.timeline);
  const revealedIds = new Set(snapshot.revealedEvents.map((event) => `${event.pid}-${event.start}-${event.end}`));
  const activeKey = snapshot.activeEvent
    ? `${snapshot.activeEvent.pid}-${snapshot.activeEvent.start}-${snapshot.activeEvent.end}`
    : "";

  track.dataset.cursorTime = "0";

  result.timeline.forEach((event) => {
    const eventKey = `${event.pid}-${event.start}-${event.end}`;
    const duration = event.end - event.start;
    const width = totalTime === 0 ? 0 : (duration / totalTime) * 100;
    const block = createElement("div", "gantt-block", event.pid);
    const startStamp = createElement("span", "gantt-timestamp", String(event.start));

    if (event.start > track.dataset.cursorTime) {
      const idleDuration = event.start - Number(track.dataset.cursorTime);
      const idleBlock = createElement("div", "gantt-idle-block", "");
      idleBlock.style.flexBasis = `${totalTime === 0 ? 0 : (idleDuration / totalTime) * 100}%`;
      idleBlock.style.flexGrow = String(idleDuration);
      track.append(idleBlock);
    }

    block.style.flexBasis = `${width}%`;
    block.style.flexGrow = String(duration);
    block.dataset.visible = String(revealedIds.has(eventKey));
    block.dataset.active = String(eventKey === activeKey);

    startStamp.style.left = `${totalTime === 0 ? 0 : (event.start / totalTime) * 100}%`;
    track.append(block);
    timestamps.append(startStamp);
    track.dataset.cursorTime = String(event.end);
  });

  const finalStamp = createElement("span", "gantt-timestamp", String(totalTime));
  finalStamp.style.left = "100%";
  timestamps.append(finalStamp);

  chart.append(track, timestamps);
  container.append(chart);
}

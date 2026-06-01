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

function createControls(engine) {
  const controls = createElement("div", "simulation-controls");
  const playButton = createElement("button", "button button--primary", "Play");
  const pauseButton = createElement("button", "button button--secondary", "Pause");
  const resetButton = createElement("button", "button button--ghost", "Reset");
  const speedGroup = createElement("div", "speed-controls");

  playButton.type = "button";
  pauseButton.type = "button";
  resetButton.type = "button";

  playButton.addEventListener("click", () => engine.play());
  pauseButton.addEventListener("click", () => engine.pause());
  resetButton.addEventListener("click", () => engine.reset());

  engine.allowedSpeeds.forEach((speed) => {
    const speedButton = createElement("button", "button button--ghost speed-control", `${speed}x`);
    speedButton.type = "button";
    speedButton.dataset.speed = String(speed);
    speedButton.dataset.active = String(engine.getSnapshot().speed === speed);
    speedButton.addEventListener("click", () => engine.setSpeed(speed));
    speedGroup.append(speedButton);
  });

  controls.append(playButton, pauseButton, resetButton, speedGroup);
  return controls;
}

export function renderGanttChart(container, result, snapshot, engine) {
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

  result.timeline.forEach((event) => {
    const eventKey = `${event.pid}-${event.start}-${event.end}`;
    const width = totalTime === 0 ? 0 : ((event.end - event.start) / totalTime) * 100;
    const block = createElement("div", "gantt-block", event.pid);
    const startStamp = createElement("span", "gantt-timestamp", String(event.start));

    block.style.flexBasis = `${width}%`;
    block.style.flexGrow = String(event.end - event.start);
    block.dataset.visible = String(revealedIds.has(eventKey));
    block.dataset.active = String(eventKey === activeKey);

    startStamp.style.left = `${totalTime === 0 ? 0 : (event.start / totalTime) * 100}%`;
    track.append(block);
    timestamps.append(startStamp);
  });

  const finalStamp = createElement("span", "gantt-timestamp", String(totalTime));
  finalStamp.style.left = "100%";
  timestamps.append(finalStamp);

  chart.append(track, timestamps);
  container.append(createControls(engine), chart);
}

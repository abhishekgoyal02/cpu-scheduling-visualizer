import { createAnalyticsState } from "./analytics-state.js";
import { renderAnalyticsPanel } from "../rendering/analytics-renderer.js";

const FRAME_INTERVAL_MS = 120;

function getEventProgress(snapshot, startedAt) {
  if (!snapshot.activeEvent || snapshot.state !== "running") {
    return snapshot.activeEvent?.end ?? 0;
  }

  const eventDuration = snapshot.activeEvent.end - snapshot.activeEvent.start;
  const wallDuration = 800 / snapshot.speed;
  const elapsed = Math.min(Date.now() - startedAt, wallDuration);
  const progress = wallDuration === 0 ? 1 : elapsed / wallDuration;

  return snapshot.activeEvent.start + eventDuration * progress;
}

export function createAnalyticsController(container) {
  const analyticsState = createAnalyticsState();
  let animationFrameId = null;
  let activeSnapshot = null;
  let activeEventKey = "";
  let activeEventStartedAt = 0;
  let lastRenderedAt = 0;

  function render() {
    if (container) {
      renderAnalyticsPanel(container, analyticsState.getState());
    }
  }

  function stopLoop() {
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function tick() {
    if (!activeSnapshot || activeSnapshot.state !== "running") {
      stopLoop();
      return;
    }

    const now = Date.now();

    if (now - lastRenderedAt >= FRAME_INTERVAL_MS) {
      analyticsState.captureAt(getEventProgress(activeSnapshot, activeEventStartedAt));
      render();
      lastRenderedAt = now;
    }

    animationFrameId = window.requestAnimationFrame(tick);
  }

  function startLoop() {
    if (animationFrameId === null) {
      animationFrameId = window.requestAnimationFrame(tick);
    }
  }

  function setResult(result) {
    stopLoop();
    activeSnapshot = null;
    activeEventKey = "";
    activeEventStartedAt = 0;
    analyticsState.reset(result);
    render();
  }

  function updateFromSnapshot(snapshot) {
    activeSnapshot = snapshot;

    if (snapshot.activeEvent) {
      const nextEventKey = `${snapshot.activeEvent.pid}-${snapshot.activeEvent.start}-${snapshot.activeEvent.end}`;

      if (nextEventKey !== activeEventKey) {
        activeEventKey = nextEventKey;
        activeEventStartedAt = Date.now();
      }
    }

    analyticsState.captureSnapshot(snapshot);
    render();

    if (snapshot.state === "running") {
      startLoop();
    } else {
      stopLoop();
    }
  }

  render();

  return {
    setResult,
    updateFromSnapshot,
  };
}

const ALLOWED_SPEEDS = Object.freeze([0.5, 1, 2, 5]);
const BASE_TICK_MS = 800;

export function createSimulationEngine() {
  let timeline = [];
  let currentIndex = 0;
  let speed = 1;
  let timerId = null;
  let state = "idle";
  const listeners = new Set();

  function getSnapshot() {
    const visibleActiveIndex = currentIndex > 0 && state !== "complete" ? currentIndex - 1 : -1;

    return Object.freeze({
      state,
      speed,
      currentIndex,
      totalEvents: timeline.length,
      revealedEvents: Object.freeze(timeline.slice(0, currentIndex)),
      activeEvent: visibleActiveIndex >= 0 ? timeline[visibleActiveIndex] : null,
      isComplete: timeline.length > 0 && currentIndex >= timeline.length,
    });
  }

  function notify() {
    const snapshot = getSnapshot();
    listeners.forEach((listener) => listener(snapshot));
  }

  function stopTimer() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function step() {
    if (currentIndex < timeline.length) {
      currentIndex += 1;
      notify();
    }

    if (currentIndex >= timeline.length) {
      stopTimer();
      state = "complete";
      notify();
    }
  }

  function play() {
    if (timeline.length === 0 || state === "playing") {
      return;
    }

    if (state === "complete") {
      currentIndex = 0;
    }

    state = "playing";
    notify();
    stopTimer();
    timerId = window.setInterval(step, BASE_TICK_MS / speed);
    step();
  }

  function pause() {
    if (state !== "playing") {
      return;
    }

    stopTimer();
    state = "paused";
    notify();
  }

  function reset(nextTimeline = timeline) {
    stopTimer();
    timeline = [...nextTimeline];
    currentIndex = 0;
    state = timeline.length === 0 ? "idle" : "ready";
    notify();
  }

  function setSpeed(nextSpeed) {
    const normalizedSpeed = Number(nextSpeed);

    if (!ALLOWED_SPEEDS.includes(normalizedSpeed)) {
      return false;
    }

    speed = normalizedSpeed;

    if (state === "playing") {
      stopTimer();
      timerId = window.setInterval(step, BASE_TICK_MS / speed);
    }

    notify();
    return true;
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(getSnapshot());

    return () => listeners.delete(listener);
  }

  return {
    play,
    pause,
    reset,
    setSpeed,
    subscribe,
    getSnapshot,
    allowedSpeeds: ALLOWED_SPEEDS,
  };
}

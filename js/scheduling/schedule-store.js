const initialState = Object.freeze({
  result: null,
});

function createScheduleStore() {
  let state = initialState;
  const listeners = new Set();

  function getState() {
    return state;
  }

  function notify() {
    const snapshot = getState();
    listeners.forEach((listener) => listener(snapshot));
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(getState());

    return () => listeners.delete(listener);
  }

  function setResult(result) {
    state = Object.freeze({ result });
    notify();
  }

  function reset() {
    state = initialState;
    notify();
  }

  return {
    getState,
    subscribe,
    setResult,
    reset,
  };
}

export const scheduleStore = createScheduleStore();

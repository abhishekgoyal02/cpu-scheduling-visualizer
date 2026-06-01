import { SCHEDULING_STATUSES } from "../contracts/scheduling-contracts.js";

export function createSimulationController(simulationEngine, schedulerStateStore) {
  simulationEngine.subscribe((snapshot) => {
    schedulerStateStore.setSimulationStatus(snapshot.state, snapshot);
  });

  function loadTimeline(timeline) {
    simulationEngine.reset(timeline);
  }

  function run() {
    const { simulation } = schedulerStateStore.getState();

    if (simulation.status === SCHEDULING_STATUSES.RUNNING) {
      schedulerStateStore.setMessage("Simulation is already running.");
      return false;
    }

    simulationEngine.play();
    return true;
  }

  function pause() {
    const { simulation } = schedulerStateStore.getState();

    if (simulation.status !== SCHEDULING_STATUSES.RUNNING) {
      schedulerStateStore.setMessage("Pause requires a running simulation.");
      return false;
    }

    simulationEngine.pause();
    return true;
  }

  function resume() {
    const { simulation } = schedulerStateStore.getState();

    if (simulation.status !== SCHEDULING_STATUSES.PAUSED) {
      schedulerStateStore.setMessage("Resume requires a paused simulation.");
      return false;
    }

    simulationEngine.play();
    return true;
  }

  function reset() {
    simulationEngine.reset();
    return true;
  }

  function setSpeed(speed) {
    const didSetEngineSpeed = simulationEngine.setSpeed(speed);
    const didSetStateSpeed = schedulerStateStore.setSimulationSpeed(speed);
    return didSetEngineSpeed && didSetStateSpeed;
  }

  return {
    loadTimeline,
    run,
    pause,
    resume,
    reset,
    setSpeed,
  };
}

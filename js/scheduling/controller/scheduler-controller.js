import { createEmptySchedulingResult } from "../contracts/scheduling-contracts.js";
import { compareAlgorithms } from "../comparison/comparison-service.js";
import { getAlgorithm, loadAlgorithmRunner } from "../registry/algorithm-registry.js";

export function createSchedulerController({
  processStore,
  schedulerStateStore,
  simulationController,
}) {
  function synchronizeProcessData() {
    schedulerStateStore.setProcessData(processStore.getSchedulingInput());
  }

  async function runSelectedAlgorithm() {
    synchronizeProcessData();

    const state = schedulerStateStore.getState();
    const algorithm = getAlgorithm(state.selectedAlgorithm);

    if (!algorithm) {
      schedulerStateStore.setMessage("No scheduling algorithm selected.");
      return null;
    }

    const runner = await loadAlgorithmRunner(algorithm.id);

    if (!runner) {
      const emptyResult = createEmptySchedulingResult(algorithm.id);
      schedulerStateStore.setSchedulingResult(emptyResult);
      simulationController.loadTimeline(emptyResult.timeline);
      schedulerStateStore.setMessage(`${algorithm.label} runner is ready for future implementation.`);
      return emptyResult;
    }

    const result = await runner({
      processes: state.processData,
      settings: state.algorithmSettings[algorithm.id] ?? {},
    });

    schedulerStateStore.setSchedulingResult(result);
    simulationController.loadTimeline(result.timeline);
    simulationController.run();
    return result;
  }

  async function compareAllAlgorithms() {
    synchronizeProcessData();

    const state = schedulerStateStore.getState();

    if (state.processData.length === 0) {
      schedulerStateStore.setMessage("Process data is required before comparing algorithms.");
      return null;
    }

    const comparisonResult = await compareAlgorithms(state.processData, state.algorithmSettings);
    schedulerStateStore.setComparisonResult(comparisonResult);
    return comparisonResult;
  }

  return {
    synchronizeProcessData,
    runSelectedAlgorithm,
    compareAllAlgorithms,
    pauseSimulation: simulationController.pause,
    resumeSimulation: simulationController.resume,
    resetSimulation: simulationController.reset,
    setSimulationSpeed: simulationController.setSpeed,
  };
}

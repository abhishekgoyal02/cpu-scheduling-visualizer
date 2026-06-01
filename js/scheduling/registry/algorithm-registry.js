const algorithmDefinitions = new Map();

function createDefinition(definition) {
  return Object.freeze({
    id: definition.id,
    label: definition.label,
    isPreemptive: Boolean(definition.isPreemptive),
    settings: Object.freeze(definition.settings ?? []),
    runner: definition.runner ?? null,
    loader: definition.loader ?? null,
  });
}

export function registerAlgorithm(definition) {
  algorithmDefinitions.set(definition.id, createDefinition(definition));
}

export function registerAlgorithmRunner(algorithmId, runner) {
  const definition = algorithmDefinitions.get(algorithmId);

  if (!definition) {
    throw new Error(`Unknown algorithm: ${algorithmId}`);
  }

  algorithmDefinitions.set(
    algorithmId,
    createDefinition({
      ...definition,
      runner,
    }),
  );
}

export function getAlgorithm(algorithmId) {
  return algorithmDefinitions.get(algorithmId) ?? null;
}

export function getAlgorithms() {
  return [...algorithmDefinitions.values()];
}

export async function loadAlgorithmRunner(algorithmId) {
  const definition = getAlgorithm(algorithmId);

  if (!definition) {
    return null;
  }

  if (definition.runner) {
    return definition.runner;
  }

  if (!definition.loader) {
    return null;
  }

  const runner = await definition.loader();
  registerAlgorithmRunner(algorithmId, runner);
  return runner;
}

registerAlgorithm({
  id: "fcfs",
  label: "FCFS",
  isPreemptive: false,
  loader: async () => {
    const { runFcfs } = await import("../algorithms/fcfs.js");
    return ({ processes }) => runFcfs(processes);
  },
});

registerAlgorithm({
  id: "sjf",
  label: "SJF",
  isPreemptive: false,
  loader: async () => {
    const { runSjf } = await import("../algorithms/sjf.js");
    return ({ processes }) => runSjf(processes);
  },
});

registerAlgorithm({
  id: "srtf",
  label: "SRTF",
  isPreemptive: true,
  loader: async () => {
    const { runSrtf } = await import("../algorithms/srtf.js");
    return ({ processes }) => runSrtf(processes);
  },
});

registerAlgorithm({
  id: "priority",
  label: "Priority Scheduling",
  isPreemptive: false,
  settings: [
    {
      id: "priorityMode",
      label: "Priority Configuration",
      type: "placeholder",
    },
  ],
  loader: async () => {
    const { runPriority } = await import("../algorithms/priority.js");
    return ({ processes }) => runPriority(processes);
  },
});

registerAlgorithm({
  id: "round-robin",
  label: "Round Robin",
  isPreemptive: true,
  settings: [
    {
      id: "timeQuantum",
      label: "Time Quantum",
      type: "number",
      min: 1,
      defaultValue: 2,
    },
  ],
  loader: async () => {
    const { runRoundRobin } = await import("../algorithms/round-robin.js");
    return ({ processes, settings }) => runRoundRobin(processes, settings);
  },
});

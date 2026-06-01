import { getAlgorithms, loadAlgorithmRunner } from "../registry/algorithm-registry.js";

const LOWER_IS_BETTER = Object.freeze([
  "averageWaitingTime",
  "averageTurnaroundTime",
  "averageResponseTime",
]);

function getMetricValue(result, metricName) {
  return result.metrics[metricName];
}

function findLowest(results, metricName) {
  const bestValue = Math.min(...results.map((result) => getMetricValue(result, metricName)));

  return {
    value: bestValue,
    algorithms: results
      .filter((result) => getMetricValue(result, metricName) === bestValue)
      .map((result) => result.algorithm),
  };
}

function getRankScore(result, results) {
  return LOWER_IS_BETTER.reduce((score, metricName) => {
    const sortedValues = [...new Set(results.map((candidate) => getMetricValue(candidate, metricName)))].sort(
      (first, second) => first - second,
    );

    return score + sortedValues.indexOf(getMetricValue(result, metricName));
  }, 0);
}

function buildSummary(results, highlights) {
  const rankedResults = [...results].sort((first, second) => {
    const scoreDifference = getRankScore(first, results) - getRankScore(second, results);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return first.algorithm.localeCompare(second.algorithm);
  });
  const bestOverall = rankedResults[0];
  const worstOverall = rankedResults[rankedResults.length - 1];

  return {
    bestOverall: bestOverall.algorithm,
    worstOverall: worstOverall.algorithm,
    notes: [
      `${bestOverall.algorithm} has the strongest combined waiting, turnaround, and response profile.`,
      `${worstOverall.algorithm} has the weakest combined profile for this process set.`,
      `Lowest average waiting time: ${highlights.averageWaitingTime.algorithms.join(", ")} (${highlights.averageWaitingTime.value}).`,
      `Lowest average turnaround time: ${highlights.averageTurnaroundTime.algorithms.join(", ")} (${highlights.averageTurnaroundTime.value}).`,
      `Lowest average response time: ${highlights.averageResponseTime.algorithms.join(", ")} (${highlights.averageResponseTime.value}).`,
    ],
  };
}

export async function compareAlgorithms(processes, algorithmSettings) {
  const results = [];

  for (const algorithm of getAlgorithms()) {
    const runner = await loadAlgorithmRunner(algorithm.id);

    if (!runner) {
      continue;
    }

    results.push(
      await runner({
        processes,
        settings: algorithmSettings[algorithm.id] ?? {},
      }),
    );
  }

  const highlights = Object.fromEntries(
    LOWER_IS_BETTER.map((metricName) => [metricName, findLowest(results, metricName)]),
  );

  return {
    generatedAt: new Date().toISOString(),
    results,
    highlights,
    summary: buildSummary(results, highlights),
  };
}

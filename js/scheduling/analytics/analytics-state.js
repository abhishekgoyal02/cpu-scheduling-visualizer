function getEventKey(event) {
  return event ? `${event.pid}-${event.start}-${event.end}` : "";
}

function getTotalRuntime(timeline) {
  if (!timeline.length) {
    return 0;
  }

  return Math.max(...timeline.map((event) => event.end));
}

function getCompletedCount(processes, currentTime) {
  return processes.filter((process) => process.completionTime <= currentTime).length;
}

function getBusyTimeUntil(timeline, currentTime) {
  return timeline.reduce((total, event) => {
    if (currentTime <= event.start) {
      return total;
    }

    return total + Math.min(currentTime, event.end) - event.start;
  }, 0);
}

function createDataPoint(result, currentTime) {
  const normalizedTime = Math.max(0, currentTime);
  const busyTime = getBusyTimeUntil(result.timeline, normalizedTime);
  const cpuUtilization = normalizedTime === 0 ? 0 : (busyTime / normalizedTime) * 100;

  return {
    time: Number(normalizedTime.toFixed(2)),
    cpuUtilization: Number(cpuUtilization.toFixed(2)),
    completedProcesses: getCompletedCount(result.processes, normalizedTime),
  };
}

export function createAnalyticsState() {
  let result = null;
  let points = [];
  let lastEventKey = "";

  function reset(nextResult) {
    result = nextResult;
    points = [];
    lastEventKey = "";

    if (result) {
      points.push(createDataPoint(result, 0));
    }

    return getState();
  }

  function captureAt(currentTime) {
    if (!result) {
      return getState();
    }

    const point = createDataPoint(result, currentTime);
    const previousPoint = points[points.length - 1];

    if (!previousPoint || previousPoint.time !== point.time) {
      points.push(point);
    } else {
      points[points.length - 1] = point;
    }

    return getState();
  }

  function captureSnapshot(snapshot) {
    if (!result || snapshot.state === "idle") {
      return getState();
    }

    const activeEventKey = getEventKey(snapshot.activeEvent);

    if (snapshot.activeEvent && activeEventKey !== lastEventKey) {
      if (snapshot.activeEvent.start > 0) {
        captureAt(snapshot.activeEvent.start);
      }

      lastEventKey = activeEventKey;
    }

    if (snapshot.state === "complete") {
      captureAt(getTotalRuntime(result.timeline));
    }

    return getState();
  }

  function getState() {
    return {
      result,
      points: [...points],
      totalRuntime: result ? getTotalRuntime(result.timeline) : 0,
      totalProcesses: result?.processes.length ?? 0,
    };
  }

  return {
    reset,
    captureAt,
    captureSnapshot,
    getState,
  };
}

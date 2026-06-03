import { clearElement, createElement } from "./dom-utils.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const VIEWBOX_WIDTH = 640;
const VIEWBOX_HEIGHT = 220;
const PADDING = 34;

function createSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });

  return element;
}

function getScaleX(totalRuntime) {
  return (time) => {
    if (totalRuntime === 0) {
      return PADDING;
    }

    return PADDING + (time / totalRuntime) * (VIEWBOX_WIDTH - PADDING * 2);
  };
}

function getScaleY(maxValue) {
  return (value) => {
    if (maxValue === 0) {
      return VIEWBOX_HEIGHT - PADDING;
    }

    return VIEWBOX_HEIGHT - PADDING - (value / maxValue) * (VIEWBOX_HEIGHT - PADDING * 2);
  };
}

function createPath(points, xAccessor, yAccessor, maxValue, totalRuntime) {
  if (!points.length) {
    return "";
  }

  const scaleX = getScaleX(totalRuntime);
  const scaleY = getScaleY(maxValue);

  return points
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${scaleX(xAccessor(point)).toFixed(2)} ${scaleY(yAccessor(point)).toFixed(2)}`;
    })
    .join(" ");
}

function renderGraph(title, points, options) {
  const graph = createElement("section", "analytics-graph");
  const heading = createElement("div", "analytics-graph__title", title);
  const svg = createSvgElement("svg", {
    class: "analytics-graph__svg",
    viewBox: `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`,
    role: "img",
    "aria-label": title,
  });
  const xAxis = createSvgElement("line", {
    x1: PADDING,
    y1: VIEWBOX_HEIGHT - PADDING,
    x2: VIEWBOX_WIDTH - PADDING,
    y2: VIEWBOX_HEIGHT - PADDING,
  });
  const yAxis = createSvgElement("line", {
    x1: PADDING,
    y1: PADDING,
    x2: PADDING,
    y2: VIEWBOX_HEIGHT - PADDING,
  });
  const path = createSvgElement("path", {
    d: createPath(points, (point) => point.time, options.valueAccessor, options.maxValue, options.totalRuntime),
  });
  const xLabel = createSvgElement("text", {
    x: VIEWBOX_WIDTH - PADDING,
    y: VIEWBOX_HEIGHT - 8,
    "text-anchor": "end",
  });
  const yLabel = createSvgElement("text", {
    x: PADDING,
    y: 18,
    "text-anchor": "start",
  });

  xAxis.classList.add("analytics-graph__axis");
  yAxis.classList.add("analytics-graph__axis");
  path.classList.add("analytics-graph__line");
  xLabel.classList.add("analytics-graph__label");
  yLabel.classList.add("analytics-graph__label");
  xLabel.textContent = `Time: ${options.totalRuntime}`;
  yLabel.textContent = options.yLabel;

  svg.append(xAxis, yAxis, path, xLabel, yLabel);
  graph.append(heading, svg);
  return graph;
}

export function renderAnalyticsPanel(container, analyticsState) {
  container.classList.add("visualization-box");
  container.querySelector("[data-analytics-root]")?.remove();

  if (!analyticsState.result) {
    if (!container.children.length) {
      container.append(createElement("div", "visualization-empty", "Chart rendering area"));
    }
    return;
  }

  container.querySelectorAll(":scope > .visualization-empty").forEach((element) => element.remove());

  const panel = createElement("div", "analytics-panel");
  panel.dataset.analyticsRoot = "true";
  const title = createElement("div", "table-section-title", "Real-Time Analytics");
  const graphGrid = createElement("div", "analytics-grid");
  const latestPoint = analyticsState.points[analyticsState.points.length - 1] ?? {
    time: 0,
    cpuUtilization: 0,
    completedProcesses: 0,
  };
  const status = createElement(
    "div",
    "analytics-status",
    `TIME ${latestPoint.time} / CPU ${latestPoint.cpuUtilization}% / COMPLETED ${latestPoint.completedProcesses}`,
  );

  graphGrid.append(
    renderGraph("CPU Utilization vs Time", analyticsState.points, {
      totalRuntime: analyticsState.totalRuntime,
      maxValue: 100,
      yLabel: "CPU %",
      valueAccessor: (point) => point.cpuUtilization,
    }),
    renderGraph("Completed Processes vs Time", analyticsState.points, {
      totalRuntime: analyticsState.totalRuntime,
      maxValue: Math.max(analyticsState.totalProcesses, 1),
      yLabel: "Completed",
      valueAccessor: (point) => point.completedProcesses,
    }),
  );

  panel.append(title, graphGrid, status);
  container.append(panel);
}

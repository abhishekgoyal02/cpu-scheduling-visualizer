# CPU Scheduler Visualizer

An interactive CPU Scheduling Algorithm Visualizer with a monochrome, hacker-inspired interface. The application supports process creation, algorithm simulation, Gantt chart visualization, performance metrics, and side-by-side algorithm comparison.

## Key Features

- FCFS scheduling
- SJF scheduling
- SRTF scheduling
- Priority Scheduling
- Round Robin scheduling
- Process management
- Gantt Chart visualization
- Performance metrics
- Algorithm comparison mode
- Interactive simulation controls
- Animated boot sequence

## Supported Algorithms

| Algorithm | Type | Description |
| --- | --- | --- |
| FCFS | Non-preemptive | Executes processes in arrival order. |
| SJF | Non-preemptive | Selects the shortest available burst time. |
| SRTF | Preemptive | Continuously selects the process with the shortest remaining time. |
| Priority Scheduling | Non-preemptive | Executes processes based on priority value. |
| Round Robin | Preemptive | Rotates ready processes using a configurable time quantum. |

## Metrics Calculated

- Completion Time
- Waiting Time
- Turnaround Time
- Response Time
- CPU Utilization
- Throughput

## Technology Stack

- HTML
- CSS
- JavaScript
- Git
- GitHub

## Screenshots

![Loading Screen](screenshots/loading-screen.png)

![Dashboard](screenshots/dashboard.png)

## Usage

Open `index.html` in a browser.

## Project Architecture

```text
Process Input
|
v
Scheduler Engine
|
v
Algorithm Modules
|
v
Visualization Layer
```

The application separates process input, scheduling logic, simulation state, and visualization rendering so each algorithm can reuse the same dashboard components.

## Roadmap

- Real-Time Analytics
- Advanced Simulation Modes

## License

MIT License

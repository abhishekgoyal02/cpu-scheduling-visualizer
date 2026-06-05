# CPU Scheduling Visualizer

Browser-based simulator for FCFS, SJF, SRTF, Priority, and Round Robin scheduling. Built with HTML, CSS, and vanilla JavaScript (ES modules).

## Documentation

Conceptual background and scheduling theory:

**[The Invisible Queue Running Your Computer](https://medium.com/@abhishek-goyal/the-invisible-queue-running-your-computer-4a537cb6cbcb)** — Medium article by Abhishek Goyal

## Quick Start

```bash
git clone https://github.com/abhishekgoyal02/cpu-scheduling-visualizer.git
cd cpu-scheduling-visualizer
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) and use `index.html` as the entry point. A local server is required for ES modules; `file://` is not supported.

## Usage

1. Add processes (unique IDs; lower priority number = higher priority) or generate a random set (3–10 processes).
2. Choose an algorithm; set Round Robin time quantum when prompted.
3. Run the simulation—play, pause, reset, and adjust speed from the control panel.
4. Inspect the Gantt chart, ready queue, per-process results, and averages (waiting, turnaround, response, CPU utilization, throughput).
5. Compare all algorithms on the same process set from the comparison panel.

## License

[MIT](LICENSE) — Copyright (c) 2026 Abhishek Goyal

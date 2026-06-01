function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomProcesses() {
  const processCount = randomInteger(3, 10);

  return Array.from({ length: processCount }, (_, index) => ({
    processId: `P${index + 1}`,
    arrivalTime: randomInteger(0, 10),
    burstTime: randomInteger(1, 20),
    priority: randomInteger(1, 10),
  }));
}

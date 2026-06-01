const INTEGER_PATTERN = /^-?\d+$/;

function parseInteger(value) {
  const rawValue = String(value ?? "").trim();

  if (!INTEGER_PATTERN.test(rawValue)) {
    return null;
  }

  return Number(rawValue);
}

export function validateProcessInput(input, existingProcesses = []) {
  const processId = String(input.processId ?? "").trim();
  const arrivalTime = parseInteger(input.arrivalTime);
  const burstTime = parseInteger(input.burstTime);
  const priority = parseInteger(input.priority);
  const errors = [];

  if (!processId) {
    errors.push("Process ID is required.");
  }

  if (existingProcesses.some((process) => process.id.toLowerCase() === processId.toLowerCase())) {
    errors.push("Process ID must be unique.");
  }

  if (arrivalTime === null) {
    errors.push("Arrival Time must be a valid integer.");
  } else if (arrivalTime < 0) {
    errors.push("Arrival Time cannot be negative.");
  }

  if (burstTime === null) {
    errors.push("Burst Time must be a valid integer.");
  } else if (burstTime <= 0) {
    errors.push("Burst Time must be greater than 0.");
  }

  if (priority === null) {
    errors.push("Priority must be a valid integer.");
  } else if (priority < 1) {
    errors.push("Priority must be 1 or greater.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      processId,
      arrivalTime,
      burstTime,
      priority,
    },
  };
}

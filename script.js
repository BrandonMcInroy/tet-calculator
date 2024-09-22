const timeForm = document.getElementById("timeForm");
const maxDutyHours = 14;
const maxDriveHours = 13;

timeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get elements
  const startOne = normalize(document.getElementById("startOne").value);
  const endOne = normalize(document.getElementById("endOne").value);
  const startTwo = normalize(document.getElementById("startTwo").value);
  const endTwo = normalize(document.getElementById("endTwo").value);

  let startDate = new Date();

  const startTimeOne = new Date(startDate);
  const endTimeOne = new Date(startDate);
  const startTimeTwo = new Date(startDate);
  let endTimeTwo = null;

  if (startOne) {
    startTimeOne.setHours(...startOne.split(":"));
  }
  if (endOne) {
    endTimeOne.setHours(...endOne.split(":"));
  }
  if (startTwo) {
    startTimeTwo.setHours(...startTwo.split(":"));
  }
  if (endTwo) {
    endTimeTwo = new Date(startDate);
    endTimeTwo.setHours(...endTwo.split(":"));
  }

  const startTimeOneFormatted = formatTimeWithoutSeconds(startTimeOne);
  const endTimeOneFormatted = formatTimeWithoutSeconds(endTimeOne);
  const startTimeTwoFormatted = formatTimeWithoutSeconds(startTimeTwo);
  let endTimeTwoFormatted;

  if (endTimeTwo) {
    endTimeTwoFormatted = formatTimeWithoutSeconds(endTimeTwo);
  } else {
    endTimeTwoFormatted = "null";
  }

  // Assume durationOne and durationTwo are defined earlier
  let durationOne = endTimeOne - startTimeOne;
  let durationTwo = endTimeTwo - startTimeTwo;

  // Initialize variables
  let totalDuration = 0;
  let totalDurationFormatted = null;
  let durationOneFormatted = null;
  let durationTwoFormatted = null;

  // Check if durationOne is valid
  if (durationOne != null && durationOne >= 0) {
    durationOneFormatted = formatDuration(durationOne);
    totalDuration += durationOne; // Add durationOne to total
  }

  // Check if durationTwo is valid
  if (durationTwo != null && durationTwo >= 0) {
    durationTwoFormatted = formatDuration(durationTwo);
    totalDuration += durationTwo; // Add durationTwo to total
  }

  // Now check if totalDuration is valid before formatting
  if (totalDuration > 0) {
    totalDurationFormatted = formatDuration(totalDuration);
  }

  const earliestStartTime = findEarliestStartTime(
    endTimeOne,
    endTimeTwo,
    maxDutyHours
  );
  const latestFinishTime = findLatestFinishTime(startTimeOne);
  console.log(earliestStartTime);

  const earliestStartTimeFormatted =
    formatTimeWithoutSeconds(earliestStartTime);
  const latestFinishTimeFormatted = formatTimeWithoutSeconds(latestFinishTime);

  document.getElementById(
    "shiftOne"
  ).textContent = `First piece details: ${startTimeOneFormatted} - ${endTimeOneFormatted}, Duration: ${formatDecimalHoursToHHMM(
    durationOneFormatted
  )}`;

  if (startTwo.trim() && endTwo.trim()) {
    document.getElementById(
      "shiftTwo"
    ).textContent = `Second piece details: ${startTimeTwoFormatted} - ${endTimeTwoFormatted}, Duration: ${formatDecimalHoursToHHMM(
      durationTwoFormatted
    )}`;
  } else {
    document.getElementById(
      "shiftTwo"
    ).textContent = `Second piece details: N/A`;
  }

  document.getElementById(
    "totalTime"
  ).textContent = `Total shift time: ${formatDecimalHoursToHHMM(
    totalDurationFormatted
  )}`;

  const remainingDriveHours = maxDriveHours - totalDurationFormatted;
  document.getElementById(
    "allowOt"
  ).textContent = `Hours available for OT: ${formatDecimalHoursToHHMM(
    remainingDriveHours
  )}`;
  document.getElementById(
    "earliestStart"
  ).textContent = `Earliest start time: ${earliestStartTimeFormatted}`;
  document.getElementById(
    "latestFinish"
  ).textContent = `Latest finish time: ${latestFinishTimeFormatted}`;
});

function normalize(inputTime) {
  if (!inputTime) {
    return "";
  }
  const cleanedTime = inputTime.replace(":", "");

  if (cleanedTime.length < 4) {
    return cleanedTime.padStart(4, "0");
  }
  return `${cleanedTime.slice(0, 2)}:${cleanedTime.slice(2)}`;
}

function formatDuration(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const remainingMilliseconds = milliseconds % 3600000;
  const minutes = Math.floor(remainingMilliseconds / 60000);
  const decimalHours = minutes / 60;

  return hours + decimalHours;
}

function formatTimeWithoutSeconds(date) {
  const timeString = date.toLocaleTimeString();
  const formattedTime = timeString.replace(/:\d{2} /, "");
  return formattedTime;
}
function formatDecimalHoursToHHMM(decimalHours) {
  const wholeHours = Math.floor(decimalHours);
  const decimalMinutes = (decimalHours - wholeHours) * 60;
  const formattedMinutes = Math.round(decimalMinutes);

  const minutesString = formattedMinutes.toString().padStart(2, "0");
  return `${wholeHours}:${minutesString}`;
}

function findEndOfShift(endOne, endTwo) {
  // Check if endOne is a valid Date
  if (!(endOne instanceof Date) || isNaN(endOne.getTime())) {
    throw new Error("Invalid end of shift time for endOne");
  }

  // If endTwo is not provided (null or empty), return endOne
  if (!endTwo) {
    return endOne;
  }

  // Check if endTwo is a valid Date
  if (!(endTwo instanceof Date) || isNaN(endTwo.getTime())) {
    throw new Error("Invalid end of shift time for endTwo");
  }

  // Return the later of the two times
  return endOne > endTwo ? endOne : endTwo;
}

// Function to find the earliest start time based on the end times
function findEarliestStartTime(endOne, endTwo, maxDutyHours) {
  const endOfShift = findEndOfShift(endOne, endTwo);
  const earliestStartTime = endOfShift;
  earliestStartTime.setHours(earliestStartTime.getHours() - maxDutyHours);

  if (isNaN(earliestStartTime.getTime())) {
    throw new Error("Calculation resulted in invalid date");
  }
  return earliestStartTime;
}

// Function to find the latest finish time based on the start times
function findLatestFinishTime(startTimeOne) {
  const startOfShift = startTimeOne;
  const latestFinishTime = startOfShift;
  latestFinishTime.setHours(latestFinishTime.getHours() + maxDutyHours);
  return latestFinishTime;
}

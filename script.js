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

  const durationOne = endTimeOne - startTimeOne;
  let durationTwo;

  if (endTimeTwoFormatted) {
    durationTwo = endTimeTwo - startTimeTwo;
  } else {
    durationTwo = 0;
  }

  const totalDuration = durationOne + durationTwo;
  const totalDurationFormatted = formatDuration(totalDuration);
  const durationOneFormatted = formatDuration(durationOne);
  const durationTwoFormatted = formatDuration(durationTwo);

  console.log(endTimeOne);
  console.log(endTimeTwo);
  console.log(maxDutyHours);

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

  console.log(findEndOfShift(endOne));

  console.log(earliestStartTimeFormatted);
  console.log(latestFinishTimeFormatted);
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
// function normalize(inputTime) {
//   if (!inputTime) {
//     return "";
//   }
//   let cleanedTime = inputTime.replace(":", "");
//   //Handle values greater than 2359
//   if (cleanedTime.length === 4) {
//     cleanedTime = (parseInt(cleanedTime) - 2400).toString().padStart(4, "0");
//   }

//   if (cleanedTime.length < 4) {
//     return cleanedTime.padStart(4, "0");
//   }
//   return `${cleanedTime.slice(0, 2)}:${cleanedTime.slice(2)}`;
// }
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
  let endOfShift; // Declare endOfShift variable

  if (endTwo === null) {
    endOfShift = endOne;
  } else {
    endOfShift = endTwo;
  }
  if (!(endOfShift instanceof Date) || isNaN(endOfShift.getTime())) {
    throw new Error("Invalid end of shift time");
  }
  return endOfShift;
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

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

  const startDate = new Date();

  const startTimeOne = new Date(startDate);
  const endTimeOne = new Date(startDate);
  const startTimeTwo = new Date(startDate);
  const endTimeTwo = new Date(startDate);

  startTimeOne.setHours(...startOne.split(":"));
  endTimeOne.setHours(...endOne.split(":"));
  startTimeTwo.setHours(...startTwo.split(":"));
  endTimeTwo.setHours(...endTwo.split(":"));

  const startTimeOneFormatted = formatTimeWithoutSeconds(startTimeOne);
  const endTimeOneFormatted = formatTimeWithoutSeconds(endTimeOne);
  const startTimeTwoFormatted = formatTimeWithoutSeconds(startTimeTwo);
  const endTimeTwoFormatted = formatTimeWithoutSeconds(endTimeTwo);

  const durationOne = endTimeOne - startTimeOne;
  const durationTwo = endTimeTwo - startTimeTwo;

  const totalDuration = durationOne + durationTwo;
  const totalDurationFormatted = formatDuration(totalDuration);
  const durationOneFormatted = formatDuration(durationOne);
  const durationTwoFormatted = formatDuration(durationTwo);

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
  // const earliestStartTime = maxDutyHours - totalDurationFormatted;
  // document.getElementById(
  //   "earliestStart"
  // ).textContent = `Earliest start time: ${earliestStartTime}`;

  const earliestStartTime = getEarliestStartTime(
    startTimeOne,
    endTimeOne,
    endTimeTwo
  );
  console.log(`Earliest start time: ${earliestStartTime}`);

  // Example usage
  // const startTime = "09:00"; // 9 AM
  const latestWorkTime = calculateLatestWorkTime(startTimeOne);
  console.log("Latest possible work time:", latestWorkTime);
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
function getEarliestStartTime(earlyStartTimeOne, endTimeOne, endTimeTwo) {
  const totalDuration = endTimeTwo - earlyStartTimeOne;
  const maxWorkHours = 14 * 60 * 60 * 1000;

  const remainingTime = maxWorkHours - totalDuration;
  const earlierEndTime = Math.min(endTimeOne, endTimeTwo);

  // Calculate the earliest start time by subtracting the remaining time from the earlier end time
  const earliestStartTime = new Date(earlierEndTime - remainingTime);

  // Ensure the earliest start time is within the maximum shift time (14 hours) from the start of the first shift
  const maxShiftTime = earlyStartTimeOne + 14 * 60 * 60 * 1000;
  if (earliestStartTime < earlyStartTimeOne) {
    earliestStartTime = earlyStartTimeOne;
  } else if (earliestStartTime > maxShiftTime) {
    earliestStartTime = maxShiftTime;
  }

  const formattedStartTime = `${earliestStartTime.getHours()}:${earliestStartTime
    .getMinutes()
    .toString()
    .padStart(2, 0)}`;

  return formattedStartTime;
}
function calculateLatestWorkTime(startDate) {
  // Calculate end time based on maximum duty time
  const dutyEndTime = new Date(startDate);
  dutyEndTime.setHours(dutyEndTime.getHours() + 13);
  if (dutyEndTime.getHours() > 23) {
    dutyEndTime.setDate(dutyEndTime.getDate() + 1);
    dutyEndTime.setHours(dutyEndTime.getHours() - 24);
  }

  // Calculate end time based on maximum shift time
  const shiftEndTime = new Date(startDate);
  shiftEndTime.setHours(shiftEndTime.getHours() + 14);
  if (shiftEndTime.getHours() > 23) {
    shiftEndTime.setDate(shiftEndTime.getDate() + 1);
    shiftEndTime.setHours(shiftEndTime.getHours() - 24);
  }

  // Determine the latest possible work time
  const latestEndTime = dutyEndTime < shiftEndTime ? dutyEndTime : shiftEndTime;

  // Format the result
  const formattedEndTime = latestEndTime.toLocaleTimeString([], {
    hour12: true,
    hourCycle: "h12",
  });

  return formattedEndTime;
}

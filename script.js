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

  if (endTwo === "") {
    endOfShift = endOne;
  } else {
    endOfShift = endTwo;
  }
  return endOfShift;
}
console.log(findEndOfShift("12:00", ""));

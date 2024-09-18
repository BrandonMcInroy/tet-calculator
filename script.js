const timeForm = document.getElementById("timeForm");

timeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get elements
  const startOne = normalize(document.getElementById("startOne").value);
  const endOne = normalize(document.getElementById("endOne").value);
  const startTwo = normalize(document.getElementById("startTwo").value);
  const endTwo = normalize(document.getElementById("endTwo").value);

  const startDate = new Date();
  const formattedTime = formatTimeWithoutSeconds(startDate);

  const startTimeOne = new Date(startDate);
  const endTimeOne = new Date(startDate);
  const startTimeTwo = new Date(startDate);
  const endTimeTwo = new Date(startDate);

  startTimeOne.setHours(...startOne.split(":"));
  endTimeOne.setHours(...endOne.split(":"));
  startTimeTwo.setHours(...startTwo.split(":"));
  endTimeTwo.setHours(...endTwo.split(":"));

  const durationOne = endTimeOne - startTimeOne;
  const durationTwo = endTimeTwo - startTimeTwo;

  const totalDuration = durationOne + durationTwo;

  document.getElementById(
    "shiftOne"
  ).textContent = `Shift One: ${`startTimeOne: ${formattedTime}`} - ${endTimeOne.toLocaleTimeString()}`;
  document.getElementById(
    "shiftTwo"
  ).textContent = `Shift Two: ${startTimeTwo.toLocaleTimeString()} - ${endTimeTwo.toLocaleTimeString()}`;
  document.getElementById(
    "totalTime"
  ).textContent = `Total Time: ${formatDuration(totalDuration)}`;

  console.log("Submitted");
});

function normalize(inputTime) {
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

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function formatTimeWithoutSeconds(date) {
  const timeString = date.toLocaleTimeString();
  const formattedTime = timeString.replace(/:\d{2} (AM|PM)/, "");
  return formattedTime;
}

const timeForm = document.getElementById("timeForm");

timeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get elements
  const startOne = document.getElementById("startOne").value;
  const endOne = document.getElementById("endOne").value;
  const startTwo = document.getElementById("startTwo").value;
  const endTwo = document.getElementById("endTwo").value;

  const startDate = new Date();

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
  ).textContent = `Shift One: ${startTimeOne.toLocaleTimeString()} - ${endTimeOne.toLocaleTimeString()}`;
  document.getElementById(
    "shiftTwo"
  ).textContent = `Shift Two: ${startTimeTwo.toLocaleTimeString()} - ${endTimeTwo.toLocaleTimeString()}`;
  document.getElementById(
    "totalTime"
  ).textContent = `Total Time: ${totalDuration}`;

  console.log(startOne);
  console.log(endOne);
  console.log(startTwo);
  console.log(endTwo);
  console.log("Submitted");
});

function normalize(inputTime) {
  const cleanedTime = inputTime.replace(":", "");

  if (cleanedTime.length < 4) {
    return cleanedTime.padStart(4, "0");
  }
  return `${cleanedTime.slice(0, 2)}:${cleanedTime.slice(2)}`;
}

const inputTime1 = "0500";
const inputTime2 = "1000";

const startTime1 = normalize(inputTime1);
const endTime1 = normalize(inputTime2);

console.log(startTime1);
console.log(endTime1);

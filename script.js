const timeForm = document.getElementById("timeForm");

timeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get elements
  let startOne = document.getElementById("startOne").value;
  let endOne = document.getElementById("endOne").value;
  let startTwo = document.getElementById("startTwo").value;
  let endTwo = document.getElementById("endTwo").value;

  const startOneTime = startOne.split(":");
  const endOneTime = endOne.split(":");
  const startTwoTime = startTwo.split(":");
  const endTwoTime = endTwo.split(":");

  // Convert to milliseconds
  startOneTime[0] = startOneTime[0] * 60 * 1000;
  startOneTime[1] = startOneTime[1] * 1000;
  endOneTime[0] = endOneTime[0] * 60 * 1000;
  endOneTime[1] = endOneTime[1] * 1000;
  startTwoTime[0] = startTwoTime[0] * 60 * 1000;
  startTwoTime[1] = startTwoTime[1] * 1000;
  endTwoTime[0] = endTwoTime[0] * 60 * 1000;
  endTwoTime[1] = endTwoTime[1] * 1000;

  const totalTime = endOneTime - startOneTime + endTwoTime - startTwoTime;

  document.getElementById(
    "shiftOne"
  ).innerHTML = `Shift One: ${startOneTime.toLocaleTimeString()} - ${endOneTime.toLocaleTimeString()}`;
  document.getElementById(
    "shiftTwo"
  ).innerHTML = `Shift Two: ${startTwoTime.toLocaleTimeString()} - ${endTwoTime.toLocaleTimeString()}`;
  document.getElementById(
    "totalTime"
  ).innerHTML = `Total Time: ${totalTime.toLocaleTimeString()}`;
  console.log(startOne);
  console.log(endOne);
  console.log(startTwo);
  console.log(endTwo);
  console.log("Submitted");
});

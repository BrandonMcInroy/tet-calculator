let timeForm = document.getElementById("timeForm");

timeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get elements
  let startOne = document.getElementById("startOne").value;
  let endOne = document.getElementById("endOne").value;
  let startTwo = document.getElementById("startTwo").value;
  let endTwo = document.getElementById("endTwo").value;
  console.log(startOne);
  console.log(endOne);
  console.log(startTwo);
  console.log(endTwo);
  console.log("Submitted");
});

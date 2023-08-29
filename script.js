////////////////////
// Main Structure //
////////////////////
const newList = [];
const workingList = [];
const finishList = [];
const lists = {
  listNew: newList,
  listWorking: workingList,
  listFinish: finishList,
};
console.log(lists);
/////////////
// RELAXER //
/////////////

const relaxer = document.querySelector(".relaxer");
const showRelaxer = document.querySelector(".showRelaxer");

relaxer.addEventListener("click", () => {
  showRelaxer.style.display = "flex";

  const container = document.getElementById("container");
  const text = document.getElementById("relaxertext");
  const totalTime = 7500;
  const breatheTime = (totalTime / 5) * 2;
  const holdTime = totalTime / 5;

  breathAnimation();

  function breathAnimation() {
    text.innerText = "Breathe In!";
    container.className = "relaxerContainer congrow";

    setTimeout(() => {
      text.innerText = "Hold";

      setTimeout(() => {
        text.innerText = "Breathe Out!";
        container.className = "relaxerContainer conshrink";
      }, holdTime);
    }, breatheTime);
  }
  intervalId = setInterval(breathAnimation, totalTime);

  const closeRelaxer = document.querySelector(".relaxerContainer");
  closeRelaxer.addEventListener("click", () => {
    showRelaxer.style.display = "none";
    clearInterval(intervalId);
    text.innerText = "";
  });
});

//   e.preventDefault();
//   fetch("https://qurancentral.com/mishary-rashid-alafasy-001-al-fatiha/").then(
//     (res) => {
//       console.log("fetch succed");
//       console.log(res);
//       console.log(res.json());
//       console.log(res.json(result).parse());
//       // res.json();
//     }
//   );
// });

///////////////
// ADD Tasks //
///////////////
const btnNew = document.getElementById("btn-new");
const btnWorking = document.getElementById("btn-working");
const btnComplete = document.getElementById("btn-Complete");
const main = document.querySelector("main");

const addTask = (id, value) => {
  const newTaskElement = document.createElement("li");
  newTaskElement.className = "newTask flex";
  newTaskElement.setAttribute("data-id", `${id}`);
  newTaskElement.setAttribute("draggable", true);
  newTaskElement.setAttribute("contenteditable", true);
  newTaskElement.innerHTML = `<p class="taskInput">${value}</p>
<div class="iconsCon">
<ion-icon
name="close-circle-outline"
class="icon deleteIcn"
></ion-icon>
<ion-icon
name="mic-circle-outline"
class="icon recordIcn"
></ion-icon>
</div>`;
  return newTaskElement;
};

main.addEventListener("click", function (event) {
  ///////////////
  // ADD Tasks //
  ///////////////
  if (event.target.classList.contains("btn-addTask")) {
    event.preventDefault();
    const currentList = event.target.previousElementSibling;
    const listType = currentList.classList[1];

    const id = (Math.random() * 201).toFixed(5);

    // Adding to objects Array for Local Storage
    const newTask = {
      id: id,
      value: "New Task",
    };
    currentList.appendChild(addTask(newTask.id, newTask.value));
    if (listType in lists) {
      lists[listType].push(newTask);
    }
  }

  /////////////////////////
  // Remove / Edit Tasks //
  /////////////////////////
  if (event.target.classList.contains("deleteIcn")) {
    return;
  }
});

/////////////////
// Time & Date //
/////////////////
function updateDateAndTime() {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const year = currentTime.getFullYear();
  const month = currentTime.getMonth() + 1; // mounths index starting from 0 so we have to add 1
  const day = currentTime.getDate();

  // fixing one digit numbers/Dates
  const fixingTD = (digits) => (digits > 10 ? digits : `0${digits}`);

  // Time Formating
  const formattedTime = `${fixingTD(hours)}:${fixingTD(minutes)}:${fixingTD(
    seconds
  )}`;

  // Date Formating
  const formattedDate = `${fixingTD(day)}/${fixingTD(month)}/${year}`;

  document.getElementById("current-time").textContent = formattedTime;
  document.getElementById("current-date").textContent = formattedDate;
}

// Show for the First Time
updateDateAndTime();
// Updating Every Second
setInterval(updateDateAndTime, 1000);

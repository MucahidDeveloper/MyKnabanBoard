////////////////////
// Main Structure //
////////////////////
const listNew = [];
const listWorking = [];
const listFinish = [];
const lists = {
  listNew: listNew,
  listWorking: listWorking,
  listFinish: listFinish,
};

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
  if (value === "") {
    value = "Empty Task";
  }
  const newTaskElement = document.createElement("li");
  newTaskElement.className = "newTask flex";
  newTaskElement.setAttribute("data-id", `${id}`);
  newTaskElement.setAttribute("draggable", true);
  // newTaskElement.setAttribute("contenteditable", true);
  newTaskElement.innerHTML = `<p class="taskInput" contenteditable="true">${value}</p>
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

main.addEventListener("click", function (e) {
  const clickON = e.target;

  //////////////
  // ADD Task //
  //////////////
  const currentList = clickON.closest(".listcontainer").querySelector("ul");
  const listType = currentList.classList[1];
  // console.log(currentList, listType); // PROBLEM HERE WHEN CLICK ON EMPTY

  if (clickON.classList.contains("btn-addTask")) {
    e.preventDefault();
    const id = (Math.random() * 201).toFixed(5);
    const newTask = {
      id: id,
      value: "New Task",
    };

    // Adding to objects Array for Local Storage
    currentList.appendChild(addTask(newTask.id, newTask.value));
    if (listType in lists) {
      lists[listType].push(newTask);
      localStorage.setItem(`${listType}`, JSON.stringify(lists[listType]));
      console.log("New Item Added to local list");
    }
  }

  /////////////////
  // Delete Task //
  /////////////////
  if (clickON.classList.contains("deleteIcn")) {
    const clickedTask = clickON.closest(".newTask");
    const cardId = clickedTask.dataset.id;
    const cardValue = clickedTask.querySelector(".taskInput").innerHTML;

    const storedCardsArray = localStorage.getItem(`${listType}`);
    const cards = JSON.parse(storedCardsArray);
    const Updatedcards = cards.filter((card) => card.id !== cardId);
    if (Updatedcards.length === 0) {
      localStorage.removeItem(`${listType}`);
      lists[listType] = [];
    }
    localStorage.setItem(`${listType}`, JSON.stringify(Updatedcards));

    clickedTask.remove();
    console.log(
      `Task with id ${cardId} and content of: " ${cardValue} " have been removed successfully`
    );
  }

  //////////////////////////
  // Edit Tasks By Typing //
  //////////////////////////
  if (clickON.classList.contains("taskInput")) {
    const clickedTask = clickON.closest(".newTask");
    const cardId = clickedTask.dataset.id;

    clickedTask.addEventListener("input", function (event) {
      const updatedText = event.target.textContent.trim();

      const storedCardsArray = localStorage.getItem(`${listType}`);
      const cards = JSON.parse(storedCardsArray);
      const Updatedcards = cards.map((card) => {
        if (card.id === cardId) {
          card.value = updatedText;
        }
        return card;
      });
      localStorage.setItem(`${listType}`, JSON.stringify(Updatedcards));

      console.log(`Task with id ${cardId} have been edaited successfully`);
    });
  }

  //////////////////////////
  // Edit Tasks By Record // to examine when render the app
  //////////////////////////
  if (clickON.classList.contains("recordIcn")) {
    console.log("Record");
    const clickedTask = clickON.closest(".newTask");
    const cardId = clickedTask.dataset.id;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = function (event) {
      const recordedText = event.results[0][0].transcript;
      cardContentElement.textContent = recordedText;

      // Update local storage
      const storedCardsArray = localStorage.getItem(`${listType}`);
      const cards = JSON.parse(storedCardsArray);
      const updatedCards = cards.map((card) => {
        if (card.id === cardId) {
          card.value = recordedText;
        }
        return card;
      });
      localStorage.setItem(`${listType}`, JSON.stringify(updatedCards));

      console.log(`تم تحديث محتوى البطاقة بنص صوتي: ${recordedText}`);
    };
    recognition.onspeechend = function () {
      recognition.abort();
    };
    recognition.start();
  }
});

///////////////////
// Local Storage //
///////////////////
const storedArray = (list) => {
  const currentList = document.querySelector(`.${list}`);

  const storedCardsArray = localStorage.getItem(list);
  if (storedCardsArray) {
    const parsedCardsArray = JSON.parse(storedCardsArray);
    parsedCardsArray.forEach((card) => {
      let id = card.id;
      let value = card.value;
      currentList.appendChild(addTask(id, value));
      const newTask = {
        id: id,
        value: value,
      };
      lists[list].push(newTask);
    });
  }
};

for (const list in lists) {
  storedArray(list);
  console.log(
    `${list} elements have parsed successfully from your Local Storage`
  );
}

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

/////////////////

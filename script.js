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

//////////////////
// Quran Player //
//////////////////
const playBtn = document.querySelector(".play");
const pauseBtn = document.querySelector(".pause");
const prevBtn = document.querySelector(".backward");
const nextBtn = document.querySelector(".forward");
const selectSurah = document.getElementById("surah-selector");
const audio = document.getElementById("audio");
let surahNumber = localStorage.getItem("surahNumber") || 112;
selectSurah.selectedIndex = surahNumber - 1;
let isPlaying;

function playPause() {
  if (!isPlaying) {
    playBtn.classList.remove("hide");
    pauseBtn.classList.add("hide");
  } else {
    playBtn.classList.add("hide");
    pauseBtn.classList.remove("hide");
  }
}

selectSurah.addEventListener("change", function () {
  surahNumber = this.value;
  playQuran(surahNumber);
  localStorage.setItem("surahNumber", surahNumber);
});

function nextSurah() {
  isPlaying = true;
  playPause();
  surahNumber < 114 ? (surahNumber = +surahNumber + 1) : (surahNumber = 112);
  selectSurah.selectedIndex = surahNumber - 1;
  localStorage.setItem("surahNumber", surahNumber);
  playQuran(surahNumber);
}

async function playQuran(surahNum) {
  isPlaying = true;
  const response = await fetch(
    `https://api.alquran.cloud/v1/surah/${surahNum}/ar.alafasy`
  );
  const surah = await response.json();
  const ayahs = surah.data.ayahs;
  playPause();

  for (const ayah of ayahs) {
    audio.src = ayah.audio;
    audio.controls = true;
    await audio.play();
    await new Promise((resolve) => {
      audio.addEventListener("ended", resolve);
    });
  }
  isPlaying = false;
  playPause();
  nextSurah();
}

prevBtn.addEventListener("click", function () {
  playPause();
  surahNumber -= 1;
  selectSurah.selectedIndex = surahNumber - 1;
  localStorage.setItem("surahNumber", surahNumber);
  playQuran(surahNumber);
});

nextBtn.addEventListener("click", nextSurah);

playBtn.addEventListener("click", function () {
  playQuran(surahNumber);
});

pauseBtn.addEventListener("click", function () {
  audio.pause();
  isPlaying = false;
  playPause();
});

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
  // if (clickON.classList.contains("recordIcn")) {
  //   console.log("Record");
  //   const clickedTask = clickON.closest(".newTask");
  //   const cardId = clickedTask.dataset.id;
  //   const cardValue = clickedTask.querySelector(".taskInput");
  //   const recordIcn = clickedTask.querySelector(".recordIcn");

  //   window.SpeechRecognition =
  //     window.SpeechRecognition || window.webkitSpeechRecognition;
  //   let recognition = new window.SpeechRecognition();
  //   recognition.start();
  //   console.log("بداية");
  //   recognition.lang = "en-US";
  //   console.log("تحديد اللغة");
  //   recognition.continuous = true;
  //   console.log("استماع مستمر");
  //   // Capture user speak
  // function onSpeak(e) {
  //   console.log(msg);
  //   const msg = e.results[0][0].transcript;
  //   writeMessage(msg);
  //   // checkNumber(msg);
  // }

  // // Write what user speaks
  // function writeMessage(msg) {
  //   cardValue.textContent = msg;
  // }
  //   // recognition.addEventListener("result", onSpeak);
  //   recognition.addEventListener("end", start);
  //   function start() {
  //     console.log("Finish Recording");
  //     recognition.start();
  //   }

  //   recognition.onresult = function (event) {
  //     const recordedText = event.results[0][0].transcript;
  //     cardValue.textContent = recordedText;
  //     console.log(recordedText);

  //     // Update local storage
  //     const storedCardsArray = localStorage.getItem(`${listType}`);
  //     const cards = JSON.parse(storedCardsArray);
  //     const updatedCards = cards.map((card) => {
  //       if (card.id === cardId) {
  //         card.value = recordedText;
  //       }
  //       return card;
  //     });
  //     localStorage.setItem(`${listType}`, JSON.stringify(updatedCards));

  //     console.log(`تم تحديث محتوى البطاقة بنص صوتي: ${recordedText}`);
  //   };
  //   recognition.onspeechend = function () {
  //     recognition.abort();
  //   };
  // }
  // recordIcn.addEventListener("click", function () {
  //   {
  //     recognition.removeEventListener("end", start);
  //   }
  // });
});

/////////////////
// Drag & Drop //
/////////////////
let draggedTask;
let currentList;
let cardId;
let cardValue;

main.addEventListener("dragstart", function (e) {
  draggedTask = e.target.closest("li");
  currentList = draggedTask.closest("ul").classList[1];
  cardId = draggedTask.dataset.id;
  cardValue = draggedTask.querySelector("p").textContent;
  draggedTask.classList.add("filmy");
});

main.addEventListener("dragend", function (e) {
  const draggedTask = e.target.closest("li");
  draggedTask.classList.remove("filmy");
  draggedTask.closest(".listcontainer").classList.remove("overLi");
});

const listsC = document.querySelectorAll(".listcontainer");
listsC.forEach((list) => {
  list.addEventListener("dragover", function (e) {
    e.preventDefault();
    list.classList.add("overLi");
    newList = list;
  });

  list.addEventListener("dragleave", function () {
    list.classList.remove("overLi");
  });

  list.addEventListener("drop", function () {
    list.classList.remove("overLi");
    list.querySelector(".list").append(draggedTask);
    const listType = list.querySelector(".list").classList[1];

    if (currentList !== listType) {
      // Update The New List
      if (listType in lists) {
        const transportedTask = {
          id: cardId,
          value: cardValue,
        };
        lists[listType].push(transportedTask);
        localStorage.setItem(`${listType}`, JSON.stringify(lists[listType]));

        // Remove Task From The Old List
        const storedCardsArray = localStorage.getItem(`${currentList}`);
        const cards = JSON.parse(storedCardsArray);
        const Updatedcards = cards.filter((card) => card.id !== cardId);
        if (Updatedcards.length === 0) {
          localStorage.removeItem(`${currentList}`);
          lists[currentList] = [];
        }
        localStorage.setItem(`${currentList}`, JSON.stringify(Updatedcards));
        lists[currentList] = Updatedcards;
        console.log(
          `The Task: "${cardValue}" moved from ${currentList} to ${listType} Successfully`
        );
      }
    }
  });
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
  const fixingTD = (digits) => (digits >= 10 ? digits : `0${digits}`);

  // Time Formating
  const formattedTime = `${fixingTD(hours)} : ${fixingTD(minutes)} : ${fixingTD(
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

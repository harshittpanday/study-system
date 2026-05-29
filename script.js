/* =========================
        STUDY SYSTEM V1
========================= */

/* ================= STORAGE ================= */

let savedTasks =
  JSON.parse(localStorage.getItem("tasks")) || [];

let savedNotes =
  JSON.parse(localStorage.getItem("notes")) || [];

let dailyGoal =
  Number(localStorage.getItem("dailyGoal")) || 0;

let streak =
  Number(localStorage.getItem("streak")) || 0;

/* ================= TIMER ================= */

let timerRunning = false;

let interval;

let time = 0;

/* ================= TASK SYSTEM ================= */

function addTask() {

  let input =
    document.getElementById("taskInput");

  let text =
    input.value.trim();

  if (text === "") return;

  let task = {
    text: text,
    completed: false
  };

  savedTasks.push(task);

  localStorage.setItem(
    "tasks",
    JSON.stringify(savedTasks)
  );

  createTask(task.text, task.completed);

  input.value = "";

  updateProgress();
}

function createTask(taskText, completed) {

  let list =
    document.getElementById("taskList");

  let li =
    document.createElement("li");

  /* CHECKBOX */

  let checkbox =
    document.createElement("input");

  checkbox.type = "checkbox";

  checkbox.checked = completed;

  checkbox.onchange = function () {

    updateStorage();

    updateProgress();
  };

  /* TASK TEXT */

  let span =
    document.createElement("span");

  span.innerText = taskText;

  /* EDIT BUTTON */

  let editBtn =
    document.createElement("button");

  editBtn.innerHTML = "✏️";

  editBtn.onclick = function () {

    let newText =
      prompt("Edit task:", span.innerText);

    if (!newText || !newText.trim()) return;

    span.innerText = newText;

    updateStorage();
  };

  /* DELETE BUTTON */

  let deleteBtn =
    document.createElement("button");

  deleteBtn.innerHTML = "🗑️";

  deleteBtn.onclick = function () {

    li.remove();

    updateStorage();

    updateProgress();
  };

  /* APPEND */

  li.appendChild(checkbox);

  li.appendChild(span);

  li.appendChild(editBtn);

  li.appendChild(deleteBtn);

  list.appendChild(li);
}

function updateStorage() {

  let tasks = [];

  document.querySelectorAll("#taskList li")
    .forEach(li => {

      let text =
        li.querySelector("span").innerText;

      let completed =
        li.querySelector("input").checked;

      tasks.push({
        text,
        completed
      });

    });

  savedTasks = tasks;

  localStorage.setItem(
    "tasks",
    JSON.stringify(savedTasks)
  );
}

function updateProgress() {

  let total =
    document.querySelectorAll("#taskList li")
    .length;

  let done =
    document.querySelectorAll(
      '#taskList input[type="checkbox"]:checked'
    ).length;

  let percent =
    total === 0
      ? 0
      : (done / total) * 100;

  document.getElementById("progressBar")
    .style.width =
    percent + "%";

  document.getElementById("progressText")
    .innerText =
    `${done} / ${total} Tasks Completed`;

  updateAnalytics();

  updateStreak(done);
}

function clearTasks() {

  document.getElementById("taskList")
    .innerHTML = "";

  savedTasks = [];

  localStorage.removeItem("tasks");

  updateProgress();

  updateAnalytics();
}

/* ================= STREAK ================= */

function updateStreak(done) {

  let today =
    new Date().toLocaleDateString();

  let lastCompleted =
    localStorage.getItem("lastCompletedDate");

  if (
    done >= dailyGoal &&
    dailyGoal > 0 &&
    lastCompleted !== today
  ) {

    streak++;

    localStorage.setItem(
      "streak",
      streak
    );

    localStorage.setItem(
      "lastCompletedDate",
      today
    );
  }

  document.getElementById("streakText")
    .innerText =
    `🔥 Streak: ${streak} day(s)`;
}

/* ================= GOAL ================= */

function setGoal() {

  let input =
    document.getElementById("goalInput");

  let goal =
    Number(input.value);

  if (goal <= 0) return;

  dailyGoal = goal;

  localStorage.setItem(
    "dailyGoal",
    goal
  );

  document.getElementById("goalText")
    .innerText =
    `Daily Goal: ${goal} Tasks`;

  input.value = "";
}

/* ================= TIMER ================= */

function startTimer() {

  if (timerRunning) return;

  let minutes =
    document.getElementById("minutesInput")
    .value;

  if (time === 0) {

    if (minutes <= 0) return;

    time = minutes * 60;
  }

  timerRunning = true;

  interval = setInterval(function () {

    let min =
      Math.floor(time / 60);

    let sec =
      time % 60;

    document.getElementById("timer")
      .innerText =
      `${min}:${sec < 10 ? "0" : ""}${sec}`;

    time--;

    if (time < 0) {

      clearInterval(interval);

      timerRunning = false;

      alert("Time Finished!");
    }

  }, 1000);
}

function stopTimer() {

  clearInterval(interval);

  timerRunning = false;
}

function resetTimer() {

  clearInterval(interval);

  timerRunning = false;

  time = 0;

  document.getElementById("timer")
    .innerText = "00:00";
}

/* ================= TOPICS ================= */

function addSubjectTask() {

  let input =
    document.getElementById("subjectInput");

  let text =
    input.value.trim();

  if (text === "") return;

  let li =
    document.createElement("li");

  li.innerText = text;

  let btn =
    document.createElement("button");

  btn.innerHTML = "🗑️";

  btn.onclick = function () {

    li.remove();
  };

  li.appendChild(btn);

  document.getElementById("subjectList")
    .appendChild(li);

  input.value = "";
}

/* ================= NOTES ================= */

function addNote() {

  let input =
    document.getElementById("noteInput");

  let text =
    input.value.trim();

  if (text === "") return;

  let note = {
    id: Date.now(),
    text: text
  };

  savedNotes.push(note);

  localStorage.setItem(
    "notes",
    JSON.stringify(savedNotes)
  );

  createNote(note.text, note.id);

  input.value = "";

  updateAnalytics();
}

function createNote(text, id) {

  let list =
    document.getElementById("noteList");

  let li =
    document.createElement("li");

  let span =
    document.createElement("span");

  span.innerText = text;

  /* EDIT */

  let editBtn =
    document.createElement("button");

  editBtn.innerHTML = "✏️";

  editBtn.onclick = function () {

    let newText =
      prompt("Edit note:", span.innerText);

    if (!newText || !newText.trim()) return;

    span.innerText = newText;

    savedNotes = savedNotes.map(note => {

      if (note.id === id) {

        return {
          ...note,
          text: newText
        };
      }

      return note;
    });

    localStorage.setItem(
      "notes",
      JSON.stringify(savedNotes)
    );

    updateAnalytics();
  };

  /* DELETE */

  let deleteBtn =
    document.createElement("button");

  deleteBtn.innerHTML = "🗑️";

  deleteBtn.onclick = function () {

    li.remove();

    savedNotes =
      savedNotes.filter(note =>
        note.id !== id
      );

    localStorage.setItem(
      "notes",
      JSON.stringify(savedNotes)
    );

    updateAnalytics();
  };

  li.appendChild(span);

  li.appendChild(editBtn);

  li.appendChild(deleteBtn);

  list.appendChild(li);
}

/* ================= ANALYTICS ================= */

function updateAnalytics() {

  let totalTasks =
    document.querySelectorAll("#taskList li")
    .length;

  let completedTasks =
    document.querySelectorAll(
      '#taskList input[type="checkbox"]:checked'
    ).length;

  let completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  document.getElementById("totalTasks")
    .innerText =
    `Total Tasks: ${totalTasks}`;

  document.getElementById("completedTasks")
    .innerText =
    `Completed Tasks: ${completedTasks}`;

  document.getElementById("completionRate")
    .innerText =
    `Completion Rate: ${completionRate}%`;

  document.getElementById("totalNotes")
    .innerText =
    `Total Notes: ${savedNotes.length}`;
}

/* ================= SETTINGS ================= */

function toggleSettings() {

  let menu =
    document.getElementById("settingsMenu");

  if (menu.style.display === "block") {

    menu.style.display = "none";

  } else {

    menu.style.display = "block";
  }
}

function changeName() {

  let newName =
    prompt("Enter your name");

  if (!newName) return;

  localStorage.setItem(
    "username",
    newName
  );

  document.getElementById("welcomeText")
    .innerText =
    `Welcome back, ${newName}`;
}

function uploadAvatar() {

  let file =
    document.getElementById("avatarInput")
    .files[0];

  if (!file) return;

  let reader =
    new FileReader();

  reader.onload = function () {

    let imageData =
      reader.result;

    document.getElementById("profilePic")
      .src = imageData;

    localStorage.setItem(
      "avatar",
      imageData
    );
  };

  reader.readAsDataURL(file);
}

/* ================= DARK MODE ================= */

document.getElementById("modeToggle")
  .addEventListener("change", function () {

    document.body.classList
      .toggle("light-mode");
  });

/* ================= CLOCK ================= */

function updateClock() {

  let now =
    new Date();

  document.getElementById("dateTime")
    .innerText =
    now.toLocaleString("en-IN");
}

setInterval(updateClock, 1000);

updateClock();

/* ================= LOAD SAVED DATA ================= */

/* TASKS */

savedTasks.forEach(task => {

  createTask(task.text, task.completed);
});

/* NOTES */

savedNotes.forEach(note => {

  createNote(note.text, note.id);
});

/* USERNAME */

let savedName =
  localStorage.getItem("username");

if (savedName) {

  document.getElementById("welcomeText")
    .innerText =
    `Welcome back, ${savedName}`;
}

/* AVATAR */

let savedAvatar =
  localStorage.getItem("avatar");

if (savedAvatar) {

  document.getElementById("profilePic")
    .src = savedAvatar;
}

/* GOAL */

document.getElementById("goalText")
  .innerText =
  `Daily Goal: ${dailyGoal} Tasks`;

/* STREAK */

document.getElementById("streakText")
  .innerText =
  `🔥 Streak: ${streak} day(s)`;

/* INIT */

updateProgress();

updateAnalytics();
/* ================= PWA ================= */

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("./sw.js")

      .then(() => {

        console.log(
          "Service Worker Registered"
        );
      });
  });
}
// OPEN STUDY AI
document
.getElementById("study-ai-float")
.addEventListener("click",()=>{

    window.open(
        "https://harshittpanday.github.io/study-ai/",
        "_blank"
    );

});
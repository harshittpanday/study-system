/* =========================
        script.js
========================= */

/* ---------------- STORAGE ---------------- */

let savedTasks =
  JSON.parse(localStorage.getItem("tasks")) || [];

let savedNotes =
  JSON.parse(localStorage.getItem("notes")) || [];

let dailyGoal =
  localStorage.getItem("dailyGoal") || 0;

let streak =
  localStorage.getItem("streak") || 0;

/* ---------------- TIMER ---------------- */

let timerRunning = false;

let interval;

let time = 0;

/* ================= TASK SYSTEM ================= */

function addTask() {

  let input =
    document.getElementById("taskInput");

  if (!input.value.trim()) return;

  let task = {
    text: input.value,
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

  let checkbox =
    document.createElement("input");

  checkbox.type = "checkbox";

  checkbox.checked = completed;

  checkbox.onchange = function () {

    updateStorage();

    updateProgress();
  };

  let span =
    document.createElement("span");

  span.innerText = taskText;

  let btn =
    document.createElement("button");

  btn.innerHTML = "🗑️";

  btn.onclick = function () {

    li.remove();

    updateStorage();

    updateProgress();
  };

  li.appendChild(checkbox);

  li.appendChild(span);

  li.appendChild(btn);

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

  let tasks =
    document.querySelectorAll("#taskList li");

  let completed =
    document.querySelectorAll(
      '#taskList input[type="checkbox"]:checked'
    );

  let total = tasks.length;

  let done = completed.length;

  let percent =
    total === 0
      ? 0
      : (done / total) * 100;

  document.getElementById("progressBar")
    .style.width = percent + "%";

  document.getElementById("progressText")
    .innerText =
    `${done} / ${total} Tasks Completed`;

  checkStreak(done);

  updateAnalytics();
}

/* ================= STREAK ================= */

function checkStreak(done) {

  let today =
    new Date().toLocaleDateString();

  let lastCheck =
    localStorage.getItem("lastCheck");

  if (
    done >= dailyGoal &&
    dailyGoal > 0 &&
    lastCheck !== today
  ) {

    streak++;

    localStorage.setItem(
      "streak",
      streak
    );

    localStorage.setItem(
      "lastCheck",
      today
    );
  }

  document.getElementById("streakText")
    .innerText =
    `🔥 Streak: ${streak} day(s)`;
}

/* ================= GOAL ================= */

function setGoal() {

  let goal =
    document.getElementById("goalInput").value;

  if (goal <= 0) return;

  dailyGoal = goal;

  localStorage.setItem(
    "dailyGoal",
    goal
  );

  document.getElementById("goalText")
    .innerText =
    `Daily Goal: ${goal} Tasks`;

  document.getElementById("goalInput").value = "";
}

/* ================= TIMER ================= */

function startTimer() {

  if (timerRunning) return;

  let minutes =
    document.getElementById("minutesInput").value;

  if (time === 0) {

    if (minutes <= 0) return;

    time = minutes * 60;
  }

  timerRunning = true;

  interval = setInterval(function () {

    let min = Math.floor(time / 60);

    let sec = time % 60;

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

  if (!input.value.trim()) return;

  let li =
    document.createElement("li");

  li.innerText = input.value;

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

  if (!input.value.trim()) return;

  let note = {
    id: Date.now(),
    text: input.value
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

  let delBtn =
    document.createElement("button");

  delBtn.innerHTML = "🗑️";

  delBtn.onclick = function () {

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

  li.appendChild(delBtn);

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

  let rate =
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
    `Completion Rate: ${rate}%`;

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
  .addEventListener(
    "change",
    function () {

      document.body.classList
        .toggle("light-mode");
    }
  );

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

/* ================= CLEAR ================= */

function clearTasks() {

  document.getElementById("taskList")
    .innerHTML = "";

  savedTasks = [];

  localStorage.removeItem("tasks");

  updateProgress();
}

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
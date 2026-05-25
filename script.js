/* ================= STORAGE ================= */

let dailyGoal = Number(localStorage.getItem("dailyGoal")) || 0;
let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

let timerRunning = false;
let interval;
let time = 0;

/* ================= STREAK SYSTEM ================= */

let streak = Number(localStorage.getItem("streak")) || 0;
let lastDate = localStorage.getItem("lastDate");
let goalDoneToday = JSON.parse(localStorage.getItem("goalDoneToday")) || false;

function updateStreakUI() {
  const el = document.getElementById("streakText");
  if (el) {
    el.innerText = `🔥 Streak: ${streak} day(s)`;
  }
}

function checkGoalCompletion() {
  let completed = document.querySelectorAll(
    '#taskList input[type="checkbox"]:checked'
  ).length;

  if (dailyGoal > 0 && completed >= dailyGoal) {
    goalDoneToday = true;
    localStorage.setItem("goalDoneToday", true);
  }
}

function handleDailyStreak() {
  let today = new Date().toDateString();

  if (!lastDate) {
    lastDate = today;
    localStorage.setItem("lastDate", today);
    updateStreakUI();
    return;
  }

  if (lastDate === today) {
    updateStreakUI();
    return;
  }

  if (goalDoneToday) {
    streak += 1;
  } else {
    streak = 0;
  }

  goalDoneToday = false;

  localStorage.setItem("streak", streak);
  localStorage.setItem("goalDoneToday", false);
  localStorage.setItem("lastDate", today);

  updateStreakUI();
}

/* ================= TASK SYSTEM ================= */

function addTask() {
  let input = document.getElementById("taskInput");
  if (!input.value) return;

  let taskText = input.value;

  createTask(taskText, false);

  savedTasks.push({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(savedTasks));

  input.value = "";
}

function createTask(taskText, completed) {
  let list = document.getElementById("taskList");

  let li = document.createElement("li");

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;

  checkbox.onchange = function () {
    updateStorage();
    updateProgress();
  };

  let span = document.createElement("span");
  span.innerText = taskText;

  let btn = document.createElement("button");
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

  updateProgress();
}

function updateStorage() {
  let tasks = [];

  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").innerText,
      completed: li.querySelector("input").checked
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ================= PROGRESS ================= */

function updateProgress() {
  let total = document.querySelectorAll("#taskList li").length;
  let done = document.querySelectorAll(
    '#taskList input[type="checkbox"]:checked'
  ).length;

  let percent = total === 0 ? 0 : (done / total) * 100;

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText =
    `${done} / ${total} Tasks Completed`;

  checkGoalCompletion();
  updateAnalytics();
}

/* ================= TIMER ================= */

function startTimer() {
  if (timerRunning) return;

  let minutes = document.getElementById("minutesInput").value;

  if (time === 0) {
    if (!minutes || minutes <= 0) return;
    time = minutes * 60;
  }

  timerRunning = true;

  interval = setInterval(() => {
    let min = Math.floor(time / 60);
    let sec = time % 60;

    document.getElementById("timer").innerText =
      `${min}:${sec < 10 ? "0" : ""}${sec}`;

    time--;

    if (time < 0) {
      clearInterval(interval);
      timerRunning = false;

      new Audio(
        "https://www.soundjay.com/buttons/sounds/beep-07.mp3"
      ).play();

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
  document.getElementById("timer").innerText = "00:00";
}

/* ================= TOPICS ================= */

function addSubjectTask() {
  let input = document.getElementById("subjectInput");
  if (!input.value) return;

  let li = document.createElement("li");
  li.innerText = input.value;

  let btn = document.createElement("button");
  btn.innerHTML = "🗑️";

  btn.onclick = () => li.remove();

  li.appendChild(btn);

  document.getElementById("subjectList").appendChild(li);

  input.value = "";
}

/* ================= THEME ================= */

document.getElementById("modeToggle").addEventListener("change", () => {
  document.body.classList.toggle("light-mode");
});

/* ================= CLEAR ================= */

function clearTasks() {
  document.getElementById("taskList").innerHTML = "";
  document.getElementById("subjectList").innerHTML = "";

  savedTasks = [];
  localStorage.removeItem("tasks");

  clearInterval(interval);
  timerRunning = false;
  time = 0;

  document.getElementById("timer").innerText = "00:00";
  document.getElementById("minutesInput").value = "";

  updateProgress();
}

/* ================= USER ================= */

function changeName() {
  let name = prompt("Enter your name");
  if (!name) return;

  localStorage.setItem("username", name);
  document.getElementById("welcomeText").innerText =
    `Welcome back, ${name}`;
}

let savedName = localStorage.getItem("username");
if (savedName) {
  document.getElementById("welcomeText").innerText =
    `Welcome back, ${savedName}`;
} else {
  changeName();
}

/* ================= SETTINGS ================= */

function toggleSettings() {
  let menu = document.getElementById("settingsMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

/* ================= AVATAR ================= */

function uploadAvatar() {
  let file = document.getElementById("avatarInput").files[0];

  let reader = new FileReader();

  reader.onload = () => {
    let img = reader.result;
    document.getElementById("profilePic").src = img;
    localStorage.setItem("avatar", img);
  };

  if (file) reader.readAsDataURL(file);
}

let savedAvatar = localStorage.getItem("avatar");
if (savedAvatar) {
  document.getElementById("profilePic").src = savedAvatar;
}

/* ================= GOAL ================= */

function setGoal() {
  let goal = Number(document.getElementById("goalInput").value);
  if (goal <= 0) return;

  dailyGoal = goal;
  localStorage.setItem("dailyGoal", goal);

  document.getElementById("goalText").innerText =
    `Daily Goal: ${goal} Tasks`;

  document.getElementById("goalInput").value = "";
}

document.getElementById("goalText").innerText =
  `Daily Goal: ${dailyGoal} Tasks`;

/* ================= CLOCK ================= */

function updateClock() {
  let now = new Date();

  document.getElementById("dateTime").innerText =
    now.toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
}

setInterval(updateClock, 1000);
updateClock();

/* ================= INIT ================= */

savedTasks.forEach(t => createTask(t.text, t.completed));

handleDailyStreak();
updateStreakUI();

savedNotes.forEach(note => {
  createNote(note);
});

/* ================= NOTES ================= */
let savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

/* ========== CREATE NOTE ========== */

function addNote() {
  let input = document.getElementById("noteInput");

  if (!input.value.trim()) return;

  let noteText = input.value;

  savedNotes.push({
    id: Date.now(),
    text: noteText
  });

  localStorage.setItem("notes", JSON.stringify(savedNotes));

  createNote(noteText, savedNotes[savedNotes.length - 1].id);

  input.value = "";
  updateAnalytics();
}

/* ========== RENDER NOTE ========== */

function createNote(text, id) {
  let list = document.getElementById("noteList");

  let li = document.createElement("li");
  li.setAttribute("data-id", id);

  let span = document.createElement("span");
  span.innerText = text;

  /* EDIT BUTTON */
  let editBtn = document.createElement("button");
  editBtn.innerHTML = "✏️";

  editBtn.onclick = function () {
    let newText = prompt("Edit note:", span.innerText);

    if (!newText || !newText.trim()) return;

    span.innerText = newText;

    savedNotes = savedNotes.map(note => {
      if (note.id === id) {
        return { ...note, text: newText };
      }
      return note;
    });

    localStorage.setItem("notes", JSON.stringify(savedNotes));
  };

  /* DELETE BUTTON */
  let delBtn = document.createElement("button");
  delBtn.innerHTML = "🗑️";

  delBtn.onclick = function () {
    li.remove();
 updateAnalytics();
    savedNotes = savedNotes.filter(note => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(savedNotes));
  };

  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(delBtn);

  list.appendChild(li);
  
}

/* ========== LOAD NOTES ON START ========== */

savedNotes.forEach(note => {
  createNote(note.text, note.id);
});
/* ========== ANYLITS ========== */
function updateAnalytics() {

  // TASKS
  let totalTasks = document.querySelectorAll("#taskList li").length;

  let completedTasks = document.querySelectorAll(
    '#taskList input[type="checkbox"]:checked'
  ).length;

  let rate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // NOTES
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  let totalNotes = notes.length;

  // UI UPDATE
  let t1 = document.getElementById("totalTasks");
  let t2 = document.getElementById("completedTasks");
  let t3 = document.getElementById("completionRate");
  let t4 = document.getElementById("totalNotes");

  if (t1) t1.innerText = `Total Tasks: ${totalTasks}`;
  if (t2) t2.innerText = `Completed Tasks: ${completedTasks}`;
  if (t3) t3.innerText = `Completion Rate: ${rate}%`;
  if (t4) t4.innerText = `Total Notes: ${totalNotes}`;
}
updateAnalytics();
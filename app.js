const STORAGE_KEY = "minimal-habits-v1";
const todayKey = (date = new Date()) => {
  const y = date.getFullYear(), m = String(date.getMonth()+1).padStart(2,"0"), d = String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
};
const dateFromKey = key => new Date(`${key}T12:00:00`);
const defaults = [
  {id: crypto.randomUUID(), name:"Morning movement", category:"Health", completed:[]},
  {id: crypto.randomUUID(), name:"Read 10 pages", category:"Learning", completed:[]},
  {id: crypto.randomUUID(), name:"Study Data Science", category:"Learning", completed:[]},
  {id: crypto.randomUUID(), name:"Practice English", category:"Learning", completed:[]}
];
let habits;
try { habits = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaults; }
catch { habits = defaults; }
let activeFilter = "All";
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
const $ = id => document.getElementById(id);

function streakFor(habit) {
  let streak = 0;
  const day = new Date(); day.setHours(12,0,0,0);
  while (habit.completed.includes(todayKey(day))) {
    streak++;
    day.setDate(day.getDate()-1);
  }
  return streak;
}
function render() {
  const today = todayKey();
  const done = habits.filter(h => h.completed.includes(today)).length;
  const percent = habits.length ? Math.round(done / habits.length * 100) : 0;
  $("today-date").textContent = new Intl.DateTimeFormat(undefined,{weekday:"long",month:"long",day:"numeric"}).format(new Date());
  $("done-count").textContent = done;
  $("total-count").textContent = habits.length;
  $("progress-percent").textContent = `${percent}%`;
  $("progress-fill").style.width = `${percent}%`;
  $("remaining-label").textContent = habits.length-done === 0 && habits.length ? "All done — lovely work" : `${habits.length-done} left`;
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === activeFilter));
  const list = $("habit-list"); list.innerHTML = "";
  const shown = habits.filter(h => activeFilter === "All" || h.category === activeFilter);
  $("empty-state").hidden = shown.length !== 0;
  shown.forEach(h => {
    const completed = h.completed.includes(today);
    const row = document.createElement("article"); row.className = `habit-row${completed ? " completed" : ""}`;
    const check = document.createElement("button"); check.className = `check${completed ? " done" : ""}`;
    check.textContent = completed ? "✓" : ""; check.setAttribute("aria-label", completed ? "Mark incomplete" : "Mark complete");
    check.addEventListener("click", () => {
      h.completed = completed ? h.completed.filter(d => d !== today) : [...h.completed, today];
      save(); render();
    });
    const info = document.createElement("div"); info.className = "habit-info";
    const name = document.createElement("p"); name.className = "habit-name"; name.textContent = h.name;
    const meta = document.createElement("p"); meta.className = "habit-meta"; meta.textContent = h.category;
    info.append(name,meta);
    const streak = document.createElement("span"); streak.className = "streak"; const count = streakFor(h);
    streak.textContent = count ? `🔥 ${count}d` : "";
    const more = document.createElement("button"); more.className = "more-button"; more.textContent = "···"; more.setAttribute("aria-label","Habit options");
    more.addEventListener("click", () => {
      if (confirm(`Delete "${h.name}"? Its history will also be deleted.`)) { habits = habits.filter(x => x.id !== h.id); save(); render(); }
    });
    row.append(check,info,streak,more); list.append(row);
  });
  renderWeek();
}
function renderWeek() {
  const grid = $("week-grid"); grid.innerHTML = "";
  const today = new Date(); today.setHours(12,0,0,0);
  for (let offset=6; offset>=0; offset--) {
    const day = new Date(today); day.setDate(today.getDate()-offset);
    const key = todayKey(day);
    const count = habits.filter(h => h.completed.includes(key)).length;
    const ratio = habits.length ? count / habits.length : 0;
    const cell = document.createElement("div"); cell.className = "day-cell";
    const label = document.createElement("span"); label.className = "day-name"; label.textContent = new Intl.DateTimeFormat(undefined,{weekday:"short"}).format(day);
    const dot = document.createElement("span"); dot.className = `day-dot${ratio === 1 && habits.length ? " full" : ratio > 0 ? " some" : ""}`;
    const number = document.createElement("span"); number.className = "day-number"; number.textContent = day.getDate();
    cell.append(label,dot,number); grid.append(cell);
  }
}
document.querySelectorAll(".filter").forEach(b => b.addEventListener("click", () => { activeFilter=b.dataset.filter; render(); }));
const dialog = $("habit-dialog");
function openDialog(){ dialog.showModal(); $("habit-name").focus(); }
$("open-add").addEventListener("click",openDialog);
$("empty-add").addEventListener("click",openDialog);
$("close-dialog").addEventListener("click",()=>dialog.close());
$("habit-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("habit-name").value.trim(); if (!name) return;
  habits.push({id:crypto.randomUUID(),name,category:$("habit-category").value,completed:[]});
  save(); $("habit-form").reset(); dialog.close(); activeFilter="All"; render();
});
if ("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
save(); render();


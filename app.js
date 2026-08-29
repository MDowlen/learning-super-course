import { courses } from "./course-data.js";

let activeCourse = 0;
let activeModule = 0;
let answerVisible = false;
const key = "learning-super-course-progress";
const state = JSON.parse(localStorage.getItem(key) || '{"completed":[],"notes":{}}');
const picker = document.querySelector("#course-picker");
const shell = document.querySelector("#module-shell");

const guides = {
  sql: {
    why: "SQL lets you ask a precise question of structured information. Translate the human question first; only then write the smallest query that can answer it.",
    pattern: "Question → table → columns → filter → readable result → check the output.",
    scenario: "Use a fictional library database with Books, Members, and Loans. Name the evidence table and needed columns before writing any query.",
    example: "A row is one library member and a column is one fact about every member. A stable member_id is safer than a name because names can repeat or change.",
    build: "Create a tiny fictional database. In its README, record the question, query, result, and one limitation.",
    trap: "Never run UPDATE or DELETE until you have run a SELECT with the exact same WHERE condition."
  },
  network: {
    why: "Network automation is not about making changes quickly. It is about making a small, reviewable, testable change with proof that the intended outcome happened.",
    pattern: "Inventory → read-only check → validate input → small change → verify result → evidence → rollback plan.",
    scenario: "Use five fake training switches. Collect one harmless fact, save the result, and describe how you would handle an unreachable device.",
    example: "A successful connection does not prove a successful automation. Validate the expected device state after a command runs, and keep the evidence.",
    build: "Use sample inventory files and environment-variable placeholders only. A public project must never contain real addresses, passwords, private keys, or topology details.",
    trap: "Treat a connection test and an outcome check as two separate steps."
  },
  data: {
    why: "Data science is structured reasoning under uncertainty. A model or chart is useful only when the question, evidence, evaluation, and limitation are visible.",
    pattern: "Decision → measurable question → inspect data → prepare without leakage → evaluate honestly → explain uncertainty → recommend.",
    scenario: "Use a fictional appointment program. Define what counts as a missed appointment, who is represented, what is missing, and what decision the analysis supports.",
    example: "A high score or a beautiful chart is not enough. Check whether the data fits the question, whether evaluation is honest, and whether the limitation is clear.",
    build: "Use an open or invented dataset. Publish the question, data dictionary, reproducible steps, chart or metric, and a limitation-aware recommendation.",
    trap: "Do not confuse association, a prediction score, or a cluster with a causal or fair conclusion."
  }
};

function lessonId(course, index) { return course.id + ":" + index; }
function complete(course, index) { return state.completed.includes(lessonId(course, index)); }
function save() { localStorage.setItem(key, JSON.stringify(state)); }
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function courseCard(course, index) {
  const done = course.modules.filter(function (_, i) { return complete(course, i); }).length;
  const selected = index === activeCourse ? " selected" : "";
  return '<button class="course-card' + selected + '" data-course="' + index + '"><small>' + course.badge + '</small><h2>' + course.title + '</h2><p>' + course.description + '</p><b>' + course.modules.length + ' guided lessons · ' + done + ' complete</b></button>';
}
function lessonLink(course, lesson, index) {
  const active = index === activeModule ? " active" : "";
  const number = complete(course, index) ? "✓" : String(index + 1).padStart(2, "0");
  return '<button class="lesson-link' + active + '" data-module="' + index + '"><span>' + number + '</span>' + lesson[0] + '</button>';
}

function render() {
  const course = courses[activeCourse];
  const lesson = course.modules[activeModule];
  const guide = guides[course.id];
  const id = lessonId(course, activeModule);
  const note = state.notes[id] || "";
  const done = course.modules.filter(function (_, index) { return complete(course, index); }).length;
  picker.innerHTML = courses.map(courseCard).join("");
  shell.innerHTML =
    '<div class="crumb"><span>' + course.source + '</span><strong>' + done + '/' + course.modules.length + ' lessons complete</strong></div>' +
    '<div class="module-layout"><aside><h2>Course lessons</h2>' + course.modules.map(function (item, index) { return lessonLink(course, item, index); }).join("") + '</aside>' +
    '<article><p class="tag">DIGESTIBLE BOOK LESSON · ' + course.badge + '</p><h2>' + lesson[0] + '</h2><p class="lead">' + lesson[1] + '</p>' +
    '<section class="lesson-why"><h3>Why this matters</h3><p>' + guide.why + '</p><p><b>Course pattern:</b> ' + guide.pattern + '</p></section>' +
    '<section><h3>What you will be able to do</h3><ol>' + lesson[2].map(function (item) { return "<li>" + item + "</li>"; }).join("") + '</ol></section>' +
    '<section class="worked"><h3>Walk through a concrete example</h3><p>' + guide.example + '</p><p><b>Say it back:</b> Explain this example in your own words before moving on. If you cannot, reread the lead paragraph and try again without looking.</p></section>' +
    '<section class="guided"><h3>Check your understanding</h3><p>' + lesson[3] + '</p><button id="reveal">' + (answerVisible ? "Hide the answer" : "Reveal the answer") + '</button>' + (answerVisible ? '<div class="answer"><b>Answer:</b> ' + lesson[4] + '<p>' + lesson[5] + '</p></div>' : "") + '</section>' +
    '<section class="practice"><h3>Do it yourself</h3><p>' + guide.scenario + '</p><p><b>Practice prompt:</b> Write what you would inspect first, what you would do, how you would check the result, and one limitation. Clarity wins.</p><textarea id="notes" placeholder="My plan, my answer, and what is still fuzzy…">' + escapeHtml(note) + '</textarea><div class="note-actions"><button id="save-note" class="secondary">Save my notes</button><span id="note-status"></span></div></section>' +
    '<section class="build-next"><h3>Build toward the capstone</h3><p>' + guide.build + '</p><p><b>Common trap:</b> ' + guide.trap + '</p></section>' +
    '<div class="completion"><button id="complete">' + (complete(course, activeModule) ? "Mark lesson incomplete" : "Mark lesson complete") + '</button><span>Completion and notes are saved only in this browser.</span></div>' +
    '<div class="lesson-nav"><button id="previous"' + (activeModule === 0 ? " disabled" : "") + '>← Previous lesson</button><button id="next"' + (activeModule === course.modules.length - 1 ? " disabled" : "") + '>Next lesson →</button></div></article></div>';
  document.querySelectorAll("[data-course]").forEach(function (button) { button.onclick = function () { activeCourse = Number(button.dataset.course); activeModule = 0; answerVisible = false; render(); }; });
  document.querySelectorAll("[data-module]").forEach(function (button) { button.onclick = function () { activeModule = Number(button.dataset.module); answerVisible = false; render(); }; });
  document.querySelector("#reveal").onclick = function () { answerVisible = !answerVisible; render(); };
  document.querySelector("#previous")?.addEventListener("click", function () { activeModule--; answerVisible = false; render(); });
  document.querySelector("#next")?.addEventListener("click", function () { activeModule++; answerVisible = false; render(); });
  document.querySelector("#save-note").onclick = function () { state.notes[id] = document.querySelector("#notes").value; save(); document.querySelector("#note-status").textContent = "Saved in this browser."; };
  document.querySelector("#complete").onclick = function () { const spot = state.completed.indexOf(id); if (spot >= 0) state.completed.splice(spot, 1); else state.completed.push(id); save(); render(); };
}
render();

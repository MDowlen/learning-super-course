import { courses } from "./course-data.js";
let activeCourse = 0, activeModule = 0, chosen = null;
const picker = document.querySelector("#course-picker"), shell = document.querySelector("#module-shell");
function render() {
  picker.innerHTML = courses.map((course, index) => `<button class="course-card ${index===activeCourse?"selected":""}" data-course="${index}"><small>${course.badge}</small><h2>${course.title}</h2><p>${course.description}</p><b>${course.modules.length} book-grounded lessons</b></button>`).join("");
  const course = courses[activeCourse], lesson = course.modules[activeModule];
  shell.innerHTML = `<div class="crumb"><span>${course.source}</span><strong>Lesson ${activeModule+1} of ${course.modules.length}</strong></div><div class="module-layout"><aside><h2>Course lessons</h2>${course.modules.map((m,i)=>`<button class="lesson-link ${i===activeModule?"active":""}" data-module="${i}"><span>${String(i+1).padStart(2,"0")}</span>${m[0]}</button>`).join("")}</aside><article><p class="tag">DIGESTIBLE BOOK LESSON</p><h2>${lesson[0]}</h2><p class="lead">${lesson[1]}</p><section><h3>What this lesson teaches</h3><ol>${lesson[2].map(item=>`<li>${item}</li>`).join("")}</ol></section><section class="guided"><h3>Try one together</h3><p>${lesson[3]}</p><button id="reveal">${chosen === null ? "Reveal the answer" : "Hide the answer"}</button>${chosen !== null ? `<div class="answer"><b>Answer:</b> ${lesson[4]}<p>${lesson[5]}</p></div>`:""}</section><section class="practice"><h3>Practice it yourself</h3><p>Write your answer or explanation in your notes, then return to the book chapter if you need a second pass. The goal is to explain the idea without copying a definition.</p><textarea placeholder="What I understand, what I would try, and what is still fuzzy..."></textarea></section><div class="lesson-nav"><button id="previous" ${activeModule===0?"disabled":""}>← Previous lesson</button><button id="next" ${activeModule===course.modules.length-1?"disabled":""}>Next lesson →</button></div></article></div>`;
  document.querySelectorAll("[data-course]").forEach(button=>button.onclick=()=>{activeCourse=Number(button.dataset.course);activeModule=0;chosen=null;render();});
  document.querySelectorAll("[data-module]").forEach(button=>button.onclick=()=>{activeModule=Number(button.dataset.module);chosen=null;render();});
  document.querySelector("#reveal").onclick=()=>{chosen=chosen===null?true:null;render();};
  document.querySelector("#previous")?.addEventListener("click",()=>{activeModule--;chosen=null;render();});
  document.querySelector("#next")?.addEventListener("click",()=>{activeModule++;chosen=null;render();});
}
render();

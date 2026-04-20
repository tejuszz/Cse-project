// timetable.js
const isTeacher = window.location.pathname.includes("professor");
const days = ["Time","Monday","Tuesday","Wednesday","Thursday","Friday"];

const slots = [
"09:30-10:30",
"10:30-11:30",
"11:30-12:30",
"01:30-02:30",
"02:30-03:30",
"03:30-04:30",
"04:30-05:30"
];
const defaultData = {
"Monday": {
"01:30-02:30": [{sub:"MALB 152",teacher:"Dr. Shivani",group:"ALL",loc:"LT1"}],
"02:30-03:30": [{sub:"MALB 152",teacher:"Dr. Shivani",group:"G1",loc:"Admin Block"}],
"03:30-04:30": [{sub:"CELB 101",teacher:"Dr. Vijay",group:"ALL",loc:"LT1"}],
"04:30-05:30": []
},

"Tuesday": {
"09:30-10:30": [
 {sub:"CSBB 151",teacher:"Dr. Amandeep",group:"G1",loc:"Admin Block (CS17)", lab:true}
],
"10:30-11:30": [
 {sub:"CSBB 151",teacher:"Dr. Amandeep",group:"G1",loc:"Admin Block (CS17)", lab:true}
],
"11:30-12:30": [
 {sub:"CSLB 152",teacher:"Dr. Gunjan",group:"G1",loc:"Admin Block"}
],
"01:30-02:30": [{sub:"CSLB 152",teacher:"Dr. Gunjan",group:"ALL",loc:"LT1"}],
"02:30-03:30": [{sub:"CSBB 151",teacher:"Dr. Amandeep",group:"ALL",loc:"LT1"}]
},

"Wednesday": {
"01:30-02:30": [{sub:"CSLB 152",teacher:"Dr. Gunjan",group:"ALL",loc:"LT1"}]
},

"Thursday": {
"09:30-10:30": [
 {sub:"CSPB 154",teacher:"Dr. Gunjan",group:"G2",loc:"Admin Block (CS03)", lab:true}
],
"10:30-11:30": [
 {sub:"CSPB 154",teacher:"Dr. Gunjan",group:"G2",loc:"Admin Block (CS03)", lab:true}
],
"01:30-02:30": [{sub:"CSLB 152",teacher:"Dr. Gunjan",group:"ALL",loc:"LT1"}],
"02:30-03:30": [{sub:"MALB 152",teacher:"Dr. Shivani",group:"ALL",loc:"LT1"}],

"03:30-04:30": [
 {sub:"CSLB 154",teacher:"Dr. Biswajit",group:"G1",loc:"LT-1"}
],
"04:30-05:30": [
 {sub:"CSBB 151",teacher:"Dr. Amandeep",group:"G2",loc:"LT-2"}
]
},

"Friday": {
"09:30-10:30": [
 {sub:"CSBB 151",teacher:"Dr. Amandeep",group:"G2",loc:"LT1", lab:true},
 {sub:"CSPB 154",teacher:"Dr. Gunjan",group:"G1",loc:"LT1", lab:true}
],
"10:30-11:30": [
 {sub:"CSBB 151",teacher:"Dr. Amandeep",group:"G2",loc:"LT1", lab:true},
 {sub:"CSPB 154",teacher:"Dr. Gunjan",group:"G1",loc:"LT1", lab:true}
],
"11:30-12:30": [
 {sub:"CSLB 152",teacher:"Dr. Gunjan",group:"G2",loc:"Admin Block"}
],
"01:30-02:30": [
 {sub:"MALB 152",teacher:"Dr. Shivani",group:"G2",loc:"Admin Block"}
],
"02:30-03:30": [{sub:"MALB 152",teacher:"Dr. Shivani",group:"ALL",loc:"LT1"}],

"03:30-04:30": [
 {sub:"CSBB 151",teacher:"Dr. Amandeep",group:"ALL",loc:"LT1"}
],
"04:30-05:30": [
 {sub:"CSLB 154", teacher:"Dr. Biswajit", group:"ALL", loc:"LT-2"}
]
}
};

// load persisted data or use defaults
let data;
const _saved = localStorage.getItem("timetableData");
if (_saved) {
  try { data = JSON.parse(_saved); } catch (e) { data = JSON.parse(JSON.stringify(defaultData)); }
} else {
  data = JSON.parse(JSON.stringify(defaultData));
}

// BroadcastChannel for cross-tab sync (best-effort)
let channel = null;
try{
  channel = new BroadcastChannel('timetable_channel');
  channel.onmessage = (ev)=>{
    if(ev.data){
      data = ev.data;
      localStorage.setItem("timetableData", JSON.stringify(data));
      renderGrid();
    }
  };
}catch(e){ channel = null; }

// listen to storage events (other tabs)
window.addEventListener('storage', (e)=>{
  if(e.key === 'timetableData'){
    try{ data = JSON.parse(e.newValue); }catch(_){ data = JSON.parse(JSON.stringify(defaultData)); }
    renderGrid();
  }
});

function saveData(){
  localStorage.setItem("timetableData", JSON.stringify(data));
  if(channel) try{ channel.postMessage(data); }catch(e){}
}

const grid = document.getElementById("grid");
const tooltip = document.getElementById("tooltip");

// helper: create a class DOM element (used for initial render and dynamic adds)
function createClassElement(clsObj, day, time, wrapper, index){
  const code = clsObj.sub.split(" ")[0];
  const el = document.createElement("div");
  el.className = `class ${code}`;
  el.innerHTML = `${clsObj.sub} (${clsObj.group})<br><span class="teacher">${clsObj.teacher}</span>`;

  el.onmousemove = (e)=>{
    tooltip.style.display = "block";

    const tooltipWidth = 200;
    const tooltipHeight = 100;

    let x = e.pageX + 15;
    let y = e.pageY + 15;

    // prevent overflow right
    if (x + tooltipWidth > window.innerWidth) {
      x = e.pageX - tooltipWidth - 15;
    }

    // prevent overflow bottom
    if (y + tooltipHeight > window.innerHeight) {
      y = e.pageY - tooltipHeight - 15;
    }

    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";

    tooltip.innerHTML = `
      <b>${clsObj.sub}</b><br>
      Group: ${clsObj.group}<br>
      ${day}<br>
      ${time}<br>
      ${clsObj.loc}<br>
      ${clsObj.teacher}
    `;
  };

  el.onmouseleave = ()=> tooltip.style.display = "none";
  if (clsObj.lab) {
    el.classList.add("lab-block");
  }
  if(isTeacher){
    // remove button (updates data + persist + re-render)
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.innerText = "-";
    removeBtn.title = "Remove class";
    removeBtn.addEventListener("click", (ev)=>{
      ev.stopPropagation();
      if(data[day] && data[day][time]){
        data[day][time].splice(index,1);
        if(data[day][time].length === 0) delete data[day][time];
        // cleanup empty day
        if(Object.keys(data[day]||{}).length === 0) delete data[day];
        saveData();
        renderGrid();
      }
    });
    el.appendChild(removeBtn);
  }

  return el;
}

// helper: create a '+' placeholder that prompts and adds a new class (UI-only)
function createAddPlaceholder(day, time, wrapper){
  const placeholder = document.createElement("div");
  placeholder.className = "add-placeholder";
  placeholder.innerText = "+";

  placeholder.addEventListener("click", (ev)=>{
    ev.stopPropagation();
    const sub = prompt("Subject (e.g. MALB 152):");
    if(!sub) return;
    const teacherName = prompt("Teacher:");
    if(teacherName === null) return;
    const group = prompt("Group (G1/G2/ALL):", "ALL");
    if(group === null) return;
    const loc = prompt("Location:");
    if(loc === null) return;

    const newCls = { sub: sub, teacher: teacherName, group: group, loc: loc };
    if(!data[day]) data[day] = {};
    if(!data[day][time]) data[day][time] = [];
    data[day][time].push(newCls);
    saveData();
    renderGrid();
  });

  return placeholder;
}

// render grid (can be called to re-build after data changes)
function renderGrid(){
  // clear
  grid.innerHTML = '';

  // headers
  days.forEach(d=>{
    let div=document.createElement("div");
    div.className="cell header";
    div.innerText=d;
    grid.appendChild(div);
  });

  slots.forEach(time=>{
    let t=document.createElement("div");
    t.className="cell header";
    t.innerText=time;
    grid.appendChild(t);

    days.slice(1).forEach(day=>{
      let cell=document.createElement("div");
      cell.className="cell";

      if(data[day] && data[day][time]){
        const hasLab = data[day][time].some(c => c.lab);

        if(hasLab && time === "09:30-10:30"){
          cell.style.gridRow = "span 2";
        }

        // hide second row completely
        if(hasLab && time === "10:30-11:30"){
          cell.style.display = "none";
        }
      }

      const wrapper=document.createElement("div");
      wrapper.className="split";

      if(data[day] && data[day][time] && data[day][time].length){
        data[day][time].forEach((cls, idx)=>{

        // 🚫 Skip second slot of lab
        if(cls.lab && time === "10:30-11:30") return;

        const el = createClassElement(cls, day, time, wrapper, idx);

        // 🔥 Make lab span 2 rows
        if(cls.lab && time === "09:30-10:30"){
          wrapper.style.height = "170px"; // fallback for multiple labs
        }

        wrapper.appendChild(el);
      });
      } else if(isTeacher){
        // show add placeholder for teachers on empty slots
        const placeholder = createAddPlaceholder(day, time, wrapper);
        wrapper.appendChild(placeholder);
      }

      if(wrapper.childNodes.length) cell.appendChild(wrapper);
      grid.appendChild(cell);
    });
  });
}

// teacher controls (reset)
if(isTeacher){
  const controls = document.createElement('div');
  controls.className = 'teacher-controls';
  const resetBtn = document.createElement('button');
  resetBtn.className = 'reset-btn';
  resetBtn.innerText = 'Reset Timetable';
  resetBtn.addEventListener('click', ()=>{
    if(!confirm('Reset timetable to defaults? This will clear saved data.')) return;
    localStorage.removeItem('timetableData');
    data = JSON.parse(JSON.stringify(defaultData));
    saveData();
    renderGrid();
  });
  controls.appendChild(resetBtn);
  grid.parentNode && grid.parentNode.insertBefore(controls, grid);
}

// initial render
renderGrid();

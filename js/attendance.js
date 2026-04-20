window.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");

    if (!role) {
        alert("Login required");
        window.location.href = "index.html";
        return;
    }

    if (role === "student") {

        const userId = localStorage.getItem("userId");

        // 🔥 Clean header
        fetch("http://localhost:5000/api/students")
            .then(res => res.json())
            .then(students => {
                const student = students.find(s => s.id === userId);
                const name = student ? student.name : "Student";

                document.getElementById("studentName").innerText = name;
                document.getElementById("studentId").innerText = `Roll No: ${userId}`;
            });

        document.getElementById("teacherSection").style.display = "none";
        document.getElementById("studentSection").style.display = "block";

        fetch(`http://localhost:5000/student-attendance/${userId}`)
            .then(res => res.json())
            .then(data => showStudentData(data));

        loadClassOverview();

    } else {
        document.getElementById("studentSection").style.display = "none";
        document.getElementById("teacherSection").style.display = "block";

        loadSubjects();
        loadStudents();
    }
});


// ================= STUDENT UI =================
function showStudentData(data) {
    const box = document.getElementById("percentageBox");
    box.innerHTML = "";

    if (data.length === 0) {
        box.innerHTML = "<p>No attendance data</p>";
        return;
    }

    let total = 0;
    let count = 0;

    data.forEach(sub => {
        if (sub.subject === "General") return;
        total += sub.percent;
        count++;
    });

    const overall = count ? Math.round(total / count) : 0;

    // 🔥 TEMP PREDICTION FIX (based on percentage)
    let neededClasses = 0;

    if (overall < 75) {
        let percent = overall;

        while (percent < 75) {
            percent = ((percent * (count + neededClasses)) + 100) / (count + neededClasses + 1);
            neededClasses++;
        }
    }

    // 🔥 WARNING MESSAGE
    let warning = "";
    if (overall < 75) {
        warning = `
            <p style="color:#ff6b6b;">
                ⚠ You need approx ${neededClasses} more classes to reach 75%
            </p>
        `;
    }

    box.innerHTML += `
        <div class="overall-box">
            Overall → ${overall}%
        </div>
        ${warning}
    `;

    // 🔥 SUBJECT + PROGRESS BARS
    data.forEach(sub => {
        if (sub.subject === "General") return;

        let color = "#00ffcc";
        if (sub.percent < 75) color = "#ff6b6b";
        else if (sub.percent < 85) color = "#ffd166";

        box.innerHTML += `
            <div class="subject-item">
                <span>${sub.subject}</span>
                <span>${sub.percent}%</span>
            </div>

            <div class="progress-bar">
                <div class="progress-fill" style="
                    width: ${sub.percent}%;
                    background: ${color};
                "></div>
            </div>
        `;
    });
}


// ================= TEACHER UI =================
function loadSubjects() {
    const subjects = JSON.parse(localStorage.getItem("userSubjects")) || [];
    const select = document.getElementById("subjectSelect");

    select.innerHTML = "";

    subjects.forEach(sub => {
        const option = document.createElement("option");
        option.value = sub;
        option.textContent = sub;
        select.appendChild(option);
    });
}

function loadStudents() {
    const table = document.getElementById("studentList");

    fetch("http://localhost:5000/api/students")
        .then(res => res.json())
        .then(data => {
            table.innerHTML = "";

            data.forEach(student => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${student.name}</td>
                    <td><button onclick="markAttendance('${student.id}', 'Present')">✔</button></td>
                    <td><button onclick="markAttendance('${student.id}', 'Absent')">✖</button></td>
                `;

                table.appendChild(row);
            });
        });
}

function markAttendance(studentId, status) {
    const role = localStorage.getItem("role");

    if (role !== "teacher" && role !== "professor") {
        alert("Access Denied");
        return;
    }

    const subject = document.getElementById("subjectSelect").value;

    fetch("http://localhost:5000/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            studentId,
            subject,
            status
        })
    })
    .then(res => res.json())
    .then(() => alert("Attendance Marked"));
}


// ================= CLASS OVERVIEW =================
function loadClassOverview() {

    const currentUserId = localStorage.getItem("userId");

    Promise.all([
        fetch("http://localhost:5000/api/attendance").then(res => res.json()),
        fetch("http://localhost:5000/api/students").then(res => res.json())
    ])
    .then(([attendanceData, students]) => {

        const nameMap = {};
        students.forEach(s => {
            nameMap[s.id] = s.name;
        });

        const map = {};

        attendanceData.forEach(item => {
            if (!item.studentId) return;

            if (!map[item.studentId]) {
                map[item.studentId] = { present: 0, total: 0 };
            }

            map[item.studentId].total++;

            if (item.status === "Present") {
                map[item.studentId].present++;
            }
        });

        const list = [];

        for (let id in map) {
            const { present, total } = map[id];
            const percent = Math.round((present / total) * 100);

            list.push({
                id,
                name: nameMap[id] || id,
                percent
            });
        }

        // 🔥 Sort
        list.sort((a, b) => b.percent - a.percent);

        const left = document.getElementById("leftOverview");
        const right = document.getElementById("rightOverview");

        left.innerHTML = "<h4>🏆 Top Students</h4>";
        right.innerHTML = "<h4>📊 Class</h4>";

        let userRank = 0;

        list.forEach((student, index) => {

            if (student.id === currentUserId) {
                userRank = index + 1;
            }

            let medal = "";
            if (index === 0) medal = "🥇";
            else if (index === 1) medal = "🥈";
            else if (index === 2) medal = "🥉";

            const highlight = student.id === currentUserId ? "highlight" : "";

            const item = `
                <div class="side-item ${highlight}">
                    <span>${medal} ${student.name}</span>
                    <span>${student.percent}%</span>
                </div>
            `;

            if (index < Math.ceil(list.length / 2)) {
                left.innerHTML += item;
            } else {
                right.innerHTML += item;
            }
        });

        // 🔥 CLASS AVERAGE + YOU VS CLASS
        let totalPercent = 0;
        list.forEach(s => totalPercent += s.percent);

        const classAvg = Math.round(totalPercent / list.length);

        const currentUser = list.find(s => s.id === currentUserId);
        const yourPercent = currentUser ? currentUser.percent : 0;

        const color = yourPercent >= classAvg ? "#00ffcc" : "#ff6b6b";

        const box = document.getElementById("percentageBox");

        box.innerHTML += `
            <div style="
                margin-top:15px;
                padding:12px;
                border-radius:12px;
                background: rgba(255,255,255,0.2);
            ">
                <p>👤 You: <strong style="color:${color}">${yourPercent}%</strong></p>
                <p>📊 Class Avg: <strong>${classAvg}%</strong></p>
            </div>

            <p style="margin-top:10px;">🏆 You are Rank #${userRank}</p>
        `;
    });
}
// ===== THEME TOGGLE =====
const toggleBtn = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    toggleBtn.textContent = "☀️";
}

// Toggle on click
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "🌙";
    }
});
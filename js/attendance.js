const role = localStorage.getItem("role");

window.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");

    if (!role) {
        alert("Login required");
        window.location.href = "index.html";
        return;
    }

    if (role === "student") {
        document.getElementById("teacherSection").style.display = "none";

        const userId = localStorage.getItem("userId");

        fetch(`http://localhost:5000/student-attendance/${userId}`)
            .then(res => res.json())
            .then(data => showStudentData(data));
    } else {
        document.getElementById("studentSection").style.display = "none";
        loadSubjects();
        loadStudents(); // 🔥 THIS FIXES YOUR ISSUE
    }
});

function showStudentData(data) {
    const box = document.getElementById("percentageBox");
    box.innerHTML = "";

    if (data.length === 0) {
        box.innerHTML = "<p>No attendance data</p>";
        return;
    }

    let totalPercent = 0;

    data.forEach(sub => {
        totalPercent += sub.percent;
    });

    const overall = Math.round(totalPercent / data.length);

    // 🔥 Show overall first
    box.innerHTML += `
        <p style="font-size:18px; font-weight:bold;">
            Overall → ${overall}%
        </p>
        <hr>
    `;

    // 🔥 Then subject-wise
    data.forEach(sub => {
    if (sub.subject === "General") return; // 🔥 skip it

    box.innerHTML += `
        <p>
            <strong>${sub.subject}</strong> :
            ${sub.percent}%
        </p>
    `;
});
}
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

    if (!table) {
        console.log("studentList not found");
        return;
    }

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
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            studentId: studentId,
            subject: subject,
            status: status
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("Attendance Marked");
    });
}

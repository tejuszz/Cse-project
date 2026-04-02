const API = "http://localhost:5000/api/attendance";

// Mark Present
function markPresent() {
    const name = document.getElementById("studentName").value.trim();

    if (!name) {
        alert("Enter a name");
        return;
    }

    sendAttendance(name, "Present");
}

// Mark Absent
function markAbsent() {
    const name = document.getElementById("studentName").value.trim();

    if (!name) {
        alert("Enter a name");
        return;
    }

    sendAttendance(name, "Absent");
}

// Send data to backend
function sendAttendance(name, status) {
    fetch(API + "/mark", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            date: new Date().toLocaleDateString(),
            status: status
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Saved:", data);
        loadAttendance();
    })
    .catch(err => console.error("POST error:", err));
}

// Load attendance list
function loadAttendance() {
    fetch(API)
    .then(res => res.json())
    .then(data => {
        console.log("Fetched:", data);

        const list = document.getElementById("attendanceList");
        list.innerHTML = "";

        // 🔴 Safety check
        if (!Array.isArray(data)) {
            console.error("Data is not an array:", data);
            return;
        }

        data.forEach(item => {
            const li = document.createElement("li");

            // ✅ FIXED LINE
            li.textContent = `${item.name} - ${item.date} - ${item.status}`;

            list.appendChild(li);
        });
    })
    .catch(err => console.error("GET error:", err));
}

// Load on page start
window.onload = loadAttendance;
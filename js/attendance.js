const role = localStorage.getItem("role");

window.onload = () => {
    if (!role) {
        alert("Login required");
        window.location.href = "index.html";
        return;
    }

    // 👨‍🎓 STUDENT RESTRICTION
    if (role === "student") {
        document.querySelector(".buttons").style.display = "none";
        document.getElementById("studentName").style.display = "none";
    }

    loadRecords();
};
function markPresent() {
    sendData("Present");
}

function markAbsent() {
    sendData("Absent");
}

function sendData(status) {
    const name = document.getElementById("studentName").value;

    if (!name) {
        alert("Enter name");
        return;
    }

    fetch("http://localhost:5000/api/attendance/mark", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, status })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        document.getElementById("studentName").value = "";
        loadRecords(); // refresh list
    })
    .catch(err => console.error(err));
}

// Load all records
function loadRecords() {
    fetch("http://localhost:5000/api/attendance")
    .then(res => res.json())
    .then(data => {

        const list = document.getElementById("records");
        list.innerHTML = "";

        data.forEach((item) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.status}</td>
                <td>${item.date ? new Date(item.date).toLocaleString() : "N/A"}</td>
                <td>
                    <button onclick="deleteRecord('${item._id}')">🗑</button>
                </td>
            `;

            list.appendChild(row);
        });

        // 🔥 CALCULATE %
        const stats = calculatePercentage(data);
        showPercentage(stats);

    });
}
function deleteRecord(id) {
    fetch(`http://localhost:5000/api/attendance/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadRecords();
    })
    .catch(err => console.error(err));
}
function calculatePercentage(data) {
    const stats = {};

    data.forEach(item => {
        if (!stats[item.name]) {
            stats[item.name] = {
                present: 0,
                total: 0
            };
        }

        stats[item.name].total++;

        if (item.status === "Present") {
            stats[item.name].present++;
        }
    });

    return stats;
}
function showPercentage(stats) {
    const box = document.getElementById("percentageBox");
    box.innerHTML = "";

    for (let name in stats) {
        const { present, total } = stats[name];
        const percent = ((present / total) * 100).toFixed(1);

        box.innerHTML += `
            <p>
                <strong>${name}</strong> :
                ${percent}% (${present}/${total})
            </p>
        `;
    }
}

window.onload = loadRecords;
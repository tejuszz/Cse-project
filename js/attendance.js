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

        data.forEach((item, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.status}</td>
                <td>${item.date ? new Date(item.date).toLocaleString() : "N/A"}</td>
                <td>
                    <button onclick="deleteRecord(${index})">🗑</button>
                </td>
            `;

            list.appendChild(row);
        });
    });
}
function deleteRecord(index) {
    console.log("Delete clicked", index); // debug

    fetch(`http://localhost:5000/api/attendance/${index}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadRecords(); // refresh table
    })
    .catch(err => console.error(err));
}


window.onload = loadRecords;
let selectedSub = "";
let selectedType = "";

window.onload = function() {
    const name = localStorage.getItem("userName");
    let subjects = JSON.parse(localStorage.getItem("userSubjects"));

    if (!subjects || subjects.length === 0) {
        alert("No subjects found. Please login again.");
        window.location.href = "index.html";
        return;
    }

    if (name) document.getElementById("profName").innerText = name;

    const list = document.getElementById("profSubjectList");

    subjects.forEach((sub, index) => {
        const li = document.createElement("li");
        li.className = "course-item";

        li.innerHTML = `
            <div class="course-link" onclick="toggleSub('menu${index}')">
                <span class="subject-code">${sub}</span>
            </div>
            <ul id="menu${index}" class="submenu">
                <li onclick="prepUpload('${sub}', 'Theory')">Theory</li>
                <li onclick="prepUpload('${sub}', 'Tute')">Tute</li>
                <li onclick="prepUpload('${sub}', 'Lab')">Lab</li>
            </ul>
        `;

        list.appendChild(li);
    });
};

function toggleSub(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

function prepUpload(sub, type) {
    selectedSub = sub;
    selectedType = type;

    document.getElementById("placeholder").style.display = "none";
    document.getElementById("uploadUI").style.display = "block";

    document.getElementById("activeSubject").innerText = sub;
    document.getElementById("activeSection").innerText = "Uploading to: " + type;
    loadUploadedMaterials();
}

async function saveToStudent(category) {
    const title = document.getElementById("mTitle").value;
    const link = document.getElementById("mLink").value;
    const file = document.getElementById("fileInput")?.files[0];

    if (!title || (!link && !file)) {
        alert("Provide either a link or a file");
        return;
    }

    try {
        // 🔥 CASE 1: FILE UPLOAD
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("subject", selectedSub);
            formData.append("type", selectedType);
            formData.append("title", title);
            formData.append("category", category === "lectures" ? "lecture" : "notes");

            await fetch("http://localhost:5000/api/materials/upload", {
                method: "POST",
                body: formData
            });

        } 
        // 🔥 CASE 2: LINK UPLOAD
        else {
            await fetch("http://localhost:5000/api/materials/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    subject: selectedSub,
                    type: selectedType,
                    title: title,
                    link: link,
                    category: category === "lectures" ? "lecture" : "notes"
                })
            });
        }

        alert("✅ Uploaded successfully!");

        document.getElementById("mTitle").value = "";
        document.getElementById("mLink").value = "";
        if (document.getElementById("fileInput")) {
            document.getElementById("fileInput").value = "";
        }

    } catch (err) {
        console.error(err);
        alert("❌ Upload failed");
    }
}
async function uploadMaterial() {
    const category = document.getElementById("mCategory").value;
    const title = document.getElementById("mTitle").value;
    const link = document.getElementById("mLink").value;
    const file = document.getElementById("fileInput").files[0];

    if (!title) {
        alert("Enter title");
        return;
    }

    try {
        if (file) {
            // FILE UPLOAD
            const formData = new FormData();
            formData.append("file", file);
            formData.append("subject", selectedSub);
            formData.append("type", selectedType);
            formData.append("title", title);
            formData.append("category", category);

            await fetch("http://localhost:5000/api/materials/upload", {
                method: "POST",
                body: formData
            });

        } else if (link) {
            // LINK UPLOAD
            await fetch("http://localhost:5000/api/materials/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: selectedSub,
                    type: selectedType,
                    title: title,
                    link: link,
                    category: category
                })
            });
        }

        alert("Uploaded successfully!");
        loadUploadedMaterials();

    } catch (err) {
        alert("Upload failed");
    }
    event?.preventDefault();
}
async function loadUploadedMaterials() {
    const res = await fetch(`http://localhost:5000/api/materials?subject=${selectedSub}&type=${selectedType}`);
    const data = await res.json();

    const container = document.getElementById("uploadedList");

    container.innerHTML = data.map(item => `
        <div class="uploaded-item">
            <span>📄 ${item.title}</span>

            <div class="actions">
                <a href="${
                    item.link.startsWith("http")
                    ? item.link
                    : "http://localhost:5000/uploads/" + item.link
                }" target="_blank" class="btn-view">View</a>

                <button onclick="editMaterial('${item._id}', '${item.title}')">Edit</button>

                <button type="button" onclick="deleteMaterial('${item._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}
async function deleteMaterial(id) {
    if (!confirm("Delete this file?")) return;

    try {
        const res = await fetch(`http://localhost:5000/api/materials/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        console.log("DELETE RESPONSE:", data);

        if (!res.ok) {
            alert("Delete failed");
            return;
        }

        loadUploadedMaterials();

    } catch (err) {
        console.error(err);
        alert("Error deleting file");
    }
}
async function editMaterial(id, oldTitle) {
    const newTitle = prompt("Edit title:", oldTitle);

    if (!newTitle) return;

    await fetch(`http://localhost:5000/api/materials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
    });

    loadUploadedMaterials();
}
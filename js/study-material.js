// Toggle submenu
function toggleSub(id) {
    let el = document.getElementById(id);
    el.style.display = (el.style.display === "block") ? "none" : "block";
}

// Load materials from backend
async function loadResources(subject, type) {
    const display = document.getElementById('contentBox');

    try {
        const res = await fetch(`http://localhost:5000/api/materials?subject=${subject}&type=${type}`);
        const data = await res.json();

        const lectures = data.filter(d => d.category === "lecture");
        const notes = data.filter(d => d.category === "notes");

        display.innerHTML = `
    <div class="header-box">
        <h2>${subject} (${type})</h2>
    </div>

    <div class="material-container">

                <div class="material-section">
                    <h3>🎥 Recorded Lectures</h3>
                    ${
                        lectures.length > 0
                        ? lectures.map(l => `
                            <div class="material-card">
                                <div class="left">
                                    <span class="icon">🎥</span>
                                    <span class="title">${l.title}</span>
                                </div>
                                <a href="${
                                    l.link.startsWith("http")
                                    ? l.link
                                    : "http://localhost:5000/uploads/" + l.link
                                }" target="_blank" class="btn">Open</a>
                            </div>
                        `).join('')
                        : `<p class="empty">No lectures available</p>`
                    }
                </div>

                <div class="material-section">
                    <h3>📄 Notes / PPTs</h3>
                    ${
                        notes.length > 0
                        ? notes.map(n => `
                            <div class="material-card">
                                <div class="left">
                                    <span class="icon">📄</span>
                                    <span class="title">${n.title}</span>
                                </div>
                                <a href="${
                                    n.link.startsWith("http")
                                    ? n.link
                                    : "http://localhost:5000/uploads/" + n.link
                                }" target="_blank" class="btn">Open</a>
                            </div>
                        `).join('')
                        : `<p class="empty">No notes available</p>`
                    }
                </div>

            </div>
        `;

    } catch (err) {
        display.innerHTML = "<p>Error loading materials</p>";
    }
}
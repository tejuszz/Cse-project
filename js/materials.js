// Data for study materials organized by year/semester
const materialsData = {
    "1st Year": [
        { name: "Engineering Mathematics", link: "#", type: "PDF" },
        { name: "Programming in C++", link: "#", type: "Notes" }
    ],
    "2nd Year": [
        { name: "Data Structures & Algorithms", link: "#", type: "Book" },
        { name: "Digital Logic Design", link: "#", type: "Lab Manual" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if user is logged in
    const role = localStorage.getItem("role");
    if (!role) {
        window.location.href = "index.html"; // Redirect to login if unauthorized
        return;
    }

    // 2. Render the materials list dynamically
    const container = document.getElementById("materialsList");
    if (container) {
        let htmlContent = "";
        
        for (const [year, files] of Object.entries(materialsData)) {
            htmlContent += `<h3>${year}</h3><ul class="menu">`;
            files.forEach(file => {
                htmlContent += `
                    <li class="menu-item">
                        <a class="menu-link" href="${file.link}" target="_blank">
                            ${file.type === 'PDF' ? '📄' : '📚'} ${file.name}
                        </a>
                    </li>`;
            });
            htmlContent += `</ul>`;
        }
        container.innerHTML = htmlContent;
    }
});
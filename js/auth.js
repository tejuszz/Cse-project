const users = {
    student: [
        { id: "251210129", pass: "123" },
        { id: "251210116", pass: "123" },
        { id: "251210095", pass: "123" },
        { id: "251210105", pass: "123" } 
    ],
    professor: { id: "teacher", pass: "123" },
};

let currentRole = "";

// --- 1. Role Selection Logic ---
function selectRole(role) {
    currentRole = role;
    
    const roleSelect = document.getElementById("roleSelect");
    const loginForm = document.getElementById("loginForm");
    const roleTitle = document.getElementById("roleTitle");
    const usernameInput = document.getElementById("username");

    if (roleSelect && loginForm) {
        roleSelect.style.display = "none";
        loginForm.style.display = "flex";
    }

    const titles = {
        student: { text: "Student Login", hint: "Roll Number" },
        professor: { text: "Professor Login", hint: "Professor ID" }
    };

    if (titles[role]) {
        roleTitle.innerText = titles[role].text;
        usernameInput.placeholder = titles[role].hint;
    }
}

function goBack() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("roleSelect").style.display = "block"; 
    currentRole = "";
}

// --- 2. Login Logic ---
function login(e) {
    if (e) e.preventDefault();

    if (!currentRole) {
        alert("Please select a role first!");
        return false;
    }

    const id = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    let isValid = false;

    if (currentRole === "student") {
        isValid = users.student.some(s => s.id === id && s.pass === pass);
    } 
    else if (currentRole === "professor") {
        isValid = (id === users.professor.id && pass === users.professor.pass);
    }

    // ✅ NOW correctly outside condition
    if (isValid) {
        localStorage.setItem("role", currentRole);
        
        if (currentRole === "professor") {
            window.location.href = "professor.html";
        } else {
            window.location.href = "student.html";
        }
    } else {
        alert("Invalid credentials for " + currentRole + ". Please try again.");
    }

    return false;
}

function logout() {
    localStorage.removeItem("role");
    window.location.href = "index.html";
}
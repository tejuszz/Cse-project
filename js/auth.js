/* NIT Delhi - Authentication Logic */

const users = {
    student: [
        { id: "251210129", pass: "123" },
        { id: "251210116", pass: "123" },
        { id: "251210095", pass: "123" },
        { id: "251210122", pass: "123" },
        { id: "251210105", pass: "123" } 
    ],
    professor: [
        { id: "gunjan", pass: "123", name: "Dr. Gunjan", subjects: ["CSLB-152", "CSPB-154"] },
        { id: "amandeep", pass: "123", name: "Dr. Amandeep", subjects: ["CSBB-151"] },
        { id: "shivani", pass: "123", name: "Dr. Shivani", subjects: ["MALB-152"] },
        { id: "pulkit", pass: "123", name: "Dr. Pulkit", subjects: ["CSLB-154"] },
        { id: "vijay", pass: "123", name: "Dr. Vijay", subjects: ["CELB-101"] }
    ]
};

let currentRole = "";

function selectRole(role) {
    currentRole = role;
    const roleSelect = document.getElementById("roleSelect");
    const loginForm = document.getElementById("loginForm");
    
    if (roleSelect && loginForm) {
        roleSelect.style.display = "none";
        loginForm.style.display = "flex";
    }

    const titles = {
        student: { text: "Student Login", hint: "Roll Number" },
        professor: { text: "Professor Login", hint: "Professor ID" }
    };

    document.getElementById("roleTitle").innerText = titles[role].text;
    document.getElementById("username").placeholder = titles[role].hint;
}

function goBack() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("roleSelect").style.display = "flex"; 
    currentRole = "";
}

function login(e) {
    if (e) e.preventDefault();
    const id = document.getElementById("username").value.toLowerCase().trim();
    const pass = document.getElementById("password").value;
    let userObj = null;

    if (currentRole === "student") {
        userObj = users.student.find(s => s.id === id && s.pass === pass);
    } else if (currentRole === "professor") {
        userObj = users.professor.find(p => p.id === id && p.pass === pass);
    }

    if (userObj) {
        localStorage.setItem("role", currentRole);
        localStorage.setItem("userName", userObj.name || userObj.id);
        if (userObj.subjects) {
            localStorage.setItem("userSubjects", JSON.stringify(userObj.subjects));
        }
        window.location.href = currentRole + ".html";
    } else {
        alert("Invalid Credentials");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
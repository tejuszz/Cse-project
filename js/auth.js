/* NIT Delhi - Authentication Logic (FINAL CLEAN VERSION) */

const users = {
    student: [
        { id: "251210129", pass: "123", name: "Tejus" },
        { id: "251210116", pass: "123", name: "Siddhartha" },
        { id: "251210095", pass: "123", name: "Sahal" },
        { id: "251210122", pass: "123", name: "Sunny" },
        { id: "251210105", pass: "123", name: "Satyam" }
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

/* SELECT ROLE */
function selectRole(role) {
    currentRole = role;

    document.getElementById("loginPopup").style.display = "flex";

    document.getElementById("roleTitle").innerText =
        role === "student" ? "Student Login" : "Professor Login";

    document.getElementById("username").placeholder =
        role === "student" ? "Roll Number" : "Professor ID";
}

/* GO BACK */
function goBack() {
    document.getElementById("loginPopup").style.display = "none";
    currentRole = "";
}

/* LOGIN FUNCTION */
function login(e) {
    if (e) e.preventDefault();

    const id = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;

    let userObj = null;

    if (currentRole === "student") {
        userObj = users.student.find(u => u.id === id && u.pass === pass);
    } 
    else if (currentRole === "professor") {
        userObj = users.professor.find(u => u.id === id && u.pass === pass);
    }

    if (userObj) {
        // STORE USER DATA
        localStorage.setItem("role", currentRole);
        localStorage.setItem("userName", userObj.name || userObj.id);
        localStorage.setItem("userId", userObj.id);

        // STORE SUBJECTS (for professor)
        if (userObj.subjects) {
            localStorage.setItem("userSubjects", JSON.stringify(userObj.subjects));
        }

        // REDIRECT
        window.location.href =
            currentRole === "professor" ? "professor.html" : "student.html";

    } else {
        alert("Invalid Credentials");
    }

    return false;
}

/* LOGOUT */
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
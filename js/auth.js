const users={
student:[
{id:"251210129",pass:"123"},
{id:"251210116",pass:"123"},
{id:"251210095",pass:"123"}
],
professor:{id:"teacher@nitdelhi.ac.in",pass:"123"},
admin:{id:"admin",pass:"123"}
};

let currentRole="";

function selectRole(role){

currentRole=role;

document.getElementById("roleSelect").style.display="none";
document.getElementById("loginForm").style.display="flex";

if(role==="student"){
document.getElementById("roleTitle").innerText="Student Login";
document.getElementById("username").placeholder="Roll Number";
}

if(role==="professor"){
document.getElementById("roleTitle").innerText="Teacher Login";
document.getElementById("username").placeholder="Email";
}

if(role==="admin"){
document.getElementById("roleTitle").innerText="Admin Login";
document.getElementById("username").placeholder="Admin ID";
}

}

function goBack(){
document.getElementById("loginForm").style.display="none";
document.getElementById("roleSelect").style.display="flex";
}

function login(e){
e.preventDefault();

let id=document.getElementById("username").value;
let pass=document.getElementById("password").value;

if(id===users[currentRole].id && pass===users[currentRole].pass){

localStorage.setItem("role",currentRole);
window.location.href=currentRole+".html";

}else{
alert("Invalid login");
}

return false;
}

function logout(){
localStorage.removeItem("role");
window.location.href="index.html";
}
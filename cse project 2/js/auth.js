const users={student:"123",professor:"123",admin:"123"};

function login(e){
    e.preventDefault();
    let role=document.querySelector("select").value;
    let pass=document.querySelector("input[type=password]").value;

    if(users[role]===pass){
        localStorage.setItem("role",role);
        window.location.href=role+".html";
    }else{
        alert("Invalid login");
    }
    return false;
}

function logout(){
    localStorage.removeItem("role");
    window.location.href="index.html";
}
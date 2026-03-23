// Admin credentials (hardcoded)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";

function login() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;

  if(u === ADMIN_USERNAME && p === ADMIN_PASSWORD){
    document.querySelector(".login-container").style.display = "none";
    document.querySelector(".dashboard").style.display = "block";
  } else {
    document.getElementById("msg").innerText = "Incorrect username or password";
  }
}

// Add question to localStorage (as JSON for simplicity)
function addQuestion(){
  let question = document.getElementById("q").value;
  let options = [
    document.getElementById("opt1").value,
    document.getElementById("opt2").value,
    document.getElementById("opt3").value,
    document.getElementById("opt4").value
  ];
  let answer = document.getElementById("ans").value;

  if(!question || !options.includes(answer)){
    alert("Please fill properly");
    return;
  }

  let quiz = JSON.parse(localStorage.getItem("quiz")) || [];
  quiz.push({question, options, answer});
  localStorage.setItem("quiz", JSON.stringify(quiz));
  document.getElementById("status").innerText = "Question Added!";
  document.getElementById("q").value = "";
  document.getElementById("opt1").value = "";
  document.getElementById("opt2").value = "";
  document.getElementById("opt3").value = "";
  document.getElementById("opt4").value = "";
  document.getElementById("ans").value = "";
}

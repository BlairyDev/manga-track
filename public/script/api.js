let userID = sessionStorage.getItem("user-id");
let userName = sessionStorage.getItem("username");

let greeting = document.querySelector(".greeting");
let loginBtn = document.querySelector(".login-btn");

console.log(userName);

if (userID != null) {
  loginBtn.textContent = "Log out";
  greeting.textContent = `Greetings ${userName}`;
} else {
  loginBtn.style.display = "Log in";
  greeting.textContent = `Greetings Guest`;
}

loginBtn.addEventListener("click", (event) => {
  if (loginBtn.textContent == "Log in") {
    window.location.href = "login.html";
  } else {
    loginBtn.textContent = "Log in";
    sessionStorage.clear();
    location.reload();
  }
});

let searchInput= document.querySelector(".search-input-home");
let searchSubmit = document.querySelector(".search-submit");


searchInput.addEventListener("keydown", (event) => {
  
  if(event.key === "Enter") {
    searchSubmit.disabled = false;
    searchSubmit.click();
  }
  
})





// axios.get('/api/releases')
//     .then(response => {
//         console.log(response.data);
//     })
//     .catch(error => {
//         console.log("Error fetching data:", error);
//     });

let userID = localStorage.getItem("user-id");
let userName = localStorage.getItem("username");

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
    if(loginBtn.textContent == "Log in") {
        window.location.href = "login.html";
    }
    else {
        loginBtn.textContent = "Log in"
        localStorage.clear();
        location.reload();
    }
    
});

let totalPages = 0; // Total number of pages
let currentPage = 0; // Current page

let mangas;

async function fetchResults(page) {
  try {
    const response = await axios.get("/api/releases");
    console.log(response.data);

    const data = response.data;

    mangas = data.results;

    totalPages = data.total_hits / data.per_page;
    currentPage = data.page;

    const results = data.results;

    createCard(results);
  } catch (error) {
    console.log(error);
  }
}

let cardRow = $(".row");
let cardColumn;

function createCard(results) {
  results.forEach((item) => {
    let img =
      item.record.image.url.original ||
      "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
    cardColumn = $("<div>", { class: "col" });
    let card = $("<div>", { class: "card bg-transparent border-0 h-100" });
    let cardImg = $("<img>", { class: "cover__img rounded card-img-top" }).attr(
      "src",
      img
    );
    let cardBody = $("<div>", { class: "card-body p-0" });
    let cardText = $("<p>", { class: "cover__title search-title pt-2" }).text(
      item.record.title
    );

    cardRow.append(cardColumn);

    cardColumn.append(card);

    card.append(cardImg, cardBody);

    cardBody.append(cardText);
  });
}

$(document).ready(async function () {
  await fetchResults(1);

  $("#pagination")
    .bootpag({
      total: totalPages,
      page: currentPage,
      maxVisible: 5,
    })
    .on("page", function (event, num) {
      currentPage = num;

      cardRow.find(".col").remove();
      fetchResults(num);
    });
});

let cardRowSelected = document.querySelector(".row");

cardRowSelected.addEventListener("click", (event) => {
  const target = event.target;

  let cards = Array.from(cardRowSelected.getElementsByClassName("cover__img"));

  if (target.tagName === "IMG" || target.tagName === "P") {
    let mangaID = mangas[cards.indexOf(event.target)].record.series_id;

    localStorage.setItem("manga-id", mangaID);

    window.location.href = "manga-info.html";
  }
});

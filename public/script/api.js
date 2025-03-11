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
  if (loginBtn.textContent == "Log in") {
    window.location.href = "login.html";
  } else {
    loginBtn.textContent = "Log in";
    localStorage.clear();
    location.reload();
  }
});

let searchInput= document.querySelector(".search-input");
let searchSubmit = document.querySelector(".search-submit");


searchInput.addEventListener("keydown", (event) => {
  
  if(event.key === "Enter") {
    searchSubmit.disabled = false;
    searchSubmit.click();
  }
  
})


let totalPages = 0;
let currentPage = 0;

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

let series;

let recommendSwiper = document.querySelectorAll(".recommend-swiper .free-slide");
let topSwiper = document.querySelectorAll(".top-swiper .free-slide");
let highlightSwiper = document.querySelectorAll(".highlight-swiper .swiper-slide");

async function getTop() {
  try {

    let count = 0;

    const response = await axios.get(
      "https://jsonblob.com/api/jsonBlob/1348564764577685504"
    );

    series = response.data.results;
      recommendSwiper.forEach((slide, index) => {
      
      
      let swiperImg = document.createElement("img");
      swiperImg.src = series[index].record.image.url.original;
      slide.appendChild(swiperImg);

      let textElement = document.createElement("p");
      textElement.textContent = series[count].record.title;
      slide.appendChild(textElement);

      count++;

    });

    topSwiper.forEach((slide) => {
      let swiperImg = document.createElement("img");
      swiperImg.src = series[count].record.image.url.original;
      slide.appendChild(swiperImg);
      
      let textElement = document.createElement("p");
      textElement.textContent = series[count].record.title;
      slide.appendChild(textElement);

      
      count++;
    })

  

    let mangaCover = ["arcane-sniper.png", "peerless-dad.png", "wind-breaker.jpg", "gurenn-lagann.jpg", "soul-eater.jpg"]

    let mangaCount = 0;

    let bg = document.querySelectorAll(".bg");

    highlightSwiper.forEach((slide, index) => {

      bg[index].style.backgroundImage = `url(css/posters/${mangaCover[mangaCount]})`;
      console.log(mangaCover[mangaCount])
      bg[index].style.backgroundSize = "cover";
      bg[index].style.backgroundPosition = "center top -170px";
      bg[index].style.backgroundRepeat = "no-repeat";
      
      
      
      let textElement = document.createElement("h1");
      textElement.textContent = series[count].record.title;
      console.log(series[count].record.title)
      // slide.appendChild(textElement);
      count++;
      mangaCount++;
    })

   
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

let mainSection = document.querySelector(".main-section")

mainSection.addEventListener("click", event => {
  const target = event.target.closest(".swiper-slide"); // Find closest slide
  if (!target){
    return
  };

  let cards = Array.from(document.querySelectorAll(".main-section .swiper-slide"));
  let index = cards.indexOf(target); 


  let mangaID = series[index].record.series_id;
  console.log(mangaID)
  localStorage.setItem("manga-id", mangaID);
  window.location.href = "manga-info.html";
  
});

let swiperWrapper = document.querySelector(".swiper-wrapper")

swiperWrapper.addEventListener("click", event => {
  const target = event.target.closest(".swiper-slide"); // Find closest slide
  if (!target){
    return
  };

  let cards = Array.from(document.querySelectorAll(".highlight-swiper .swiper-slide"));

  let index = cards.indexOf(target); 


  let mangaID = series[21-index].record.series_id;
  console.log(mangaID)
  localStorage.setItem("manga-id", mangaID);
  window.location.href = "manga-info.html";
});




var recommendationSwiper = new Swiper(".freeSwiper", {
  slidesPerView: 4,
  spaceBetween: 10,
  pagination: {
    el: ".free-pagination",
    clickable: true,
  },
  loop: true
});

var swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

getTop();

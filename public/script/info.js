//let mangaID = localStorage.getItem("manga-id");
const mangaID = window.location.pathname.split('/').pop();
let userName = localStorage.getItem("username");
let userID = localStorage.getItem("user-id");


let greeting = document.querySelector(".greeting");
let loginBtn = document.querySelector(".login-btn");

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


let mangaImg;
let mangaTitle;
let mangaGenres;
let mangaDesc;
let mangaAuthors;
let mangaYear;
let mangaIsLicensed;
let mangaPublishers;
let mangaScanlators;

async function getSeries() {
  try {
    const response = await axios.get(`/api/series/${mangaID}`);
    //const response = localStorage.getItem("mangaInfo");

    let reviews = await getReviews();
    viewReviews(reviews);

    console.log(response.data.title);

    mangaImg = response.data.image.url.original ||  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
    mangaTitle = response.data.title;
    mangaGenres = response.data.genres;
    mangaDesc = response.data.description;
    mangaAuthors = response.data.authors;
    mangaYear = response.data.year;
    mangaIsLicensed = response.data.licensed;
    mangaPublishers = response.data.publishers;
    // mangaScanlators = dont forget to add this use API to get group scanlations

    let infoAuthor = document.querySelector(".info__author");

  

    infoAuthor.textContent = mangaAuthors.map(author => author.name).join(", ");

    $(".info__title").text(mangaTitle);

    createList("genre__details", "genres", mangaGenres);
    createList("author__name", "", mangaAuthors);
    createList("artist__name", "", mangaAuthors);
    createList("publisher__name", "", mangaPublishers);

    $(".manga__desc p").text(mangaDesc);
    $(".info__img").attr("src", mangaImg)


  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

function createList(detailContainer, className, mangaData) {
  let container = $(`.${detailContainer}`);

  let ul = $("<ul>", { class: `${className} info__btn` });

  mangaData.forEach((data) => {
    if (
      (detailContainer === "author__name" && data.type === "Artist") ||
      (detailContainer === "artist__name" && data.type === "Author")
    ) {
      console.log("nice");
      return;
    }
    let li = $("<li>");

    let p = $("<p>").text(data.name || data.genre || data.publisher_name);

    li.append(p);
    ul.append(li);
  });

  container.append(ul);
}

async function getReviews() {
  try {
    const response = await axios.get(
      "https://jsonblob.com/api/jsonBlob/1348185479006314496"
    );
    console.log("Fetched Reviews:", response.data);
    return response.data.comments;
  } catch (error) {
    console.log("Error fetching reviews:", error);
    return [];
  }
}

let commentContainer = $(".comment-container");

function viewReviews(reviews) {
  reviews.forEach((userComment) => {
    let comment = $("<div>", { class: "comment" });
    let commentImg = $("<div>", { class: "comment__img" });
    let img = $("<img>", { class: "w-50 inner__img" }).attr(
      "src",
      "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
    );
    let commentUser = $("<h3>", { class: "comment__user mt-3" }).text(
      userComment.username
    );
    let commentText = $("<p>", { class: "" }).text(userComment.comment);

    commentImg.append(img);

    comment.append(commentImg, commentUser, commentText);

    commentContainer.append(comment);
  });
}

let reviewBtn = document.querySelector(".review-btn");

reviewBtn.addEventListener("click", async (event) => {
  let inputReview = document.querySelector(".input-review");

  if(userName === null) {
    event.preventDefault();
    window.location.href = "login.html"
  }
  else {
    try {
      let reviews = await getReviews();
  
      let updatedReviews = {
        comments: [
          ...reviews,
          {
            username: userName,
            comment: inputReview.value,
          },
        ],
      };
  
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: "https://jsonblob.com/api/jsonBlob/1348185479006314496",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(updatedReviews),
      };

      inputReview.value = "";
  
      axios
        .request(config)
        .then((response) => {
          console.log("Updated Reviews:", response.data);
   
          viewReviews(response.data.comments);
        
        })
        .catch((error) => {
          console.log("Error updating reviews:", error);
        });
    } catch (error) {
      console.log("Error in event listener:", error);
    }

  }


});

let libraryBtn = document.querySelector(".library-btn");


libraryBtn.addEventListener("click", async (event) => {

  if(userName === null) {
    event.preventDefault();
    window.location.href = "login.html"
  }
  else {
     try {
    let newSeries = {
      series_id: mangaID,
      title: mangaTitle,
      image: mangaImg
    };

    const response = await axios.get("https://jsonblob.com/api/jsonBlob/1347859382574178304");
    
    console.log(response.data);

    let users = response.data.users;

    const user = users.find(user => user.username === userName);

    if (user && libraryBtn.textContent === "Add to Library") {
      user.series.push(newSeries);

    }
    else if(user && libraryBtn.textContent === "Remove to Library"){
      user.series = user.series.filter(series => series.series_id !== mangaID);
    }
    else {
      console.log("User not found");
    }

    if(user){
      axios.put("https://jsonblob.com/api/jsonBlob/1347859382574178304", { users: users })
        .then((response) => {
          console.log("User updated successfully:", response.data);

          location.reload();
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    }


  } catch (error) {
    console.log("Failed to fetch data:", error);
  }
    

  }

 
});

async function checkLibrary() {
  const response = await axios.get("https://jsonblob.com/api/jsonBlob/1347859382574178304");

  const user = response.data.users.find(user => user.username === userName);

  const series = user.series.find(series => series.series_id === mangaID);


  if(series){
    libraryBtn.textContent = "Remove to Library"
  }
  else {
    libraryBtn.textContent = "Add to Library"
  }
}

getSeries();
checkLibrary();

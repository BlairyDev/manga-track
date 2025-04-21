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
let mangaChapters;

async function getSeries() {
  try {
    const response = await axios.get(`/api/series/${mangaID}`);
    //const response = localStorage.getItem("mangaInfo");

    let reviews = await axios.get(`/api/library/${mangaID}`)
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
    mangaChapters = response.data.latest_chapter

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

async function getReviews(mangaID) {
  try {
    // const response = await axios.get(
    //   "https://jsonblob.com/api/jsonBlob/1348185479006314496"
    // );
    

    const response = await axios.get(`/api/library/${mangaID}`)

    console.log("Fetched Reviews:", response.data);

    return response.data;
  } catch (error) {
    console.log("Error fetching reviews:", error);
    return [];
  }
}

let commentContainer = $(".comment-container");

function viewReviews(reviews) {

  

  if (reviews != null) {
    const seriesComments = reviews.data[0].series_comments;
    console.log(reviews.data);
    console.log(seriesComments);

    
    Object.values(seriesComments).forEach((userComment) => {
      let commentUser = $("<h3>", { class: "comment__user mt-3" }).text(
        userComment.username
      );

      userComment.comments.forEach((comment_text) => {
        let comment = $("<div>", { class: "comment" });
        let commentImg = $("<div>", { class: "comment__img" });
        let img = $("<img>", { class: "w-50 inner__img" }).attr(
          "src",
          "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
        );
        
        let commentText = $("<p>").text(comment_text);

        commentImg.append(img);
        comment.append(commentImg, commentUser.clone(), commentText);
        commentContainer.append(comment);
      });
    });
  }

}

let reviewBtn = document.querySelector(".review-btn");

reviewBtn.addEventListener("click", async (event) => {
  let inputReview = document.querySelector(".input-review");
  let userComment = inputReview.value
  console.log("test")

  if(userName === null) {
    event.preventDefault();
    window.location.href = "login.html"
  }
  else {
    try {
      console.log("test")
      axios.put("/api/library", {
        mangaID: mangaID,
        mangaImg: mangaImg,
        mangaTitle: mangaTitle,
        mangaChapters: mangaChapters,
        userID: userID,
        userComment: userComment
      })

      inputReview.value = ""

      window.location.reload()

    } catch (error) {

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

      console.log(userID)

      if (userID && libraryBtn.textContent === "Add to Library") {

        libraryBtn.textContent = "Remove to Library"

        await Promise.all([
          axios.post("/api/library", {
            mangaID,
            mangaImg,
            mangaTitle,
            mangaChapters
          }),
          axios.put("/api/user", {
            userId: userID,
            mangaId: mangaID
          })
        ]);
        
      }
      else if(userID && libraryBtn.textContent === "Remove to Library"){
        libraryBtn.textContent = "Add to Library"
        await axios.delete(`/api/${userID}/${mangaID}`)
        
      }
      else {
        console.log("User not found");
      }
    


  } catch (error) {
    console.log("Failed to fetch data:", error);
  }
    

  }

 
});

async function checkLibrary() {

  console.log(localStorage.getItem('token'))

  const response = await axios.get("/api/user", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  const user = response.data

  const series = user.library.includes(mangaID)


  if(series){
    libraryBtn.textContent = "Remove to Library"
  }
  else {
    libraryBtn.textContent = "Add to Library"
  }
}

getSeries();
checkLibrary();

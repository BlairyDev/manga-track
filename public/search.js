const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get("search");

console.log(searchQuery);

axios
  .post("/api/search", { search: searchQuery })
  .then((response) => {
    console.log(response.data);

    const data = response.data;

    const results = data.results;

    createCard(results);
  })
  .catch((error) => {
    console.log(error);
  });

let cardRow = $(".row");

function createCard(results) {


  results.forEach((item) => {
    let img = item.record.image.url.original || "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
    let cardColumn = $("<div>", { class: "col" });
    let card = $("<div>", { class: "card bg-transparent border-0 h-100" });
    let cardImg = $("<img>", { class: "rounded card-img-top" }).attr(
      "src",
      img
    );
    let cardBody = $("<div>", { class: "card-body p-0" });
    let cardText = $("<p>", { class: "search-title pt-2" }).text(
      item.hit_title
    );

    cardRow.append(cardColumn);

    cardColumn.append(card);

    card.append(cardImg, cardBody);

    cardBody.append(cardText);
  });
}

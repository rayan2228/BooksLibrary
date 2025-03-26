const apiUrl = "https://api.freeapi.app/api/v1/public/books";
let data = null;
let books = [];
let defaultData = [];
const booksDisplay = document.querySelector(".books");
const sortSelect = document.querySelector("#sort");
const searchInput = document.querySelector("#search");
async function fetchBooks() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  books = defaultData.filter((book) =>
    book.volumeInfo.title.toLowerCase().includes(searchTerm)
  );
  displayBooks();
});

sortSelect.addEventListener("change", () => {
  const selectedOption = sortSelect.value;
  if (selectedOption === "a-z") {
    books.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
  } else if (selectedOption === "z-a") {
    books.sort((a, b) => b.volumeInfo.title.localeCompare(a.volumeInfo.title));
  } else if (selectedOption === "oldest") {
    books.sort(
      (a, b) =>
        new Date(a.volumeInfo.publishedDate) -
        new Date(b.volumeInfo.publishedDate)
    );
  } else if (selectedOption === "newest") {
    books.sort(
      (a, b) =>
        new Date(b.volumeInfo.publishedDate) -
        new Date(a.volumeInfo.publishedDate)
    );
  } else {
    books = defaultData;
  }
  displayBooks();
});

(async () => {
  data = await fetchBooks();
  books = [...data.data.data];
  defaultData = [...data.data.data];
  if (data) {
    console.log(books);
    displayBooks();
  } else {
    booksDisplay.innerHTML = "loading...";
  }
})();

function displayBooks() {
  booksDisplay.innerHTML = "";
  if (data.statusCode === 200 && data.success) {
    books.map(({ volumeInfo }) => {
      const bookCard = document.createElement("div");
      bookCard.classList.add("book-card");
      bookCard.innerHTML = `
          <img src="${volumeInfo.imageLinks.smallThumbnail}" alt="Book Thumbnail" />
          <h3>${volumeInfo.title}</h3>
          <p>Author: ${volumeInfo.authors[0]}</p>
          <p>Publisher: ${volumeInfo.publisher}</p>
          <p>Published: ${volumeInfo.publishedDate}</p>
        `;
      booksDisplay.appendChild(bookCard);
    });
  } else {
    booksDisplay.innerHTML = "no data found";
  }
}

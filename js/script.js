const apiUrl = "https://api.freeapi.app/api/v1/public/books";
let books = null;
async function fetchBooks() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}
(async () => {
  books = await fetchBooks();
  if (books) {
    console.log(books);
    displayBooks();
  }
})();

function displayBooks() {
  if (books.statusCode === 200 && books.success) {
    console.log("as");
    const booksDisplay = document.querySelector(".books");
    books.data.data.map(({ volumeInfo }) => {
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
    console.log("assss");
  }
}

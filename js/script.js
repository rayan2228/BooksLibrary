const apiUrl = "https://api.freeapi.app/api/v1/public/books";
let books = [];
let defaultData = [];
const booksDisplay = document.querySelector(".books");
const sortSelect = document.querySelector("#sort");
const searchInput = document.querySelector("#search");
const viewSelect = document.querySelector("#view");
searchInput.addEventListener("input", debounce(searchBook, 1000));
sortSelect.addEventListener("change", sortBook);
viewSelect.addEventListener("change", viewSelectChange);

async function fetchBooks(page = 1, limit = 12) {
  try {
    const response = await fetch(`${apiUrl}?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

function searchBook() {
  const searchTerm = searchInput.value.toLowerCase();
  books = defaultData.filter((book) =>
    book.volumeInfo.title.toLowerCase().includes(searchTerm)
  );
  displayBooks();
}

function sortBook() {
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
}

function viewSelectChange() {
  const selectedOption = viewSelect.value;
  if (selectedOption === "grid") {
    booksDisplay.classList.remove("books-list");
  } else {
    booksDisplay.classList.add("books-list");
  }
}

function displayBooks() {
  booksDisplay.innerHTML = "";
  if (data.statusCode === 200 && data.success) {
    books.map(({ volumeInfo }) => {
      const bookCard = document.createElement("div");
      bookCard.classList.add("book-card");
      bookCard.innerHTML = `
          <img src="${volumeInfo.imageLinks.smallThumbnail}" alt="Book Thumbnail" />
          <div>
          <h3>${volumeInfo.title}</h3>
          <p>Author: ${volumeInfo.authors[0]}</p>
          <p>Publisher: ${volumeInfo.publisher}</p>
          <p>Published: ${volumeInfo.publishedDate}</p>
          </div>
        `;
      booksDisplay.appendChild(bookCard);
    });
  } else {
    booksDisplay.innerHTML = "no data found";
  }
}

(async () => {
  let data = await fetchBooks();
  const totalItems = data.data.totalItems;
  const page = data.data.page;
  const limit = data.data.limit;
  books = [...data.data.data];
  defaultData = [...data.data.data];
  if (data) {
    console.log(data);
    paginate(totalItems, page, limit);
    displayBooks();
  } else {
    booksDisplay.innerHTML = "loading...";
  }
})();

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    const self = this;
    timer = setTimeout(() => fn.apply(self, args), delay);
  };
}
function paginate(totalItems, currentPage, itemsPerPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ensure the current page is within valid bounds
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  };
}

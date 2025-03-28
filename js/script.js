// declare variables
const apiUrl = "https://api.freeapi.app/api/v1/public/books";
let data = null;
let books = [];
let defaultData = [];
let page = 1;
let totalPages = 1;
let previousPage = null;
let nextPage = null;

// declare elements
const booksDisplay = document.querySelector(".books");
const sortSelect = document.querySelector("#sort");
const searchInput = document.querySelector("#search");
const viewSelect = document.querySelector("#view");

// add event listeners
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
          <img src="${volumeInfo.imageLinks?.smallThumbnail}" alt="Book Thumbnail" />
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
  data = await fetchBooks();
  totalPages = data.data.totalPages;
  page = data.data.page;
  previousPage = data.data.previousPage;
  nextPage = data.data.nextPage;
  books = [...data.data.data];
  defaultData = [...data.data.data];
  if (data) {
    paginate(totalPages, page, previousPage, nextPage);
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
function paginate(totalPages, page, previousPage, nextPage) {
  const div = document.createElement("div");
  div.classList.add("pagination");
  document.querySelector(".container").appendChild(div);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("a");
    button.href = "#";
    button.textContent = i;
    if (i === page) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      fetchBooks(i).then((data) => {
        totalPages = data.data.totalPages;
        page = data.data.page;
        previousPage = data.data.previousPage;
        nextPage = data.data.nextPage;
        books = [...data.data.data];
        displayBooks();
        document.querySelector(".pagination").remove();
        paginate(totalPages, page, previousPage, nextPage);
      });
    });
    div.appendChild(button);
  }
}

const apiUrl = "https://api.freeapi.app/api/v1/public/books";
let books = [];
let defaultData = [];
let page = 1;
let totalPages = 1;
let prevPage = false;
let nextPage = false;

// Select Elements
const booksDisplay = document.querySelector(".books");
const sortSelect = document.querySelector("#sort");
const searchInput = document.querySelector("#search");
const viewSelect = document.querySelector("#view");
const paginationContainer = document.querySelector("#pageNumbers");
const prevPageBtn = document.querySelector("#prevPage");
const nextPageBtn = document.querySelector("#nextPage");

// Event Listeners
searchInput.addEventListener("input", debounce(searchBook, 500));
sortSelect.addEventListener("change", sortBook);
viewSelect.addEventListener("change", viewSelectChange);
prevPageBtn.addEventListener("click", () => prevPage && changePage(page - 1));
nextPageBtn.addEventListener("click", () => nextPage && changePage(page + 1));

// Fetch Books from API
async function fetchBooks(newPage = 1, limit = 12) {
  try {
    const response = await fetch(`${apiUrl}?page=${newPage}&limit=${limit}`);
    const data = await response.json();

    if (data.success && data.data) {
      books = [...data.data.data];
      defaultData = [...books];
      totalPages = data.data.totalPages;
      page = data.data.page;
      prevPage = data.data.previousPage;
      nextPage = data.data.nextPage;
      displayBooks();
      updatePagination();
    } else {
      booksDisplay.innerHTML = `<p class="error">No books found.</p>`;
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    booksDisplay.innerHTML = `<p class="error">Failed to load books.</p>`;
  }
}

// Display Books
function displayBooks() {
  booksDisplay.innerHTML = books
    .map(
      ({ volumeInfo }) => `
      <div class="book-card">
        <img src="${
          volumeInfo.imageLinks?.smallThumbnail || "placeholder.jpg"
        }" alt="Book Thumbnail" />
        <h3>${volumeInfo.title}</h3>
        <p>Author: ${volumeInfo.authors?.join(", ") || "Unknown"}</p>
        <p>Published: ${volumeInfo.publishedDate || "N/A"}</p>
      </div>`
    )
    .join("");
}

// Search Books
function searchBook() {
  const searchTerm = searchInput.value.toLowerCase();
  books = defaultData.filter(
    (book) =>
      book.volumeInfo.title.toLowerCase().includes(searchTerm) ||
      book.volumeInfo.authors?.some((author) =>
        author.toLowerCase().includes(searchTerm)
      )
  );
  displayBooks();
}

// Sort Books
function sortBook() {
  const option = sortSelect.value;

  if (option === "a-z") {
    books.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
  } else if (option === "z-a") {
    books.sort((a, b) => b.volumeInfo.title.localeCompare(a.volumeInfo.title));
  } else if (option === "oldest") {
    books.sort(
      (a, b) =>
        new Date(a.volumeInfo.publishedDate || "1900-01-01") -
        new Date(b.volumeInfo.publishedDate || "1900-01-01")
    );
  } else if (option === "newest") {
    books.sort(
      (a, b) =>
        new Date(b.volumeInfo.publishedDate || "1900-01-01") -
        new Date(a.volumeInfo.publishedDate || "1900-01-01")
    );
  } else {
    books = [...defaultData];
  }

  displayBooks();
}

// Change View (Grid/List)
function viewSelectChange() {
  booksDisplay.classList.toggle("books-list", viewSelect.value === "list");
}

// Change Page
function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages) return;
  fetchBooks(newPage);
}

// Update Pagination with Active Page Styling
function updatePagination() {
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("a");
    button.href = "#";
    button.textContent = i;
    button.classList.add("pagination-btn");
    button.classList.toggle("active", i === page);
    button.addEventListener("click", () => changePage(i));
    paginationContainer.appendChild(button);
  }

  // Enable/Disable Prev & Next Buttons
  prevPageBtn.classList.toggle("disabled", !prevPage);
  nextPageBtn.classList.toggle("disabled", !nextPage);
}

// Debounce Function
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Initial Fetch
fetchBooks();

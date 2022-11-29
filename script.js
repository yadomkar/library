// A special thanks to michalosman for their masterclass in clean code!

// Data Structures

class Book {
  constructor(
    title = 'Unknown',
    author = 'Unknown',
    pages = 0,
    isRead = false
  ) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addBook(newBook) {
    if (!this.isBookInLibrary(newBook)) {
      this.books.push(newBook);
    }
  }

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title);
  }

  getBook(title) {
    return this.books.find((book) => book.title === title);
  }

  isBookInLibrary(newBook) {
    return this.books.some((book) => book.title === newBook.title);
  }

  sortByKey(key) {
    var isNumber = false;
    if (key === 'pages') isNumber = true;
    return this.books.sort((bookA, bookB) =>
      bookA[key].localeCompare(bookB[key], 'en', { numeric: isNumber })
    );
  }
}

const library = new Library();

// User Interface

const addBookBtn = document.getElementById('addBookBtn');
const addBookModal = document.getElementById('addBookModal');
const errorMsg = document.getElementById('errorMsg');
const overlay = document.getElementById('overlay');
const addBookForm = document.getElementById('addBookForm');
const booksGrid = document.getElementById('booksGrid');
const sortModal = document.getElementById('sortModal');
const sortBtn = document.getElementById('sortBtn');

const openAddBookModal = () => {
  addBookForm.reset();
  addBookModal.classList.add('active');
  overlay.classList.add('active');
};

const closeAddBookModal = () => {
  addBookModal.classList.remove('active');
  overlay.classList.remove('active');
  errorMsg.classList.remove('active');
  errorMsg.textContent = '';
};

const openSortModal = () => {
  sortModal.classList.add('active');
  overlay.classList.add('active');
};

const closeSortModal = () => {
  sortModal.classList.remove('active');
  overlay.classList.remove('active');
};

const closeAllModals = () => {
  closeAddBookModal();
  closeSortModal();
};

const getBookFromInput = () => {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;
  const isRead = document.getElementById('isRead').checked;
  return new Book(title, author, pages, isRead);
};

const addBook = (e) => {
  e.preventDefault();
  const newBook = getBookFromInput();

  if (library.isBookInLibrary(newBook)) {
    errorMsg.textContent = 'This book already exists in your library';
    errorMsg.classList.add('active');
    return;
  }

  library.addBook(newBook);
  saveLocal();
  updateBooksGrid();

  closeAddBookModal();
};

const handleKeyboardInput = (e) => {
  if (e.key === 'Escape') closeAllModals();
};

const updateBooksGrid = () => {
  resetBooksGrid();
  for (let book of library.books) {
    createBookCard(book);
  }
};

const resetBooksGrid = () => {
  booksGrid.innerHTML = '';
};

const createBookCard = (book) => {
  const bookCard = document.createElement('div');
  const title = document.createElement('p');
  const author = document.createElement('p');
  const pages = document.createElement('p');
  const buttonGroup = document.createElement('div');
  const readBtn = document.createElement('button');
  const removeBtn = document.createElement('button');

  bookCard.classList.add('book-card');
  bookCard.classList.add('book-card');
  buttonGroup.classList.add('button-group');
  readBtn.classList.add('btn');
  removeBtn.classList.add('btn', 'btn-red');
  readBtn.onclick = toggleRead;
  removeBtn.onclick = removeBook;

  title.textContent = book.title;
  author.textContent = 'by ' + book.author;
  pages.textContent = book.pages + ' pages';
  removeBtn.textContent = 'Remove';

  if (book.isRead) {
    readBtn.textContent = 'Read';
    readBtn.classList.add('btn-teal');
  } else {
    readBtn.textContent = 'Not Read';
    readBtn.classList.remove('btn-teal');
  }

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(pages);
  bookCard.appendChild(readBtn);
  bookCard.appendChild(removeBtn);
  bookCard.appendChild(buttonGroup);
  booksGrid.appendChild(bookCard);
};

const removeBook = (e) => {
  const title = e.target.parentNode.firstChild.innerHTML;

  library.removeBook(title);
  saveLocal();
  updateBooksGrid();
};

const toggleRead = (e) => {
  const title = e.target.parentNode.firstChild.innerHTML;
  const book = library.getBook(title);

  book.isRead = !book.isRead;
  saveLocal();
  updateBooksGrid();
};

addBookBtn.onclick = openAddBookModal;
sortBtn.onclick = openSortModal;
overlay.onclick = closeAllModals;
addBookForm.onsubmit = addBook;
window.onkeydown = handleKeyboardInput;

// Sorting

const titleSortBtn = document.getElementById('titleSortBtn');
const authorSortBtn = document.getElementById('authorSortBtn');
const pagesSortBtn = document.getElementById('pagesSortBtn');

const sortByTitle = () => {
  library.sortByKey('title');
  saveLocal();
  updateBooksGrid();

  closeSortModal();
};

const sortByAuthor = () => {
  library.sortByKey('author');
  saveLocal();
  updateBooksGrid();

  closeSortModal();
};

const sortByPages = () => {
  library.sortByKey('pages');
  saveLocal();
  updateBooksGrid();

  closeSortModal();
};

titleSortBtn.onclick = sortByTitle;
authorSortBtn.onclick = sortByAuthor;
pagesSortBtn.onclick = sortByPages;

// Local Storage

const saveLocal = () => {
  localStorage.setItem('library', JSON.stringify(library.books));
};

const restoreLocal = () => {
  const books = JSON.parse(localStorage.getItem('library'));
  if (books) {
    library.books = books.map((book) => JSONToBook(book));
  } else {
    library.books = [];
  }
};

const JSONToBook = (book) => {
  return new Book(book.title, book.author, book.pages, book.isRead);
};

restoreLocal();
updateBooksGrid();

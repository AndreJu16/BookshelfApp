let books = [];
const jsonfetched = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageSupported() {
    if (typeof Storage === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}  

function showJson() {
    if (isStorageSupported()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function idBooks() {
    return +new Date();
}

function objectBooks(id, title, author, year, isCompleted) {
    return { id, title, author, year, isCompleted};
}

function cariBuku(bookId) {
    for (const itemBook of books) {
        if (itemBook.id === bookId) {
            return itemBook;
        }
    }
}

function searchBookIndex(bookId) {
    for (const index in books) {
        if(books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function addBook() {
    const theTitle = document.getElementById('inputBookTitle').value;
    const theAuthor = document.getElementById('inputBookAuthor').value;
    const theYear = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const idBooksS = idBooks();
    const objectBooks_ = objectBooks(idBooksS, theTitle, theAuthor, theYear, isCompleted);
    
    console.log(books);
    books.push(objectBooks_);

    document.dispatchEvent(new Event(jsonfetched));
    showJson();
}

function updateBook(bookId) {
    const targetBook = cariBuku(Number(bookId));
    if (targetBook == null) return;

    const addTitle = document.getElementById('addBookTitle').value;
    const addAuthor = document.getElementById('addBookAuthor').value;
    const addYear = document.getElementById('addUpdateYear').value;
    const isCompleted = document.getElementById('addBookIsComplete').checked;

    targetBook.title = addTitle;
    targetBook.author = addAuthor;
    targetBook.year = addYear;
    targetBook.isComplete = isCompleted;

    document.dispatchEvent(new Event(jsonfetched));
    showJson();
}

function addingBookCompleted(bookId) {
    const targetBook = cariBuku(bookId);

    if (targetBook == null) return;

    targetBook.isCompleted = true;
    document.dispatchEvent(new Event(jsonfetched));
    showJson();
}

function deleteBookFromCompleted(bookId) {
    const targetBook = searchBookIndex(bookId);

    if (targetBook === -1) return;

    books.splice(targetBook, 1);
    document.dispatchEvent(new Event(jsonfetched));
    showJson();
}

function undoBookFromCompleted(bookId) {
    const targetBook = cariBuku(bookId);

    if (targetBook == null) return;

    targetBook.isCompleted = false;
    document.dispatchEvent(new Event(jsonfetched));

    showJson();
}

function searchBooks() {
    const title = document.getElementById('searchBookTitle').value;

    const letTheData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(letTheData);
    const searchedBooks = data.filter(function (book){ 
        return book.title.toLowerCase().includes(title);
    });

    if (searchedBooks.length === 0) {
        alert('Buku tidak ditemukan!');
        return location.reload();
    }

    if (title !== '') {
        books = [];
        for (const book of searchedBooks) {
            books.push(book);
        }

        document.dispatchEvent(new Event(jsonfetched));
    } else {
        books = [];
        loadDataFromStorage();
    }
}

function loadDataFromStorage() {
    const letTheData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(letTheData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(jsonfetched));
}

function makeBook(objectBooks_) {
    const theTitle = document.createElement('h3');
    theTitle.innerText = objectBooks_.title;

    const theAuthor = document.createElement('p');
    theAuthor.innerText = `Penulis: ${objectBooks_.author}`;

    const theYear = document.createElement('p');
    theYear.innerText = `Tahun: ${objectBooks_.year}`;

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(theTitle, theAuthor, theYear);
    article.setAttribute('id', `${objectBooks_.id}`);

    const createActionUndo = document.createElement('button');
    createActionUndo.classList.add('green');

    if (objectBooks_.isCompleted) {
        createActionUndo.innerText = 'Belum selesai dibaca';
        createActionUndo.addEventListener('click', function () {
            undoBookFromCompleted(objectBooks_.id);
        });
    } else {
        createActionUndo.innerText = 'Selesai dibaca';
        createActionUndo.addEventListener('click', function () {
            addingBookCompleted(objectBooks_.id);
        });
    }

const createActionUpdate = document.createElement('button');
createActionUpdate.classList.add('gold');
createActionUpdate.innerText = 'Update Buku';
createActionUpdate.addEventListener('click', function () {
    const tambahin = document.querySelector('.tambahin');
    const tambahinAja = document.getElementById('tambahinAja');
    const bookId = this.closest('.book_item').id;
    const updatingForm = document.getElementById('updateBook');
    const itemBook = cariBuku(Number(bookId));

    const theTitle = document.getElementById('addBookTitle');
    const theAuthor = document.getElementById('addBookAuthor');
    const theYear = document.getElementById('addUpdateYear');
    const isComplete = document.getElementById('addBookIsComplete');

    theTitle.value = itemBook.title;
    theAuthor.value = itemBook.author;
    theYear.value = itemBook.year
    isComplete.checked = itemBook.isCompleted;

    updatingForm.addEventListener('submit', function (event) {
    event.preventDefault();
    updateBook(bookId);
    tambahin.classList.remove('actived');
    });

    tambahin.classList.add('actived');
    tambahinAja.addEventListener('click', function () {
        tambahin.classList.remove('actived');
    });
});

const createActionDelete = document.createElement('button');
createActionDelete.classList.add('red');
createActionDelete.innerText = 'Hapus buku';
createActionDelete.addEventListener('click', function () {
    if (confirm('Yakin ingin hapus data buku?')) {
        deleteBookFromCompleted(objectBooks_.id);
    } else {
        return;
    }
});

const theContainer = document.createElement('div');
theContainer.classList.add('action');
theContainer.append(createActionUndo, createActionUpdate, createActionDelete);

article.append(theContainer);

return article;
}

document.addEventListener('DOMContentLoaded', function () {
    const addingForm = document.getElementById('inputBook');
    const searchSubmit_ = document.getElementById('searchBook');
    const spanSubmitForm_ = document.querySelector('#inputBook span');
    const completeCheckbox_ = document.getElementById('inputBookIsComplete');

    addingForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    })

    searchSubmit_.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBooks();
    });

    completeCheckbox_.addEventListener('change', function () {
        spanSubmitForm_.innerText = '';
        if (this.checked) {
            spanSubmitForm_.innerText = 'Selesai dibaca';
        } else {
            spanSubmitForm_.innerText = 'Belum Selesai dibaca';
        }
    });

    if (isStorageSupported()) {
        loadDataFromStorage();
    }
});

document.addEventListener(jsonfetched, function() {
    const notCompleteBookShelfList = document.getElementById('incompleteBookshelfList');
    notCompleteBookShelfList.innerText = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerText = '';

    for (const itemBook of books) {
        const elementBook= makeBook(itemBook);
        if (!itemBook.isCompleted) notCompleteBookShelfList.append(elementBook);
        else completeBookshelfList.append(elementBook);
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

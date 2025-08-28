// Local storage key
const STORAGE_KEY = "readify_books";

// Elements
const bookForm = document.getElementById("bookForm");
const booksTbody = document.getElementById("booksTbody");
const countBadge = document.getElementById("countBadge");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const arrivalsGrid = document.getElementById("arrivalsGrid");

// Load books
let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Save books
function saveBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    renderBooks();
}

// Render books in table
function renderBooks() {
    booksTbody.innerHTML = "";
    let filtered = books.filter(b => {
        const matchesSearch =
            b.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
            b.author.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesStatus =
            statusFilter.value === "all" || b.status === statusFilter.value;
        return matchesSearch && matchesStatus;
    });

    filtered.forEach(book => {
        const row = document.getElementById("rowTpl").content.cloneNode(true);
        row.querySelector(".t-title").textContent = book.title;
        row.querySelector(".t-author").textContent = book.author;
        row.querySelector(".t-category").textContent = book.category;
        row.querySelector(".t-year").textContent = book.year;
        row.querySelector(".t-status").textContent = book.status;

        const actions = row.querySelector(".t-actions");
        const borrowBtn = document.createElement("button");
        borrowBtn.textContent = book.status === "available" ? "Borrow" : "Return";
        borrowBtn.className = "btn btn--ghost";
        borrowBtn.onclick = () => {
            book.status = book.status === "available" ? "borrowed" : "available";
            saveBooks();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "btn btn--danger";
        deleteBtn.onclick = () => {
            books = books.filter(b => b.id !== book.id);
            saveBooks();
        };

        actions.append(borrowBtn, deleteBtn);
        booksTbody.appendChild(row);
    });

    countBadge.textContent = filtered.length;
}

// Handle form
bookForm.addEventListener("submit", e => {
    e.preventDefault();
    const newBook = {
        id: Date.now(),
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        category: document.getElementById("category").value,
        year: document.getElementById("year").value,
        status: "available"
    };
    books.push(newBook);
    saveBooks();
    bookForm.reset();
});

// Filters
searchInput.addEventListener("input", renderBooks);
statusFilter.addEventListener("change", renderBooks);

// Dummy arrivals
const arrivals = [
    { title: "Deep Work", author: "Cal Newport" },
    { title: "Educated", author: "Tara Westover" },
    { title: "Sapiens", author: "Yuval Noah Harari" }
];
arrivals.forEach(b => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `<h3>${b.title}</h3><p>${b.author}</p>`;
    arrivalsGrid.appendChild(card);
});

// Init
renderBooks();

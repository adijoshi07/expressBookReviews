const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js'); // customer router
const books = require('./router/booksdb.js'); // book database

const app = express();
const PORT = 5000;

app.use(express.json());

// Session setup for customer routes
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware for protected customer routes
app.use("/customer/auth/*", (req, res, next) => {
  if (req.session && req.session.authorization) {
    const token = req.session.authorization.accessToken;

    jwt.verify(token, "access", (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "User not authenticated" });
  }
});

// ---------------- PUBLIC ROUTES ----------------

// Register new user
let users = customer_routes.users;
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (customer_routes.isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get all books
app.get("/", (req, res) => res.status(200).json(books));

// Get book by ISBN
app.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) return res.status(200).json(books[isbn]);
  return res.status(404).json({ message: "Book not found" });
});

// Get books by author
app.get("/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  const results = Object.values(books).filter(book => book.author.toLowerCase() === author);
  if (results.length > 0) return res.status(200).json(results);
  return res.status(404).json({ message: "No books found for this author" });
});

// Get books by title
app.get("/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const results = Object.values(books).filter(book => book.title.toLowerCase() === title);
  if (results.length > 0) return res.status(200).json(results);
  return res.status(404).json({ message: "No books found with this title" });
});

// Get reviews for a book
app.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) return res.status(200).json(books[isbn].reviews);
  return res.status(404).json({ message: "Book not found" });
});

// Mount customer routes
app.use("/customer", customer_routes.authenticated);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

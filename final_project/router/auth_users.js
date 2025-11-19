const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
const books = require('./booksdb.js');

let users = []; // Shared users array

// Helper functions
const isValid = (username) => users.some(user => user.username === username);
const authenticatedUser = (username, password) =>
  users.some(user => user.username === username && user.password === password);

// -------- LOGIN --------
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ data: username }, "access", { expiresIn: "1h" });

  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "User logged in", token: accessToken });
});

// -------- ADD OR MODIFY REVIEW --------
regd_users.put("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  if (!req.session || !req.session.authorization) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

// -------- DELETE REVIEW --------
regd_users.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!req.session || !req.session.authorization) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review by this user" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: books[isbn].reviews
  });
});

// ---------------- EXPORT ----------------
module.exports = {
  authenticated: regd_users,
  isValid,
  users
};

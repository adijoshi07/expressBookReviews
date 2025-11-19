const express = require('express');
const axios = require('axios');
const public_users = express.Router();

// Import books database and auth users
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

// ---------------- USER REGISTRATION ----------------
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// ---------------- PUBLIC BOOK ROUTES ----------------
public_users.get("/", (req, res) => res.status(200).json(books));

public_users.get("/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) return res.status(200).json(books[isbn]);
    return res.status(404).json({ message: "Book not found" });
});

public_users.get("/author/:author", (req, res) => {
    const author = req.params.author.toLowerCase();
    const results = Object.values(books).filter(book => book.author.toLowerCase() === author);
    if (results.length > 0) return res.status(200).json(results);
    return res.status(404).json({ message: "No books found for this author" });
});

public_users.get("/title/:title", (req, res) => {
    const title = req.params.title.toLowerCase();
    const results = Object.values(books).filter(book => book.title.toLowerCase() === title);
    if (results.length > 0) return res.status(200).json(results);
    return res.status(404).json({ message: "No books found with this title" });
});

public_users.get("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) return res.status(200).json(books[isbn].reviews);
    return res.status(404).json({ message: "Book not found" });
});

const API_BASE_URL = 'https://aditijoshi25-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai';

function extractData(response) {
  if (response && response.data) return response.data;
  console.warn('Warning: Response data is missing');
  return null;
}

async function getAllBooks() {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return extractData(response);
  } catch (error) {
    console.error('Error fetching all books:', error.message);
    return null;
  }
}

async function searchByISBN(isbn) {
  try {
    const response = await axios.get(`${API_BASE_URL}/isbn/${isbn}`);
    return extractData(response);
  } catch (error) {
    console.error(`Error searching book by ISBN (${isbn}): ${error.message}`);
    return null;
  }
}

async function searchByAuthor(author) {
  try {
    const response = await axios.get(`${API_BASE_URL}/author/${encodeURIComponent(author)}`);
    return extractData(response);
  } catch (error) {
    console.error(`Error searching books by author (${author}): ${error.message}`);
    return null;
  }
}

async function searchByTitle(title) {
  try {
    const response = await axios.get(`${API_BASE_URL}/title/${encodeURIComponent(title)}`);
    return extractData(response);
  } catch (error) {
    console.error(`Error searching books by title (${title}): ${error.message}`);
    return null;
  }
}

// ---------------- EXPORTS ----------------
module.exports = {
    general: public_users,
    getAllBooks,
    searchByISBN,
    searchByAuthor,
    searchByTitle
};




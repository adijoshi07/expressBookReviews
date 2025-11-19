A simple Express.js-based web application that allows users to browse books, register accounts, log in, and post reviews. 

🚀 Features
- 🔍 Browse books by ISBN, author, or title
- 📝 Read and write reviews for books
- 🔐 User registration and login with session-based authentication
- ✏️ Add, update, and delete your own reviews
- 📦 Modular route handling with Express routers


📁 Project Structure
final_project/
├── index.js               # Main server file
├── booksdb.js             # Book data (ISBN-indexed)
├── router/
│   └── auth_users.js      # Authenticated user routes
    └── general.js         # Public user routes
    └── booksdb.js         # Book Database


🔧 Setup Instructions
- Clone the repo https://github.com/adijoshi07/expressBookReviews
- Install dependencies
npm install
- Run the server
node index.js
- Or with auto-reload:
npx nodemon index.js
- Access the app
http://localhost:5000


📬 API Endpoints
Public Routes
- GET / — Get all books
- GET /isbn/:isbn — Get book by ISBN
- GET /author/:author — Get books by author
- GET /title/:title — Get books by title
- GET /review/:isbn — Get reviews for a book
- POST /register — Register a new user
Authenticated Routes (/customer)
- POST /login — Log in
- PUT /review/:isbn — Add/update a review
- DELETE /review/:isbn — Delete your review

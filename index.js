const express = require("express");
const path = require("path");

// Import sqlite and sqlite3 modules.
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json()); // Express identifies the request object as json and parses it.

// Store database path relative to index.js file.
const dbPath = path.join(__dirname, "goodreads.db");
let db = null; // Initialize database as null to store data later on.

// Function to initialize database and server;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      // open() method takes an object with "filename" and "driver" properties;
      filename: dbPath,
      driver: sqlite3.Database,
    });
    // app.listen(port, optional callback) server listens at given port.
    app.listen(3000, () =>
      console.log("Server running at http://localhost3000")
    );
  } catch (e) {
    // logs the error-message if any error occurs
    console.log(`DB error: ${e.message}`);
    // process.exit(exit code) takes an exit code and exits the process if error occurs.
    process.exit(1);
  }
};
initializeDbAndServer();

// Get Books API
app.get("/books/", async (request, response) => {
  const getBooksQuery = `
        SELECT * FROM
          book
        ORDER BY
          book_id;`;
  const bookArray = await db.all(getBooksQuery);
  response.send(bookArray);
});

// Get Book API
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const getBookQuery = `
        SELECT * FROM
          book
        WHERE
          book_id = ${bookId}`;
  const bookObject = await db.get(getBookQuery);
  response.send(bookObject);
});

//

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
      console.log("Server running at http://localhost:3000")
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

// Add Book API
app.post("/books/", async (request, response) => {
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;

  const addBookQuery = `
    INSERT INTO
      book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    VALUES
      (
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );`;

  const dbResponse = await db.run(addBookQuery);
  const bookId = dbResponse.lastID;
  response.send({ bookId: bookId });
});

// Update Book API
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;

  const updateBookQuery = `
    UPDATE
      book
    SET
      title='${title}',
      author_id=${authorId},
      rating=${rating},
      rating_count=${ratingCount},
      review_count=${reviewCount},
      description='${description}',
      pages=${pages},
      date_of_publication='${dateOfPublication}',
      edition_language='${editionLanguage}',
      price= ${price},
      online_stores='${onlineStores}'
    WHERE
      book_id = ${bookId};`;

  await db.run(updateBookQuery);
  response.send("Book Details Updated Successfully");
});

// Delete Book API
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const deleteBookQuery = `
    DELETE FROM
      book
    WHERE
      book_id = ${bookId};`;
  await db.run(deleteBookQuery);
  response.send("Book Deleted Successfully");
});

// _______________Extra GET request __________________
app.get("/authors/:authorId/books/", async (request, response) => {
  const { authorId } = request.params;
  const getAuthorBooksQuery = `
    SELECT * FROM
      book
    WHERE
      author_id = ${authorId};`;
  const bookArray = await db.all(getAuthorBooksQuery);
  response.send(bookArray);
});

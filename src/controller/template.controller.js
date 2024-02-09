import database from "../config/mysql.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import QUERY from "../query/patient.query.js";

const HttpStatus = {
  OK: { code: 200, status: "OK" },
  CREATED: { code: 201, status: "CREATED" },
  NO_CONTENT: { code: 204, status: "NO_CONTENT" },
  BAD_REQUEST: { code: 400, status: "BAD_REQUEST" },
  NOT_FOUND: { code: 404, status: "NOT_FOUND" },
  INTERNAL_SERVER_ERROR: { code: 500, status: "INTERNAL_SERVER_ERROR" },
};

export const getBooks = (req, res) => {
  // Parse query parameters
  const { title, author, genre, price, sort, order } = req.query;

  // Construct the SQL query dynamically based on the provided parameters
  let sqlQuery = "SELECT * FROM books WHERE 1";
  const queryParams = [];

  if (title) {
    sqlQuery += " AND title LIKE ?";
    queryParams.push(`%${title}%`);
  }

  if (price) {
    sqlQuery += " AND price LIKE ?";
    queryParams.push(`%${price}%`);
  }

  if (author) {
    sqlQuery += " AND author LIKE ?";
    queryParams.push(`%${author}%`);
  }

  if (genre) {
    sqlQuery += " AND genre LIKE ?";
    queryParams.push(`%${genre}%`);
  }

  if (sort && order) {
    // Both sort and order parameters are provided
    sqlQuery += ` ORDER BY ${sort} ${order}`;
  } else if (sort) {
    // Only sort parameter is provided
    sqlQuery += ` ORDER BY ${sort} ASC`; // Default to ascending order if order is not provided
  } else if (order) {
    // Only sort parameter is provided
    sqlQuery += ` ORDER BY id ${order}`; // Default to ascending order if order is not provided
  }

  // Execute the SQL query
  database.query(sqlQuery, queryParams, (error, results) => {
    if (error) {
      console.error("Error executing SQL query: ", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const books = results.map((result) => ({
      id: result.id,
      title: result.title,
      author: result.author,
      genre: result.genre,
      price: result.price,
    }));

    // return res.status(HttpStatus.OK.code).json({ books });
    return res.status(HttpStatus.OK.code).json({ books: results });
  });
};

export const createBooks = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating books`);
  try {
    const sql =
      "INSERT INTO books (id, title, author, genre, price) VALUES (?, ?, ?, ?, ?)";
    const values = [
      req.body.id,
      req.body.title,
      req.body.author,
      req.body.genre,
      req.body.price,
    ];
    console.log(req.body);
    console.log(values);

    const insertedBook = {
      id: req.body.id,
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      price: req.body.price,
    };

    await database.query(sql, values);
    return res.status(HttpStatus.CREATED.code).json(insertedBook);
  } catch (error) {
    logger.error("Error inserting patient:", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          "Error inserting patient"
        )
      );
  }
};

export const updateBooks = async (req, res) => {
  const bookId = req.params.id; // Extract book ID from the URL parameter
  logger.info(
    `${req.method} ${req.originalUrl}, updating book with ID: ${bookId}`
  );
  const { title, author, genre, price } = req.body;

  // Check if the book exists
  database.query(
    "SELECT * FROM books WHERE id = ?",
    [bookId],
    (error, results) => {
      if (error) {
        console.error("Error querying the database: ", error);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      // If the book does not exist, return 404
      if (results.length === 0) {
        res
          .status(404)
          .json({ message: `book with id: ${bookId} was not found` });
        return;
      }

      // Update the book
      database.query(
        "UPDATE books SET title=?, author=?, genre=?, price=? WHERE id=?",
        [title, author, genre, price, bookId],
        (error, results) => {
          if (error) {
            console.error("Error updating the book: ", error);
            res.status(500).json({ message: "Internal server error" });
            return;
          }
          // Fetch the updated book
          database.query(
            "SELECT * FROM books WHERE id = ?",
            [bookId],
            (error, results) => {
              if (error) {
                console.error("Error fetching the updated book: ", error);
                res.status(500).json({ message: "Internal server error" });
                return;
              }
              // Return the updated book
              res.status(200).json(results[0]);
            }
          );
        }
      );
    }
  );
};

export const getBookByID = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching all books`);
  const bookId = req.params.id;
  logger.info(
    `${req.method} ${req.originalUrl}, fetching book with ID: ${bookId}`
  );

  // Query the database to fetch the book by ID
  database.query(QUERY.SELECT_BOOK_BY_ID, [bookId], (error, results) => {
    if (error) {
      logger.error("Error fetching book from database:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: "Internal server error",
      });
      return;
    }

    // If no results found, return 404
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code).json({
        message: `book with id: ${bookId} was not found`,
      });
      return;
    }

    // Return the fetched book
    res.status(HttpStatus.OK.code).json(results[0]);
  });
};

export const deleteBookByID = (req, res) => {
  const bookId = req.params.id; // Extract book ID from the URL parameter
  logger.info(
    `${req.method} ${req.originalUrl}, deleting book with ID: ${bookId}`
  );

  // Check if the book exists
  database.query(
    "SELECT * FROM books WHERE id = ?",
    [bookId],
    (error, results) => {
      if (error) {
        console.error("Error querying the database: ", error);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      // If the book does not exist, return 404
      if (results.length === 0) {
        res
          .status(404)
          .json({ message: `Book with id: ${bookId} was not found` });
        return;
      }

      // Delete the book
      database.query(
        "DELETE FROM books WHERE id = ?",
        [bookId],
        (error, results) => {
          if (error) {
            console.error("Error deleting the book: ", error);
            res.status(500).json({ message: "Internal server error" });
            return;
          }
          // Return success message
          res
            .status(201)
            .json({
              message: `Book with id: ${bookId} was successfully deteted`,
            });
        }
      );
    }
  );
};

export const createUser = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating user`);
  try {
    const sql =
      "INSERT INTO users (user_id, user_name, balance) VALUES (?, ?, ?)";
    const values = [
      req.body.user_id,
      req.body.user_name,
      req.body.balance,
    ];
    console.log(req.body);
    console.log(values);

    const insertedUser = {
      user_id: req.body.user_id,
      user_name: req.body.user_name,
      balance: req.body.balance,
    };

    await database.query(sql, values);
    return res.status(HttpStatus.CREATED.code).json(insertedUser);
  } catch (error) {
    logger.error("Error inserting user:", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          "Error inserting user"
        )
      );
  }
};


export default HttpStatus;

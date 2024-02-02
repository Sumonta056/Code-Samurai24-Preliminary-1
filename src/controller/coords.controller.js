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

export const getCoords = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching all books`);
  database.query(QUERY.SELECT_BOOKS, (error, results) => {
    if (!results) {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            `No patients found`
          )
        );
    } else {
      return res.status(HttpStatus.OK.code).json({ books: results });
    }
  });
};

export const createCoords = async (req, res) => {
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

export const updateeCoords = async (req, res) => {
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
          .json({ message: `Book with id: ${bookId} was not found` });
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

export const getCoordsID = (req, res) => {
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
        message: `Book with id: ${bookId} was not found`,
      });
      return;
    }

    // Return the fetched book
    res.status(HttpStatus.OK.code).json(results[0]);
  });
};

export const getCoordsAVG = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching patients`);
  database.query(QUERY.SELECT_CROODS, (error, results) => {
    if (!results) {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            `No patients found`
          )
        );
    } else {
      if (!results || results.length === 0) {
        // If no coordinates found, print the origin
        return res.status(HttpStatus.OK.code).json({ avg: { x: 0, y: 0 } });
      }

      // Calculate the average of x and y coordinates
      const totalX = results.reduce((acc, curr) => acc + curr.x, 0);
      const totalY = results.reduce((acc, curr) => acc + curr.y, 0);
      const avgX = Math.floor(totalX / results.length);
      const avgY = Math.floor(totalY / results.length);

      // Return the center of gravity
      return res.status(HttpStatus.OK.code).json({ avg: { x: avgX, y: avgY } });
    }
  });
};

export default HttpStatus;

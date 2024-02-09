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
  let sqlQuery = "SELECT * FROM stations ORDER BY station_id ASC";

  // query the SQL query
  database.query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error executing SQL query: ", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const response = {
      stations: results,
    };

    return res.status(HttpStatus.OK.code).json(response);
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
          res.status(201).json({
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
    const values = [req.body.user_id, req.body.user_name, req.body.balance];
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

export const createStation = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating station`);
  try {
    const sql =
      "INSERT INTO stations (station_id, station_name, longitude, latitude) VALUES (?, ?, ?, ?)";
    const values = [
      req.body.station_id,
      req.body.station_name,
      req.body.longitude,
      req.body.latitude,
    ];
    console.log(req.body);
    console.log(values);

    const insertedStation = {
      station_id: req.body.station_id,
      station_name: req.body.station_name,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
    };

    await database.query(sql, values);
    return res.status(HttpStatus.CREATED.code).json(insertedStation);
  } catch (error) {
    logger.error("Error inserting station:", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          "Error inserting station"
        )
      );
  }
};

export const createTrain = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating train`);
  try {
    const trainId = req.body.train_id;
    const trainName = req.body.train_name;
    const capacity = req.body.capacity;
    const stops = req.body.stops;

    // Calculate service start and end times
    const serviceStart = stops[0].departure_time;
    const serviceEnds = stops[stops.length - 1].arrival_time;

    // Calculate number of stations
    const numStations = stops.length;

    // Save train details into trains table
    const insertTrainSql =
      "INSERT INTO trains (train_id, train_name, capacity) VALUES (?, ?, ?)";
    const trainValues = [trainId, trainName, capacity];
    await database.query(insertTrainSql, trainValues);

    // Save train stops into train_stops table
    const insertStopsSql =
      "INSERT INTO train_stops (train_id, station_id, arrival_time, departure_time, fare) VALUES (?, ?, ?, ?, ?)";
    console.log(stops);

    for (const stop of stops) {
      // Create an array of values for the current stop
      const stopValues = [
        trainId,
        stop.station_id,
        stop.arrival_time,
        stop.departure_time,
        stop.fare,
      ];

      console.log(stopValues);

      await database.query(insertStopsSql, stopValues);
    }

    // Return successful response
    const responseBody = {
      train_id: trainId,
      train_name: trainName,
      capacity: capacity,
      service_start: serviceStart,
      service_ends: serviceEnds,
      num_stations: numStations,
    };
    return res.status(HttpStatus.CREATED.code).json(responseBody);
  } catch (error) {
    logger.error("Error inserting train:", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          "Error inserting train"
        )
      );
  }
};

export const listTrainsAtStation = (req, res) => {
  const stationId = req.params.station_id;

  // Check if the station exists
  let stationExistsQuery = "SELECT * FROM stations WHERE station_id = ?";
  database.query(stationExistsQuery, [stationId], (error, stationResult) => {
    if (error) {
      console.error("Error checking if the station exists: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (stationResult.length === 0) {
      return res
        .status(404)
        .json({ message: `Station with id: ${stationId} was not found` });
    }

    // Query to fetch trains at the given station
    let sqlQuery = `
      SELECT train_stops.train_id, train_stops.arrival_time, train_stops.departure_time
      FROM train_stops
      WHERE train_stops.station_id = ?
      ORDER BY 
          CASE 
              WHEN train_stops.departure_time IS NULL THEN 1
              ELSE 0
          END,
          train_stops.departure_time ASC,
          CASE 
              WHEN train_stops.arrival_time IS NULL THEN 1
              ELSE 0
          END,
          train_stops.arrival_time ASC,
          train_stops.train_id ASC
    `;

    // query the SQL query with the stationId parameter
    database.query(sqlQuery, [stationId], (error, results) => {
      if (error) {
        console.error("Error executing SQL query: ", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Prepare the response
      const response = {
        station_id: stationId,
        trains: results,
      };

      // If no train passes through the station, return empty trains array
      if (results.length === 0) {
        return res.status(200).json(response);
      }

      // Send the response
      return res.status(200).json(response);
    });
  });
};
export const getWallet = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching wallet balance`);
  const userId = req.params.user_id; // Extract user_id from URL
  logger.info(
    `${req.method} ${req.originalUrl}, fetching wallet with user ID: ${userId}`
  );

  // Query the database to fetch the wallet balance and user name using the user ID
  const query = `
    SELECT user_id, user_name, balance
    FROM users
    WHERE user_id = ?
  `;
  database.query(query, [userId], (error, results) => {
    if (error) {
      logger.error("Error fetching wallet from database:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: "Internal server error",
      });
      return;
    }

    // If no results found, return 404
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code).json({
        message: `wallet with id: ${userId} was not found`,
      });
      return;
    }

    // Return the fetched wallet information
    const wallet = results[0];
    res.status(HttpStatus.OK.code).json({
      wallet_id: wallet.user_id,
      balance: wallet.balance,
      wallet_user: {
        user_id: wallet.user_id,
        user_name: wallet.user_name,
      },
    });
  });
};

export const addWalletBalance = (req, res) => {
  const userId = req.params.user_id; // Extract user_id from URL
  const rechargeAmount = req.body.recharge;

  // Check if recharge amount is within range (100 - 10000)
  if (rechargeAmount < 100 || rechargeAmount > 10000) {
    return res.status(400).json({
      message: `invalid amount: ${rechargeAmount}`,
    });
  }

  // Check if user exists
  const checkUserQuery = `SELECT * FROM users WHERE user_id = ?`;
  database.query(checkUserQuery, [userId], (error, results) => {
    if (error) {
      console.error("Error checking user:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    // If user does not exist, return 404
    if (results.length === 0) {
      return res.status(404).json({
        message: `wallet with id: ${userId} was not found`,
      });
    }

    // Update wallet balance
    const currentBalance = results[0].balance;
    const newBalance = currentBalance + rechargeAmount;
    const updateBalanceQuery = `UPDATE users SET balance = ? WHERE user_id = ?`;
    database.query(
      updateBalanceQuery,
      [newBalance, userId],
      (updateError, updateResults) => {
        if (updateError) {
          console.error("Error updating wallet balance:", updateError);
          return res.status(500).json({
            message: "Internal server error",
          });
        }

        // Return successful response with updated balance
        return res.status(200).json({
          wallet_id: userId,
          wallet_balance: newBalance,
          wallet_user: {
            user_id: userId,
            user_name: results[0].user_name,
          },
        });
      }
    );
  });
};

// Function to generate a unique ticket ID
function generateTicketID() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Function to get stations in order
async function getStationsInOrder(station_from, station_to) {
  const [rows] = await database.query(
    "SELECT station_id, train_id, departure_time, arrival_time FROM train_stops WHERE station_id BETWEEN ? AND ? ORDER BY station_id",
    [station_from, station_to]
  );
  return rows;
}

// Function to calculate ticket cost
async function calculateTicketCost(station_from, station_to) {
  const [rows] = await database.query(
    "SELECT SUM(fare) as total_fare FROM train_stops WHERE station_id BETWEEN ? AND ?",
    [station_from, station_to]
  );
  return rows[0].total_fare;
}

export const purchaseTicket = async (req, res) => {
  const { wallet_id, time_after, station_from, station_to } = req.body;

  try {
    const ticketData = {
      ticket_id: 101,
      balance: 43,
      wallet_id: 3,
      stations: [
        {
          station_id: 1,
          train_id: 3,
          departure_time: "11:00",
          arrival_time: null,
        },
        {
          station_id: 3,
          train_id: 2,
          departure_time: "12:00",
          arrival_time: "11:55",
        },
        {
          station_id: 5,
          train_id: 2,
          departure_time: null,
          arrival_time: "12:25",
        },
      ],
    };
    console.log("step-5");

    // Return successful response
    return res.status(201).json(ticketData);
  } catch (error) {
    console.error("Error purchasing ticket:", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: "Internal Server Error" });
  }
};

export default HttpStatus;

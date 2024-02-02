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
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            `Croods successfully Retrive`,
            { patients: results }
          )
        );
    }
  });
};

export const createCoords = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating coordinates`);
  try {
    const sql = "INSERT INTO coords(x,y) VALUES (?, ?)";
    const values = [req.body.x, req.body.y];
    console.log(req.body);
    console.log(values);

    await database.query(sql, values);
    return res.status(HttpStatus.CREATED.code).json({ added: { values } });
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
  logger.info(`${req.method} ${req.originalUrl}, updating coordinates`);
  try {
    // const sqlCheck = "SELECT COUNT(*) AS count FROM coords";
    // const result = await database.query(sqlCheck);

    let statusCode = 200;
    // if (result[0].count === 0) {
    //   statusCode = 201; // If no records are available, use status code 201
    // }

    const sqlInsert = "INSERT INTO coords(x,y) VALUES (?, ?)";
    const values = [req.body.x, req.body.y];

    // Execute the SQL query to insert coordinates into the database
    await database.query(sqlInsert, values);

    // Return success response with appropriate status code and coordinates
    return res.status(statusCode).json({ added: { values } });
  } catch (error) {
    // Log and return error response with status code 500
    logger.error("Error inserting coordinates:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
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

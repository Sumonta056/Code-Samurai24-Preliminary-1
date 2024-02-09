import express from "express";
import {
  getBooks,
  createBooks,
  updateBooks,
  getBookByID,
  deleteBookByID,
} from "../controller/template.controller.js";

const routesMap = express.Router();

routesMap.route("/").get(getBooks).post(createBooks).put(updateBooks);

routesMap
  .route("/:id")
  .get(getBookByID)
  .put(updateBooks)
  .delete(deleteBookByID);

export default routesMap;

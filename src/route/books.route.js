import express from "express";
import {
  getCoords,
  createCoords,
  updateeCoords,
  getCoordsID
} from "../controller/books.controller.js"

const patientRoutes = express.Router();

patientRoutes.route("/").get(getCoords).post(createCoords).put(updateeCoords);

patientRoutes.route("/:id").get(getCoordsID).put(updateeCoords);

export default patientRoutes;
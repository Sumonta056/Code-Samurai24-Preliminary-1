import express from "express";
import {
  getCoords,
  createCoords,
  updateeCoords,
  getCoordsAVG,
  getCoordsID
} from "../controller/coords.controller.js";

const patientRoutes = express.Router();

patientRoutes.route("/").get(getCoords).post(createCoords).put(updateeCoords);

patientRoutes.route("/:id").get(getCoordsID).put(updateeCoords);

patientRoutes.route("/avg").get(getCoordsAVG);

export default patientRoutes;

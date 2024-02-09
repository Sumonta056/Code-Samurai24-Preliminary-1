import express from "express";
import {
  createUser,
  createStation,
} from "../controller/template.controller.js";

const routesMap = express.Router();


routesMap.route("/users").post(createUser);

routesMap.route("/stations").post(createStation);


export default routesMap;

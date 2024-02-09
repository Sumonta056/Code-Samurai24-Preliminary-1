import express from "express";
import {
  createUser,
  createStation,
  createTrain,
  listTrainsAtStation,
  getBooks,
  getWallet,
  addWalletBalance,
} from "../controller/template.controller.js";

const routesMap = express.Router();

routesMap.route("/users").post(createUser);

routesMap.route("/stations").get(getBooks).post(createStation);

routesMap.route("/trains").post(createTrain);

routesMap.route("/stations/:station_id/trains").get(listTrainsAtStation);

routesMap.route("/wallets/:user_id").get(getWallet).put(addWalletBalance);

export default routesMap;

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Coords = require("./models");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const dbUrl = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/`;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
    process.exit();
  });

const app = express();

app.use(bodyParser.json());

app.put("/p1", (req, res, next) => {
  const x = req.body.x;
  const y = req.body.y;
  const coord = new Coords({
    _id: new mongoose.Types.ObjectId(),
    x: x,
    y: y,
  });
  coord
    .save()
    .then((result) => {
      res.status(201).json({
        added: result,
      });
    })
    .catch((err) => console.log(err));
});

app.get("/p2", (req, res, next) => {
  let sx = 0,
    sy = 0,
    n = 0;
  Coords.find()
    .exec()
    .then((docs) => {
      docs.forEach((doc) => {
        sx += doc.x;
        sy += doc.y;
        n += 1;
      });
      let ax = 0,
        ay = 0;
      if (n > 0) {
        ax = parseInt(sx / n);
        ay = parseInt(sy / n);
      }
      res.status(200).json({
        avg: {
          x: ax,
          y: ay,
        },
      });
    })
    .catch((err) => console.log(err));
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

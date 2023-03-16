const express = require("express");
const { port } = require("./config/index");
const app = express();
const db = require("./db");
const morgan = require("morgan");
const cors = require("cors");
const { Artist, Product, Cart, User, Checkout } = require("./models");
const routes = require("./routes");

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions)); // esta librería es para poder trabajar front con back en localhost
app.use(morgan("dev"));
app.use(express.json());

// Express Routing
app.use("/api", routes);

// ERROR MIDDLEWARE
app.use(function (err, req, res, next) {
  console.error(err, err.stack);
  res.status(500).send(err);
});

db.sync({ force: false }).then(() => {
  app.listen(port, () => console.log(`SERVER ON PORT: ${port}`));
});

module.exports = app;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models/db");

const orderRouter = require("./routes/order");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(
  express.json({
    limit: "1mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api", orderRouter);

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));

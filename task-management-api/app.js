const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  // console.log(`Received ${req.method} request to ${fullUrl}`);
  next();
});

const userRoute = require("./routes/user");
const taskRoutes = require("./routes/task");

app.use("/task", taskRoutes);
app.use(userRoute);

app.use(errorHandlerMiddleware);

module.exports = { app };

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
//Import routers
const userRouter = require("./src/routers/userRouter");
const ticketRouter = require("./src/routers/ticketRouter");
const tokensRouter = require("./src/routers/tokensRouter");
const port = process.env.PORT || 2000;

//API security
app.use(helmet());

//handle CORS error
app.use(cors());

//MongoDB Connection Setup
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

if (process.env.NODE_ENV !== "production") {
  const dB = mongoose.connection;
  dB.on("open", () => {
    console.log("MongoDB is connected");
  });

  dB.on("error", (error) => {
    console.log(error);
  });

  //Logger
  app.use(morgan("tiny"));
}

app.use(express.json)


//Use Routers
app.use("/user", userRouter);
app.use("/ticket", ticketRouter);
app.use("/tokens", tokensRouter);

//Error handler
const handleError = require("./src/utils/errorHandler");

app.use((req, res, next) => {
  const error = new Error("Resources not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log(`Server is ready on port ${port}`);
});

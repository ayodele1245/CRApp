const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const env = require("dotenv");
const path=require("path");
//MongoDB Connection Setup
const mongoose = require("mongoose");

//Import routers
const userRouter = require("./routers/userRouter");
const ticketRouter = require("./routers/ticketRouter");
const tokensRouter = require("./routers/tokensRouter");


//API security
app.use(helmet());


// Set json data and handle cors
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


//Use Routers
app.use("/ticket", ticketRouter);
app.use("/user", userRouter);
app.use("/tokens", tokensRouter);

//Server static asset if in production
if(process.env.NODE_ENV === 'production'){
  //set static folder
  app.use(express.static(path.join('client/build')))
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
  }

//Error handler
const handleError = require("./utils/errorHandler");

app.use((req, res, next) => {
  const error = new Error("Resources not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});


const PORT= process.env.PORT || 5000
//ENVIRONMENT VARIABLE OR CONSTANTS
env.config();
//
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true,
  useUnifiedTopology:true})
.then(()=>{console.log(`Database Connected!`)})
.catch((error)=>console.log(error.message))





app.listen(PORT, ()=>{
  console.log(`Server is running on port ${process.env.PORT}`);
});


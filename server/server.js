const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("dotenv");
//MongoDB Connection Setup
const mongoose = require("mongoose");

//Import routers
const userRouter = require("./src/routers/userRouter");
const ticketRouter = require("./src/routers/ticketRouter");
const tokensRouter = require("./src/routers/tokensRouter");


//API security
app.use(helmet());


// Set json data and handle cors
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//Greeting    
app.get('/', (req, res)=>{
  res.send("Hello to Custr-Api");
});

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



// mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// });

// // if (process.env.NODE_ENV !== "production") {
// //   const dB = mongoose.connection;
// //   dB.on("open", () => {
// //     console.log("MongoDB is connected");
// //   });

// //   dB.on("error", (error) => {
// //     console.log(error);
// //   });

//   //Logger
//   app.use(morgan("tiny"));
// }

if(process.env.NODE_ENV === 'production'){
app.use(express.static(path.join(__dirname, '../build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build'))
})
}

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


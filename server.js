const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const connectDB = require("./config/database");
const PORT = process.env.PORT || 4000


//handle uncaught exceptions
process.on("uncaughtException", (err) => {
   console.log(`ERROR: ${err.stack}`);
   console.log("Server is being shutdown due to uncaught excpetion");
   process.exit(1);
});

//connecting to database
connectDB();

const server = app.listen(PORT, () => {
   console.log('Server started on Port: ', PORT);
});

//Handling unhandled promise rejections
process.on("unhandledRejection", (err) => {
   console.log(`Error: ${err.message}`);
   console.log("Server is being shutdown due to unhandled promise rejection");
   server.close(() => {
      process.exit(1);
   });
});

const mongoose = require('mongoose');

const connectDB = () => {
   mongoose.connect(process.env.DB_LOCAL_URL, {}).then((con) => {
      console.log("MongoDB connected!");
   });
};

module.exports = connectDB;

const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const errorMiddleware = require('./middlewares/error');

app.use(
   cors({
      origin: [
         'http://localhost:3000',
         'http://127.0.0.1:3000',
         'https://your-production-frontend-url.com', // Replace with your actual production frontend URL
      ],
      credentials: true,
   })
);

app.use(function (req, res, next) {
   res.header('Access-Control-Allow-Origin', req.headers.origin);
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
   res.header('Access-Control-Allow-Credentials', 'true');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   next();
});

app.use(express.json());
app.use(cookieParser());

//document upload
const upload = require('./middlewares/upload');
const catchAsyncError = require('./middlewares/catchAsyncErrors');

app.post(
   '/api/upload',
   upload.single('image'),
   catchAsyncError(async (req, res, next) => {
      res.json({ file: req.file.path });
   })
);

//Importing routes
const users = require('./routes/user');
const routes = require('./routes/election');

app.use('/api/election', users);
app.use('/api/election', routes);

if (process.env.NODE_ENV == 'production') {
   app.use(express.static(path.join(__dirname, '../frontend/build'))) /
      app.get('*', (req, res) =>
         res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
      );
}

//Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;

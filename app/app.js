// Express
const express = require("express");
const app = express();

// Router
const router = require("./routes");

// DB
const { Pool } = require("pg");
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

pool.query("SELECT NOW()", (err, res) => {
    console.log(err, res);
    pool.end();
});

// CORS
const cors = require("cors");
var corsOptions = {
    origin: "http://localhost:3001",
};
app.use(cors(corsOptions));

// Body parser
const bodyParser = require("body-parser");

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(router);

// Errors handler
const errorHandler = require("./middlewares/error-handler");
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

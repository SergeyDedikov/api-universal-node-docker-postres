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

// Routes
app.use(router);

// Errors handler
const errorHandler = require("./middlewares/error-handler");
app.use(errorHandler);

app.listen(3000, () => {
    console.log("Сервер запущен");
});

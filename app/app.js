// Imports node modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Imports app modules
const { errorHandler } = require("./middlewares");
const db = require("./models");
const router = require("./routes");

// ENV const
const { PORT = 3000, NODE_ENV } = process.env;

// Express
const app = express();

// DB
/* const { Pool } = require("pg");
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
}); */

// CORS
var corsOptions = {
    origin: "http://localhost:3001",
};
app.use(cors(corsOptions));

// Body parser
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Cookies parser
app.use(cookieParser());

// Routes
app.use(router);

// Errors handler
app.use(errorHandler);

// DB sequelize
const Role = db.role;

function initialRole() {
    Role.create({
        id: 1,
        name: "user",
    });

    Role.create({
        id: 2,
        name: "moderator",
    });

    Role.create({
        id: 3,
        name: "admin",
    });
}

if (NODE_ENV !== "production") {
    db.sequelize.sync({ force: true }).then(() => {
        console.log("DEV: Drop and Resync DB");
        initialRole();
    });
} else {
    // else production
    db.sequelize.sync();
}

// listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    console.log(NODE_ENV);
});

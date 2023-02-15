// Initialize Sequelize
const Sequelize = require("sequelize");

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId",
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId",
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;

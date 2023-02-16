const jwt = require("jsonwebtoken");

const { NODE_ENV, SECRET } = process.env;

const Unauthorized = require("../errors/unauthorized-error");
const Forbidden = require("../errors/forbidden-error");

const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
    // извлекаем токен из куков запроса
    const token = req.cookies.jwt;

    if (!token) {
        return next(new Forbidden("Нет токена авторизации!"));
    }

    jwt.verify(
        token,
        NODE_ENV === "production" ? SECRET : "secret-string",
        (err, decoded) => {
            if (err) {
                return next(new Unauthorized("Необходима авторизация!"));
            }
            req.userId = decoded.id;
            next();
        }
    );
};

const isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    return next();
                }
            }

            return next(new Forbidden("Требуется роль администратора!"));
        });
    });
};

const isModerator = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    return next();
                }
            }

            return next(new Forbidden("Требуется роль модератора!"));
        });
    });
};

const isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    return next();
                }

                if (roles[i].name === "admin") {
                    return next();
                }
            }

            return next(
                new Forbidden("Требуется роль модератора или администратора!")
            );
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin,
};

module.exports = authJwt;

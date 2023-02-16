// To verify a Signup action, we need 2 functions:
// – check if username or email is duplicate or not
// – check if roles in the request is existed or not

const db = require("../models");
const ConflictError = require("../errors/conflict-error");
const BadRequestError = require("../errors/bad-request-error");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        where: {
            username: req.body.username,
        },
    }).then((user) => {
        if (user) {
            return next(
                new ConflictError("Пользователь с данныи именем уже существует")
            );
        }

        // Email
        User.findOne({
            where: {
                email: req.body.email,
            },
        }).then((user) => {
            if (user) {
                return next(
                    new ConflictError(
                        "Пользователь с данныи e-mail уже существует"
                    )
                );
            }

            next();
        });
    });
};

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                throw new BadRequestError(
                    `Роли ${req.body.roles[i]} не существует`
                );
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;

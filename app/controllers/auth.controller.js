// There are 2 main functions for Authentication:
// - signup: create new User in database (role is user if not specifying role)
// - signin:

// find username of the request in database, if it exists
// compare password with password in database using bcrypt, if it is correct
// generate a token using jsonwebtoken
// return user information & access Token

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const { NODE_ENV, SECRET } = process.env;

const db = require("../models");
const Unauthorized = require("../errors/unauthorized-error");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

exports.signup = (req, res, next) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    })
        .then((user) => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles,
                        },
                    },
                }).then((roles) => {
                    user.setRoles(roles).then(() => {
                        res.send({
                            message:
                                "Пользователь был успешно зарегистрирован!",
                        });
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.send({
                        message: "Пользователь был успешно зарегистрирован!",
                    });
                });
            }
        })
        .catch((err) => {
            next(err);
        });
};

exports.signin = (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email,
        },
    })
        .then((user) => {
            if (!user) {
                return Promise.reject(
                    new Unauthorized("Неправильные почта или пароль")
                );
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return Promise.reject(
                    new Unauthorized("Неправильные почта или пароль")
                );
            }

            var token = jwt.sign(
                { id: user.id },
                NODE_ENV === "production" ? SECRET : "secret-string",
                {
                    expiresIn: "1d", // 24 hours
                }
            );

            var authorities = [];
            user.getRoles().then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }

                // вернём куку с токеном
                res.cookie("jwt", token, {
                    httpOnly: true,
                    secure: NODE_ENV === "production",
                    sameSite: NODE_ENV === "production" ? "none" : "",
                    maxAge: 24 * 3600000,
                })
                    .status(200)
                    .send({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        roles: authorities,
                    });
            });
        })
        .catch(next);
};

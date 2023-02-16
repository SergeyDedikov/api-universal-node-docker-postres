const router = require("express").Router();

const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

router.post(
    "/signup",
    [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted,
    ],
    controller.signup
);

router.post("/signin", controller.signin);

module.exports = router;

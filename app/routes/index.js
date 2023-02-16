const router = require("express").Router();

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const NotFoundError = require("../errors/not-found-error");

// Главная
router.get("/", (_req, res) => {
    res.status(200).json({
        message: "Начальная страница",
    });
});

// -- Маршруты авторизации
router.use("/api/auth", authRoutes);

// -- Маршруты пользователей
router.use("/api/test", userRoutes);

// Обработка несуществующих роутов
router.use((req, res, next) => {
    next(
        new NotFoundError("Запрос не может быть обработан, маршрут не найден")
    );
});

module.exports = router;

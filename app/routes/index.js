const router = require("express").Router();
const NotFoundError = require("../errors/not-found-error");

// Главная
router.get("/", (_req, res) => {
    res.status(200).json({
        message: "Начальная страница",
    });
});

// Обработка несуществующих роутов
router.use((req, res, next) => {
    next(
        new NotFoundError("Запрос не может быть обработан, маршрут не найден")
    );
});

module.exports = router;

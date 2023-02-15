const router = require("express").Router();

// Главная
router.get("/", (_req, res) => {
    res.status(200).json({
        message: "Начальная страница",
    });
});

// Обработка несуществующих роутов
router.use((req, res, next) => {
    res.status(404).json({
        error: "Запрос не может быть обработан, маршрут не найден",
    });
    next();
});

module.exports = router;

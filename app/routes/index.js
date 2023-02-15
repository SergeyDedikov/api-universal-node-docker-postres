const router = require("express").Router();

// Главная
router.get("/", (_req, res) => {
    res.status(200).json({
        message: "Начальная страница",
    });
});

// Обработка всего остального
router.get("/*", (_req, res) => {
    res.status(400).json({
        error: "Запрос не может быть обработан, маршрут не найден",
    });
});

module.exports = router;

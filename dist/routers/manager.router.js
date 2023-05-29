"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.get("/sellers", controllers_1.sellerController.getAll);
router.get("/cars", controllers_1.carController.getAll);
router.post("/login", middlewares_1.commonMiddleware.isBodyValid(validators_1.UserValidator.login), middlewares_1.userMiddleware.getDynamicallyOrThrow("email", "body"), controllers_1.authController.login);
router.post("/refresh", middlewares_1.authMiddleware.checkedRefreshToken, controllers_1.authController.refresh);
router.get("/sellers/:userId", middlewares_1.authMiddleware.checkedAccessToken, middlewares_1.commonMiddleware.isIdValid("userId"), middlewares_1.userMiddleware.getByIdOrThrow, controllers_1.sellerController.getById);
router.get("/cars/:carId", middlewares_1.authMiddleware.checkedAccessToken, middlewares_1.commonMiddleware.isIdValid("carId"), middlewares_1.carMiddleware.getByIdOrThrow, controllers_1.carController.getById);
router.put("/sellers/:userId", middlewares_1.authMiddleware.checkedAccessToken, middlewares_1.commonMiddleware.isIdValid("userId"), middlewares_1.commonMiddleware.isBodyValid(validators_1.UserValidator.update), middlewares_1.userMiddleware.getByIdOrThrow, controllers_1.sellerController.update);
router.delete("/cars/:carId", middlewares_1.authMiddleware.checkedAccessToken, middlewares_1.commonMiddleware.isIdValid("carId"), middlewares_1.carMiddleware.getByIdOrThrow, controllers_1.carController.delete);
router.delete("/sellers/:userId", middlewares_1.authMiddleware.checkedAccessToken, middlewares_1.commonMiddleware.isIdValid("userId"), middlewares_1.userMiddleware.getByIdOrThrow, controllers_1.sellerController.delete);
exports.managerRouter = router;
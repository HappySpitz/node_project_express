import { Router } from "express";
import {authMiddleware, carMiddleware, commonMiddleware, userMiddleware} from "../middlewares";
import {authController, carController, sellerController} from "../controllers";
import {UserValidator} from "../validators";

const router = Router();

router.get("/sellers", sellerController.getAll);

router.get("/cars", carController.getAll);

router.post(
    "/login",
    commonMiddleware.isBodyValid(UserValidator.login),
    userMiddleware.getDynamicallyOrThrow("email", "body"),
    authController.login
);

router.post(
    "/refresh",
    authMiddleware.checkedRefreshToken,
    authController.refresh
);

router.get(
    "/sellers/:userId",
    authMiddleware.checkedAccessToken,
    commonMiddleware.isIdValid("userId"),
    userMiddleware.getByIdOrThrow,
    sellerController.getById
);

router.get(
    "/cars/:carId",
    authMiddleware.checkedAccessToken,
    commonMiddleware.isIdValid("carId"),
    carMiddleware.getByIdOrThrow,
    carController.getById
);

router.put(
    "/sellers/:userId",
    authMiddleware.checkedAccessToken,
    commonMiddleware.isIdValid("userId"),
    commonMiddleware.isBodyValid(UserValidator.update),
    userMiddleware.getByIdOrThrow,
    sellerController.update
);

router.delete(
    "/cars/:carId",
    authMiddleware.checkedAccessToken,
    commonMiddleware.isIdValid("carId"),
    carMiddleware.getByIdOrThrow,
    carController.delete
);

router.delete(
    "/sellers/:userId",
    authMiddleware.checkedAccessToken,
    commonMiddleware.isIdValid("userId"),
    userMiddleware.getByIdOrThrow,
    sellerController.delete
);

export const managerRouter = router;

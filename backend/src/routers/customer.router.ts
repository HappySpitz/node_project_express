import { Router } from "express";

import {carController, sellerController} from "../controllers";
import {carMiddleware, commonMiddleware, userMiddleware} from "../middlewares";

const router = Router();

router.get("/cars", carController.getAll);

router.get(
    "/cars/:carId",
    commonMiddleware.isIdValid("carId"),
    carMiddleware.getByIdOrThrow,
    carController.getById);

router.get(
    "/sellers/:userId",
    commonMiddleware.isIdValid("userId"),
    userMiddleware.getByIdOrThrow,
    sellerController.getById
);

export const customerRouter = router;

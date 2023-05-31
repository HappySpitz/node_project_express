import { Router } from "express";

import {
  authController,
  carController,
  managerController,
  sellerController,
} from "../controllers";
import {
  authMiddleware,
  carMiddleware,
  commonMiddleware,
  fileMiddleware,
  userMiddleware,
} from "../middlewares";
import { CarValidator, UserValidator } from "../validators";

const router = Router();

router.post(
  "/register/manager",
  commonMiddleware.isBodyValid(UserValidator.createManager),
  userMiddleware.getDynamicallyAndThrow("email", "body"),
  authController.registerManager
);

router.post(
  "/register/seller",
  commonMiddleware.isBodyValid(UserValidator.createSeller),
  userMiddleware.getDynamicallyAndThrow("email", "body"),
  authController.registerSeller
);

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
  "/sellers",
  authMiddleware.checkedAccessToken,
  sellerController.getAll
);

router.get(
  "/managers",
  authMiddleware.checkedAccessToken,
  managerController.getAll
);

router.get("/cars", authMiddleware.checkedAccessToken, carController.getAll);

router.post(
  "/cars",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.create
);

router.get(
  "/sellers/:userId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  sellerController.getById
);

router.get(
  "/managers/:userId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  managerController.getById
);

router.get(
  "/cars/:carId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("carId"),
  carMiddleware.getByIdOrThrow,
  carController.getById
);

router.put(
  "/cars/:carId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("carId"),
  commonMiddleware.isBodyValid(CarValidator.update),
  carMiddleware.getByIdOrThrow,
  carController.update
);

router.put(
  "/managers/:userId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isBodyValid(UserValidator.update),
  userMiddleware.getByIdOrThrow,
  managerController.update
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
  "/sellers/:userId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  sellerController.delete
);

router.delete(
  "/managers/:userId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  managerController.delete
);

router.delete(
  "/cars/:carId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("carId"),
  carMiddleware.getByIdOrThrow,
  carController.delete
);

router.put(
    "/cars/:carId/photo",
    authMiddleware.checkedAccessToken,
    commonMiddleware.isIdValid("carId"),
    fileMiddleware.isPhotosValid,
    carMiddleware.getByIdOrThrow,
    carController.uploadPhoto
);

router.delete(
    "/cars/:carId/photo",
    authMiddleware.checkedAccessToken,
    commonMiddleware.isIdValid("carId"),
    carMiddleware.getByIdOrThrow,
    carController.deletePhoto
);

export const adminRouter = router;

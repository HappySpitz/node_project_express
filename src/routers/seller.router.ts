import { Router } from "express";

import {
  authController,
  carController,
  sellerController,
} from "../controllers";
import { EActionTokenType } from "../enums";
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
  "/register",
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

router.post(
  "/change/type/account",
  commonMiddleware.isBodyValid(UserValidator.emailValidator),
  userMiddleware.getDynamicallyOrThrow("email"),
  authController.sendActivateToken
);

router.post(
  "/change/type/account/:token",
  authMiddleware.checkActionToken(EActionTokenType.changeTypeAccount),
  authController.changeTypeAccount
);

router.get("/cars", carController.getAll);

router.post(
  "/cars",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.create
);

router.get(
  "/cars/:carId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("carId"),
  carMiddleware.getByIdOrThrow,
  carController.getById
);

router.get(
  "/:userId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  sellerController.getById
);

router.put(
  "/sellers/:userId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isBodyValid(UserValidator.update),
  userMiddleware.getByIdOrThrow,
  sellerController.update
);

router.put(
  "/managers/:userId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isBodyValid(UserValidator.update),
  userMiddleware.getByIdOrThrow,
  sellerController.update
);

router.put(
  "/cars/:carId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("carId"),
  commonMiddleware.isBodyValid(CarValidator.update),
  carMiddleware.getByIdOrThrow,
  carController.update
);

router.delete(
  "/:userId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  sellerController.delete
);

router.delete(
  "/cars/:carId",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("carId"),
  carMiddleware.getByIdOrThrow,
  carController.delete
);

router.put(
  "/:userId/avatar",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("userId"),
  fileMiddleware.isAvatarValid,
  userMiddleware.getByIdOrThrow,
  sellerController.uploadAvatar
);

router.delete(
  "/:userId/avatar",
  authMiddleware.checkedAccessToken,
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  sellerController.deleteAvatar
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

export const sellerRouter = router;

import { NextFunction, Request, Response } from "express";

import { Action, Seller, Token } from "../dataBase";
import { EActionTokenType, ETypesSeller } from "../enums";
import { ApiError } from "../errors";
import { tokenService } from "../services";

class AuthMiddleware {
  public async checkedAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accessToken = req.get("Authorization");

      if (!accessToken) {
        throw new ApiError("No token!", 401);
      }

      const jwtPayload = tokenService.checkToken(accessToken);

      let user;
      if (jwtPayload && jwtPayload._id) {
        user = await Seller.findOne({ _id: jwtPayload._id });
        if (user.type === ETypesSeller.forbidden) {
          throw new ApiError(
            "You can't do anything on this site because you've been banned. Contact the administrator!",
            403
          );
        }
      }

      const tokenInfo = await Token.findOne({ accessToken });

      if (!tokenInfo) {
        throw new ApiError("Token not valid!", 401);
      }

      req.res.locals = { jwtPayload, tokenInfo };

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkedRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.get("Authorization");

      if (!refreshToken) {
        throw new ApiError("No token!", 401);
      }

      const jwtPayload = tokenService.checkToken(refreshToken);

      const tokenInfo = await Token.findOne({ refreshToken });

      if (!tokenInfo) {
        throw new ApiError("Token not valid!", 401);
      }

      req.res.locals = { jwtPayload, tokenInfo };

      next();
    } catch (e) {
      next(e);
    }
  }

  public checkActionToken(type: EActionTokenType) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const actionToken = req.params.token;

        if (!actionToken) {
          throw new ApiError("No token!", 401);
        }

        const jwtPayload = tokenService.checkActionToken(actionToken, type);

        const tokenInfo = await Action.findOne({ actionToken });

        if (!tokenInfo) {
          throw new ApiError("Token not valid", 401);
        }

        req.res.locals = { tokenInfo, jwtPayload };
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();

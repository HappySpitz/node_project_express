import * as jwt from "jsonwebtoken";

import {IActionTokenPayload, ITokenPair, ITokenPayload} from "../types";
import {configs} from "../configs";
import {ApiError} from "../errors";
import {EActionTokenType, ETokenType} from "../enums";
import {Types} from "mongoose";

class TokenService {
    public generateTokenPair(payload: { name: string; _id: string | Types.ObjectId }): ITokenPair {
        const accessToken = jwt.sign(payload, configs.ACCESS_SECRET, {
            expiresIn: configs.ACCESS_TOKEN_TIME,
        })

        const refreshToken = jwt.sign(payload, configs.REFRESH_SECRET, {
            expiresIn: configs.REFRESH_TOKEN_TIME,
        })

        return {
            accessToken,
            refreshToken
        }
    }
    
    public checkToken(token: string, tokenType = ETokenType.access) {
        try {
            let secret = "";

            switch (tokenType) {
                case ETokenType.access: {
                    secret = configs.ACCESS_SECRET;
                    break;
                }
                case ETokenType.refresh: {
                    secret = configs.REFRESH_SECRET;
                    break;
                }
            }

            return jwt.verify(token, secret) as ITokenPayload;
        } catch (e) {
            throw new ApiError("Token not valid", 401);
        }
    }

    public generateActionToken(
        payload: IActionTokenPayload,
        tokenType: EActionTokenType
    ): string {
        let secret = "";
        let expiresIn = "";

        switch (tokenType) {
            case EActionTokenType.changeTypeAccount:
                secret = configs.CHANGE_TYPE_ACCOUNT_SECRET;
                expiresIn = configs.CHANGE_TYPE_ACCOUNT_TIME;
                break;
        }
        return jwt.sign(payload, secret, { expiresIn });
    }

    public checkActionToken(token: string, tokenType: EActionTokenType) {
        try {
            let secret = "";

            switch (tokenType) {
                case EActionTokenType.changeTypeAccount:
                    secret = configs.CHANGE_TYPE_ACCOUNT_SECRET;
                    break;
            }

            return jwt.verify(token, secret) as IActionTokenPayload;
        } catch (e) {
            throw new ApiError("Token not valid", 401);
        }
    }
}

export const tokenService = new TokenService();
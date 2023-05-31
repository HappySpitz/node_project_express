import { Action, Manager, Seller, Token } from "../dataBase";
import {
  EActionTokenType,
  EEmailActions,
  ESmsActions,
  ETypesSeller,
} from "../enums";
import { ApiError } from "../errors";
import {
  ICredentials,
  IManager,
  ISeller,
  ITokenPair,
  ITokenPayload,
} from "../types";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { smsService } from "./sms.service";
import { tokenService } from "./token.service";

class AuthService {
  public async registerSeller(body: ISeller): Promise<void> {
    try {
      const { password } = body;

      const hashedPassword = await passwordService.hash(password);

      await Seller.create({ ...body, password: hashedPassword });

      await Promise.all([
        smsService.sendSms("+380501355914", ESmsActions.WELCOME),
        emailService.sendMail(
          "tatarkristina4@gmail.com",
          EEmailActions.WELCOME
        ),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async registerManager(body: IManager): Promise<void> {
    try {
      const { password } = body;

      const hashedPassword = await passwordService.hash(password);

      await Manager.create({ ...body, password: hashedPassword });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(
    credentials: ICredentials,
    user: ISeller | IManager
  ): Promise<ITokenPair> {
    try {
      const isMatched = await passwordService.compare(
        credentials.password,
        user.password
      );

      if (!isMatched) {
        throw new ApiError("Invalid email or password", 404);
      }

      const tokenPair = tokenService.generateTokenPair({
        name: user.name,
        _id: user._id,
      });

      await Token.create({
        _user_id: user._id,
        ...tokenPair,
      });

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async refresh(
    tokenInfo: ITokenPair,
    jwtPayload: ITokenPayload
  ): Promise<ITokenPair> {
    try {
      const tokenPair = tokenService.generateTokenPair({
        _id: jwtPayload._id,
        name: jwtPayload.name,
      });

      await Promise.all([
        Token.create({ _user_id: jwtPayload._id, ...tokenPair }),
        Token.deleteOne({ refreshToken: tokenInfo.refreshToken }),
      ]);

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async sendActivateToken(seller: ISeller): Promise<void> {
    try {
      const actionToken = tokenService.generateActionToken(
        { _id: seller._id },
        EActionTokenType.changeTypeAccount
      );

      await Action.create({
        actionToken,
        tokenType: EActionTokenType.changeTypeAccount,
        _user_id: seller._id,
      });

      await emailService.sendMail(
        "tatarkristina4@gmail.com",
        EEmailActions.CHANGE_TYPE_ACCOUNT,
        {
          token: actionToken,
        }
      );
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async changeTypeAccount(sellerId: string): Promise<void> {
    try {
      await Promise.all([
        Seller.updateOne(
          { _id: sellerId },
          { $set: { type: ETypesSeller.premium } }
        ),
        Action.deleteMany({
          _user_id: sellerId,
          tokenType: EActionTokenType.changeTypeAccount,
        }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();

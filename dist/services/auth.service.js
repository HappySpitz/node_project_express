"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const dataBase_1 = require("../dataBase");
const errors_1 = require("../errors");
const password_service_1 = require("./password.service");
const token_service_1 = require("./token.service");
const enums_1 = require("../enums");
const email_service_1 = require("./email.service");
const sms_service_1 = require("./sms.service");
class AuthService {
    async registerSeller(body) {
        try {
            const { password } = body;
            const hashedPassword = await password_service_1.passwordService.hash(password);
            await dataBase_1.Seller.create({ ...body, password: hashedPassword });
            await Promise.all([
                sms_service_1.smsService.sendSms("+380501355914", 0),
                email_service_1.emailService.sendMail("tatarkristina4@gmail.com", enums_1.EEmailActions.WELCOME),
            ]);
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async registerManager(body) {
        try {
            const { password } = body;
            const hashedPassword = await password_service_1.passwordService.hash(password);
            await dataBase_1.Manager.create({ ...body, password: hashedPassword });
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async login(credentials, user) {
        try {
            const isMatched = await password_service_1.passwordService.compare(credentials.password, user.password);
            if (!isMatched) {
                throw new errors_1.ApiError("Invalid email or password", 404);
            }
            const tokenPair = token_service_1.tokenService.generateTokenPair({
                name: user.name,
                _id: user._id
            });
            await dataBase_1.Token.create({
                _user_id: user._id,
                ...tokenPair
            });
            return tokenPair;
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async refresh(tokenInfo, jwtPayload) {
        try {
            const tokenPair = token_service_1.tokenService.generateTokenPair({
                _id: jwtPayload._id,
                name: jwtPayload.name,
            });
            await Promise.all([
                dataBase_1.Token.create({ _user_id: jwtPayload._id, ...tokenPair }),
                dataBase_1.Token.deleteOne({ refreshToken: tokenInfo.refreshToken }),
            ]);
            return tokenPair;
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async sendActivateToken(seller) {
        try {
            const actionToken = token_service_1.tokenService.generateActionToken({ _id: seller._id }, enums_1.EActionTokenType.changeTypeAccount);
            await dataBase_1.Action.create({
                actionToken,
                tokenType: enums_1.EActionTokenType.changeTypeAccount,
                _user_id: seller._id
            });
            await email_service_1.emailService.sendMail("tatarkristina4@gmail.com", enums_1.EEmailActions.CHANGE_TYPE_ACCOUNT, {
                token: actionToken
            });
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async changeTypeAccount(sellerId) {
        try {
            await Promise.all([
                dataBase_1.Seller.updateOne({ _id: sellerId }, { $set: { type: enums_1.ETypesSeller.premium } }),
                dataBase_1.Action.deleteMany({
                    _user_id: sellerId,
                    tokenType: enums_1.EActionTokenType.changeTypeAccount
                }),
            ]);
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
}
exports.authService = new AuthService();

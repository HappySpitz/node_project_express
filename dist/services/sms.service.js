"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsService = void 0;
const twilio_1 = require("twilio");
const configs_1 = require("../configs");
const constants_1 = require("../constants");
class SmsService {
    client;
    constructor(client = new twilio_1.Twilio(configs_1.configs.TWILIO_ACCOUNT_SID, configs_1.configs.TWILIO_AUTH_TOKEN)) {
        this.client = client;
    }
    async sendSms(phone, smsAction) {
        try {
            const message = constants_1.smsTemplates[smsAction];
            await this.client.messages.create({
                body: message,
                to: phone,
                messagingServiceSid: configs_1.configs.TWILIO_SERVICE_SID,
            });
        }
        catch (e) {
            console.error(JSON.stringify(e, null, 2));
        }
    }
}
exports.smsService = new SmsService();

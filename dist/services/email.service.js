"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const node_path_1 = __importDefault(require("node:path"));
const email_templates_1 = __importDefault(require("email-templates"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const configs_1 = require("../configs");
const constants_1 = require("../constants");
class EmailService {
    transporter;
    templateParser;
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: configs_1.configs.NO_REPLY_EMAIL,
                pass: configs_1.configs.NO_REPLY_EMAIL_PASSWORD,
            },
        });
        this.templateParser = new email_templates_1.default({
            views: {
                root: node_path_1.default.join(process.cwd(), "src", "statics"),
                options: {
                    extension: "hbs",
                },
            },
            juice: true,
            juiceResources: {
                webResources: {
                    relativeTo: node_path_1.default.join(process.cwd(), "src", "statics", "css"),
                },
            },
        });
    }
    async sendMail(email, emailAction, locals = {}) {
        const templateInfo = constants_1.allTemplates[emailAction];
        locals.frontUrl = configs_1.configs.FRONT_URL;
        const html = await this.templateParser.render(templateInfo.templateName, locals);
        return this.transporter.sendMail({
            from: "No reply",
            to: email,
            subject: templateInfo.subject,
            html,
        });
    }
}
exports.emailService = new EmailService();

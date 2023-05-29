"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const mongoose = __importStar(require("mongoose"));
const configs_1 = require("./configs");
const routers_1 = require("./routers");
const routers_2 = require("./routers");
const crons_1 = require("./crons");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
app.use("/seller", routers_1.sellerRouter);
app.use("/manager", routers_1.managerRouter);
app.use("/admin", routers_2.adminRouter);
app.use("/buy", routers_1.customerRouter);
app.use((err, req, res, next) => {
    const status = err.status || 500;
    return res.status(status).json({
        message: err.message,
        status,
    });
});
const connectionDB = async () => {
    let dbCon = false;
    while (!dbCon) {
        try {
            console.log('Connecting to database...');
            await mongoose.connect(configs_1.configs.DB_URL);
            dbCon = true;
        }
        catch (e) {
            console.log('Database unavailable, wait 3 second');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
};
const start = async () => {
    try {
        await connectionDB();
        await (0, crons_1.cronRunner)();
        await app.listen(5000, '0.0.0.0', () => {
            console.log(`Server has started on PORT ${configs_1.configs.PORT} 🚀🚀🚀`);
        });
    }
    catch (e) {
        console.log(e);
    }
};
start();

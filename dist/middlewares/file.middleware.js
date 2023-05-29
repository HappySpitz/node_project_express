"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileMiddleware = void 0;
const errors_1 = require("../errors");
const configs_1 = require("../configs");
class FileMiddleware {
    isAvatarValid(req, res, next) {
        try {
            if (!req.files) {
                throw new errors_1.ApiError("No files to upload!", 400);
            }
            if (Array.isArray(req.files)) {
                throw new errors_1.ApiError("You can upload only one photo!", 400);
            }
            const { size, mimetype, name } = req.files.avatar;
            if (size > configs_1.photoConfig.MAX_SIZE) {
                throw new errors_1.ApiError(`File ${name} is too big.`, 400);
            }
            if (!configs_1.photoConfig.MIMETYPES.includes(mimetype)) {
                throw new errors_1.ApiError(`File ${name} has invalid format.`, 400);
            }
            next();
        }
        catch (e) {
            next(e);
        }
    }
    isPhotosValid(req, res, next) {
        try {
            if (!req.files) {
                throw new errors_1.ApiError("No files to upload!", 400);
            }
            const photos = req.files.photos;
            if (!Array.isArray(photos) || photos.length === 0) {
                throw new errors_1.ApiError("You must upload at least one photo!", 400);
            }
            for (const photo of photos) {
                const { size, mimetype, name } = photo;
                if (size > configs_1.photoConfig.MAX_SIZE) {
                    throw new errors_1.ApiError(`File ${name} is too big.`, 400);
                }
                if (!configs_1.photoConfig.MIMETYPES.includes(mimetype)) {
                    throw new errors_1.ApiError(`File ${name} has invalid format.`, 400);
                }
            }
            next();
        }
        catch (e) {
            next(e);
        }
    }
}
exports.fileMiddleware = new FileMiddleware();

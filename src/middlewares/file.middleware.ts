import {NextFunction, Request, Response} from "express";
import {ApiError} from "../errors";
import {UploadedFile} from "express-fileupload";
import {photoConfig} from "../configs";

class FileMiddleware {
    public isAvatarValid(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.files) {
                throw new ApiError("No files to upload!", 400);
            }

            if (Array.isArray(req.files)) {
                throw new ApiError("You can upload only one photo!", 400);
            }

            const { size, mimetype, name } = req.files.avatar as UploadedFile;

            if (size > photoConfig.MAX_SIZE) {
                throw new ApiError(`File ${name} is too big.`, 400);
            }

            if (!photoConfig.MIMETYPES.includes(mimetype)) {
                throw new ApiError(`File ${name} has invalid format.`, 400);
            }

            next();
        } catch (e) {
            next(e);
        }
    }

    public isPhotosValid(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.files) {
                throw new ApiError("No files to upload!", 400);
            }

            const photos = req.files.photos as UploadedFile[];

            if (!Array.isArray(photos) || photos.length === 0) {
                throw new ApiError("You must upload at least one photo!", 400);
            }

            for (const photo of photos) {
                const {size, mimetype, name} = photo;

                if (size > photoConfig.MAX_SIZE) {
                    throw new ApiError(`File ${name} is too big.`, 400);
                }

                if (!photoConfig.MIMETYPES.includes(mimetype)) {
                    throw new ApiError(`File ${name} has invalid format.`, 400);
                }
            }

            next()
        } catch (e) {
            next(e)
        }
}
}

export const fileMiddleware = new FileMiddleware();
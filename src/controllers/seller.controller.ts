import {IMessage, IQuery, ISeller} from "../types";
import {Request, Response, NextFunction} from "express";
import {sellerService} from "../services";
import {sellerMapper} from "../mappers";
import {UploadedFile} from "express-fileupload";

class SellerController {
    public async getAll(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<ISeller[]>> {
        try {
            const response = await sellerService.getWithPagination(
                req.query as unknown as IQuery
            );

            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    public async getById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<ISeller>> {
        try {
            const { seller } = res.locals;

            const response = sellerMapper.toResponse(seller);

            return res.json(response);
        } catch (e) {
            next(e);
        }
    }


    public async update(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<ISeller>> {
        try {
            const { params, body } = req;

            const updatedSeller = await sellerService.update(params.userId, body);

            const response = sellerMapper.toResponse(updatedSeller);

            return res.status(201).json(response);
        } catch (e) {
            next(e);
        }
    }

    public async delete(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<IMessage>> {
        try {
            const { userId } = req.params;

            await sellerService.delete(userId);

            return res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    }

    public async uploadAvatar(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<ISeller>> {
        try {
            const userEntity = res.locals.user as ISeller;
            const avatar = req.files.avatar as UploadedFile;

            const user = await sellerService.uploadAvatar(avatar, userEntity);

            const response = sellerMapper.toResponse(user);

            return res.status(201).json(response);
        } catch (e) {
            next(e);
        }
    }

    public async deleteAvatar(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<ISeller>> {
        try {
            const userEntity = res.locals.user as ISeller;

            const user = await sellerService.deleteAvatar(userEntity);

            const response = sellerMapper.toResponse(user);

            return res.status(201).json(response);
        } catch (e) {
            next(e);
        }
    }
}

export const sellerController = new SellerController();
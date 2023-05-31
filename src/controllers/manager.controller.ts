import { NextFunction, Request, Response } from "express";

import { managerService } from "../services";
import { IManager, IMessage, IQuery, ISeller } from "../types";

class ManagerController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IManager[]>> {
    try {
      const response = await managerService.getWithPagination(
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
  ): Promise<Response<IManager>> {
    try {
      const { params } = req;

      const manager = await managerService.getById(params.userId);

      return res.json(manager);
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

      const updatedManager = await managerService.update(params.userId, body);

      return res.status(201).json(updatedManager);
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

      await managerService.delete(userId);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const managerController = new ManagerController();

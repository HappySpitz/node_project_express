import { Manager } from "../dataBase";
import { ApiError } from "../errors";
import { IManager, IPaginationResponse, IQuery } from "../types";

class ManagerService {
  public async getWithPagination(
    query: IQuery
  ): Promise<IPaginationResponse<IManager>> {
    try {
      const queryStr = JSON.stringify(query);
      const queryObj = JSON.parse(
        queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`)
      );

      const {
        page = 1,
        limit = 5,
        sortedBy = "createdAt",
        ...searchObject
      } = queryObj;

      const skip = limit * (page - 1);

      const managers = await Manager.find(searchObject)
        .limit(limit)
        .skip(skip)
        .sort(sortedBy)
        .lean();

      const usersTotalCount = await Manager.countDocuments(searchObject);

      return {
        page: +page,
        itemsCount: usersTotalCount,
        perPage: +limit,
        itemsFound: managers.length,
        data: managers,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getById(userId: string): Promise<IManager> {
    try {
      return await Manager.findById(userId).lean();
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async update(
    userId: string,
    data: Partial<IManager>
  ): Promise<IManager> {
    try {
      return await Manager.findByIdAndUpdate(userId, data, { new: true });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async delete(userId: string): Promise<void> {
    try {
      await Manager.deleteOne({ _id: userId });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const managerService = new ManagerService();

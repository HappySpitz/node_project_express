import { configs } from "../configs";
import { ISeller } from "../types";

export class SellerMapper {
  public toResponse(seller: ISeller) {
    return {
      _id: seller._id,
      firstName: seller.name,
      lastName: seller.lastName,
      phone: seller.phone,
      type: seller.type,
      avatar: seller.avatar ? `${configs.AWS_S3_URL}/${seller.avatar}` : null,
    };
  }
}

export const sellerMapper = new SellerMapper();

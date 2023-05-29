"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerMapper = exports.SellerMapper = void 0;
const configs_1 = require("../configs");
class SellerMapper {
    toResponse(seller) {
        return {
            _id: seller._id,
            firstName: seller.name,
            lastName: seller.lastName,
            phone: seller.phone,
            type: seller.type,
            avatar: seller.avatar ? `${configs_1.configs.AWS_S3_URL}/${seller.avatar}` : null,
        };
    }
}
exports.SellerMapper = SellerMapper;
exports.sellerMapper = new SellerMapper();

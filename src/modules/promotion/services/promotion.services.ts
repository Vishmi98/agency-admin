import { PromotionsResponseType, PromotionType } from "../promotion.types";

import { PROMOTION_DATA } from "@/constants/data";


let PROMOTIONS: PromotionType[] = [...PROMOTION_DATA];

export const getPromotionData = (): PromotionsResponseType => {
    return {
        success: true,
        message: 'Success',
        data: PROMOTIONS
    };
};

export const createPromotion = (promotion: PromotionType): PromotionsResponseType => {
    const newPromotion = {
        ...promotion,
        id: PROMOTIONS.length > 0 ? PROMOTIONS[PROMOTIONS.length - 1].id + 1 : 1,
    };

    PROMOTIONS.push(newPromotion);

    return {
        success: true,
        message: 'Promotion created successfully',
        data: PROMOTIONS,
    };
};
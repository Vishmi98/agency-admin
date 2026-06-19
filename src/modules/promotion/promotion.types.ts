export type PromotionType = {
    id: number;
    title: string;
    description: string;
    amount: number;
}

export type PromotionsResponseType = {
    success: boolean;
    message: string;
    data: PromotionType[];
}

export type PromotionsTableProps = {
    promotions: PromotionType[];
}

export type PromotionFormValues = {
    handleClose: () => void;
    open: boolean;
    onPromotionAdded?: () => void;
}
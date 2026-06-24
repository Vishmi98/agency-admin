import ActivityLogModel from "@/models/common/activityLog.model";

export const createActivityLog = async (data: {
    userId: number;
    action: string;
    endpoint?: string;
    method?: string;
    meta?: any;
}) => {
    try {
        await ActivityLogModel.create({
            ...data,
            createdAt: new Date(),
        });
    } catch (error) {
        console.log("Activity log error:", error);
    }
};
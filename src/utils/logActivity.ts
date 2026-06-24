import { encryptData } from "@/lib/encrypt";

export const logActivity = async (data: {
    userId: number;
    action: string;
    endpoint?: string;
    path?: string;
    method?: string;
    meta?: any;
}) => {
    try {
        const encryptedPayload = encryptData(data);

        await fetch(`/api/activityLog/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                payload: encryptedPayload,
            }),
        });
    } catch (error) {
        console.log("Activity log failed:", error);
    }
};
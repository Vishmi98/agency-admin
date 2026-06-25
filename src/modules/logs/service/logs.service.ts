import { LogsResponseDataType, LogsResponseType } from "../logs.types";

import { encryptData } from "@/lib/encrypt";
import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";
import { decryptData } from "@/lib/decrypt";

export const getLogsData = async (page: number, limit?: number): Promise<LogsResponseDataType> => {
    const encryptedPayload = encryptData({
        page,
        limit: limit || 5,
    });

    const response: LogsResponseType = await apiCall({
        url: `${URL}/activityLog/get-all`,
        method: 'POST',
        body: {
            payload: encryptedPayload,
        },
    });

    const decryptedData = decryptData(response.data);

    return {
        success: response.success,
        message: response.message,
        logs: decryptedData.logs,
        page: decryptedData.page,
        limit: decryptedData.limit,
        totalPages: decryptedData.totalPages,
        totalLogs: decryptedData.totalLogs,
    };
};
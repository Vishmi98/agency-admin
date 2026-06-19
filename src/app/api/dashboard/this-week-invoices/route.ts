import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InvoiceModel from "@/models/invoice/invoice.model";
import { sendSuccessResponse, sendErrorResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";


interface InvoiceAggregateResult {
    _id: {
        branchName: string;
        date: Date;
    };
    invoiceCount: number;
}

interface BranchMap {
    [key: string]: number[];
}

export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const today = new Date();
        const first = today.getDate() - today.getDay();
        const dates: string[] = [];

        for (let i = 0; i < 7; i++) {
            let date = new Date(today.setDate(first + i));
            let formattedDate = date.toISOString().split('T')[0];
            dates.push(formattedDate);
        }

        const invoices: InvoiceAggregateResult[] = await InvoiceModel.aggregate([
            {
                $lookup: {
                    from: 'branches',
                    localField: 'branchId',
                    foreignField: 'id',
                    as: 'branchInfo'
                }
            },
            {
                $unwind: '$branchInfo'
            },
            {
                $addFields: {
                    convertedInvoiceDate: {
                        $dateFromString: {
                            dateString: "$invoiceDate",
                            format: "%Y-%m-%d" // Adjust this format
                        }
                    }
                }
            },
            {
                $match: {
                    convertedInvoiceDate: { $in: dates.map(date => new Date(date)) }
                }
            },
            {
                $group: {
                    _id: { branchName: "$branchInfo.title.EN", date: "$convertedInvoiceDate" },
                    invoiceCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.branchName": 1, "_id.date": 1 }
            }
        ]);

        // Mapping to the desired format
        const branchMap: BranchMap = {};
        invoices.forEach(({ _id, invoiceCount }) => {
            if (!branchMap[_id.branchName]) {
                branchMap[_id.branchName] = new Array(7).fill(0); // Create an array filled with zeros
            }
            const dayIndex = dates.indexOf(_id.date.toISOString().split('T')[0]);
            if (dayIndex !== -1) {
                branchMap[_id.branchName][dayIndex - 1] = invoiceCount;
            }
        });

        const formattedData = Object.keys(branchMap).map(branchName => {
            return {
                name: branchName,
                data: branchMap[branchName]
            };
        });

        return sendSuccessResponse("Invoices retrieved  successfully", { currentWeekInvoices: formattedData });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}

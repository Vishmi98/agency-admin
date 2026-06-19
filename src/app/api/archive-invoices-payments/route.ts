import { NextResponse } from "next/server";

import { connectMigrationDBs } from "@/lib/mongodb-multi";

export async function POST() {
    try {
        const { sourceConn, destConn } = await connectMigrationDBs();

        const sourceInvoiceCollection =
            sourceConn.db.collection("invoices");

        const sourcePaymentCollection =
            sourceConn.db.collection("payments");

        const destInvoiceCollection =
            destConn.db.collection("invoices");

        const destPaymentCollection =
            destConn.db.collection("payments");

        const invoiceQuery = {
            dueAmount: 0,
            status: 3,
            isArchived: false,
        };

        /** ----------------------------------------
         * 1. GET INVOICES TO ARCHIVE
         * ---------------------------------------- */
        const invoices = await sourceInvoiceCollection
            .find(invoiceQuery)
            .toArray();

        if (invoices.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No invoices found to archive.",
                archivedInvoices: 0,
                archivedPayments: 0,
            });
        }

        const invoiceIds = invoices.map(
            (invoice: any) => invoice.id
        );

        /** ----------------------------------------
         * 2. UPDATE SOURCE INVOICES
         * ---------------------------------------- */
        await sourceInvoiceCollection.updateMany(
            {
                id: { $in: invoiceIds },
            },
            {
                $set: {
                    isArchived: true,
                },
            }
        );

        /** ----------------------------------------
         * 3. PREPARE INVOICES FOR DEST INSERT
         * ---------------------------------------- */
        const invoiceDocsForArchive = invoices.map((invoice: any) => {
            const { _id, ...invoiceWithoutId } = invoice;

            return {
                ...invoiceWithoutId,
                isArchived: true,
            };
        });

        let insertedInvoiceIds: number[] = [];

        if (invoiceDocsForArchive.length > 0) {
            try {
                await destInvoiceCollection.insertMany(
                    invoiceDocsForArchive,
                    {
                        ordered: false,
                    }
                );

                insertedInvoiceIds = invoiceDocsForArchive.map(
                    (invoice: any) => invoice.id
                );
            } catch (error: any) {
                // Ignore duplicate key errors
                if (error.code !== 11000) {
                    throw error;
                }

                insertedInvoiceIds = invoiceDocsForArchive.map(
                    (invoice: any) => invoice.id
                );
            }
        }

        /** ----------------------------------------
         * 4. GET RELATED PAYMENTS
         * ---------------------------------------- */
        const payments = await sourcePaymentCollection
            .find({
                invoiceId: {
                    $in: invoiceIds,
                },
            })
            .toArray();

        const paymentIds = payments.map(
            (payment: any) => payment.id
        );

        /** ----------------------------------------
         * 5. UPDATE SOURCE PAYMENTS
         * ---------------------------------------- */
        if (paymentIds.length > 0) {
            await sourcePaymentCollection.updateMany(
                {
                    invoiceId: {
                        $in: invoiceIds,
                    },
                },
                {
                    $set: {
                        isArchived: true,
                    },
                }
            );
        }

        /** ----------------------------------------
         * 6. PREPARE PAYMENTS FOR DEST INSERT
         * ---------------------------------------- */
        const paymentDocsForArchive = payments.map((payment: any) => {
            const { _id, ...paymentWithoutId } = payment;

            return {
                ...paymentWithoutId,
                isArchived: true,
            };
        });

        let insertedPaymentIds: number[] = [];

        if (paymentDocsForArchive.length > 0) {
            try {
                await destPaymentCollection.insertMany(
                    paymentDocsForArchive,
                    {
                        ordered: false,
                    }
                );

                insertedPaymentIds = paymentDocsForArchive.map(
                    (payment: any) => payment.id
                );
            } catch (error: any) {
                // Ignore duplicate key errors
                if (error.code !== 11000) {
                    throw error;
                }

                insertedPaymentIds = paymentDocsForArchive.map(
                    (payment: any) => payment.id
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: "Archive completed successfully.",

            invoiceCount: invoiceIds.length,
            paymentCount: paymentIds.length,

            archivedInvoiceIds: invoiceIds,
            archivedPaymentIds: paymentIds,

            insertedInvoiceIds,
            insertedPaymentIds,
        });
    } catch (error: any) {
        console.error("Archive process failed:", error);

        return NextResponse.json(
            {
                success: false,
                error:
                    error.message ||
                    "Archive process failed",
            },
            {
                status: 500,
            }
        );
    }
}
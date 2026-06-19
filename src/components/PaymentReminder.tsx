"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { getPaymentReminderStatus } from "@/modules/payment/services/payment.services";

const PaymentReminder = () => {
    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                const response = await getPaymentReminderStatus();

                if (response.success && response.showReminder) {
                    const isMobile = window.innerWidth <= 768;

                    if (!toast.isActive("payment-reminder")) {
                        toast.error(
                            response.message || "Monthly payment is pending.",
                            {
                                toastId: "payment-reminder",
                                position: isMobile
                                    ? "top-center"
                                    : "top-right",

                                autoClose: 300000, // 5 minutes
                                closeOnClick: true,
                                draggable: false,
                                pauseOnHover: false,
                                pauseOnFocusLoss: false,
                                style: {
                                    background: "#FFF7ED",
                                    color: "#9A3412",
                                    border: "1px solid #FDBA74",
                                    borderLeft: "6px solid #EA580C",
                                    borderRadius: "12px",
                                    padding: "12px",
                                    minHeight: "70px",
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                    width: "350px",
                                    maxWidth: "90vw",
                                    right: 30
                                },
                            }
                        );
                    }
                } else {
                    toast.dismiss("payment-reminder");
                }
            } catch (error) {
                console.error(
                    "Payment reminder check failed",
                    error
                );
            }
        };

        // Run immediately
        checkPaymentStatus();

        // Check every minute
        const interval = setInterval(
            checkPaymentStatus,
            60000
        );

        return () => clearInterval(interval);
    }, []);

    return null;
};

export default PaymentReminder;
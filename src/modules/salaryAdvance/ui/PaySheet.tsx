"use client"

import React, { useRef } from 'react';
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';
import { Box, Typography, Divider, Grid } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

import { SalaryProp } from '../salaryAdvance.types';


const PaySheet: React.FC<SalaryProp> = ({ salary, setIsModalOpen }) => {
    const paySlipRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        const html2pdf = (await import("html2pdf.js")).default;
        const element = paySlipRef.current;
        if (!element) return;

        const options = {
            margin: 0.5,
            filename: `paySlip.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        };

        html2pdf().set(options).from(element).save();
    };

    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginBottom: 2,
                    gap: 2
                }}>
                    <CloseIcon
                        sx={{ width: 15, height: 15, cursor: "pointer" }}
                        onClick={() => setIsModalOpen(false)}
                    />
                </Box>
                <Box sx={{ width: "100%" }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            width: "100%",
                            marginBottom: 2,
                            gap: 2,
                        }}
                    >
                        <Box sx={{ backgroundColor: "#f8f8f8", padding: 1, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <DownloadIcon sx={{ width: "16px", height: "16px", cursor: "pointer" }} onClick={handleDownloadPDF} />
                        </Box>
                    </Box>
                    <Box ref={paySlipRef} sx={{ width: "100%", display: "flex", flexDirection: "row" }}>
                        <Box sx={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            {/* Pay sheet Content */}
                            <Box sx={{ width: "100%" }}>
                                <Box sx={{ position: "relative" }}>
                                    <div className='flex flex-col items-start gap-6 w-full md:w-[23%] absolute'>
                                        <Image
                                            src="/logo3.png"
                                            alt="Real Smart Logo"
                                            width={0}
                                            height={0}
                                            className="w-[100%]"
                                            sizes="50vw"
                                        />
                                    </div>
                                    <Box>
                                        <Typography variant="h6" align="center" fontWeight="bold">Payslip</Typography>
                                        <Typography variant="subtitle2" align="center" fontWeight="bold" marginTop={2}>Real Smart Global Pvt Ltd</Typography>
                                        <Typography fontSize="10px" align="center">176/1 Nawala road, Nugegoda, Sri Lanka</Typography>
                                    </Box>
                                </Box>

                                <Box my={2}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "50%" }}>
                                            <Box>
                                                <Typography fontSize="11px">Pay Period</Typography>
                                                <Typography fontSize="11px">Worked Days</Typography>
                                                <Typography fontSize="11px">Working Days</Typography>
                                            </Box>
                                            <Box>
                                                <Typography fontSize="11px">: {salary.month}</Typography>
                                                <Typography fontSize="11px">: {salary.monthInfo.workDays}</Typography>
                                                <Typography fontSize="11px">: {salary.attendances.length ? salary.attendances.length : "Not attendance required"}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "50%" }}>
                                            <Box>
                                                <Typography fontSize="11px">Employee Id</Typography>
                                                <Typography fontSize="11px">Employee Name</Typography>
                                                <Typography fontSize="11px">Designation</Typography>
                                            </Box>
                                            <Box>
                                                <Typography fontSize="11px">: {salary.staffId}</Typography>
                                                <Typography fontSize="11px">: {salary.staffInfo?.titleInfo?.title.EN} {salary.staffInfo?.firstName} {salary.staffInfo?.lastName}</Typography>
                                                <Typography fontSize="11px">:
                                                    {
                                                        (() => {
                                                            switch (salary.staffInfo.roll) {
                                                                case 1:
                                                                    return ' Admin';
                                                                case 2:
                                                                    return ' Consultant';
                                                                case 3:
                                                                    return ' HR';
                                                                case 4:
                                                                    return ' Accounts';
                                                                case 5:
                                                                    return ' CEO';
                                                                case 6:
                                                                    return ' Marketing Manager';
                                                                case 7:
                                                                    return ' Branch Manager';
                                                                case 8:
                                                                    return ' Operation Manager';
                                                                case 9:
                                                                    return ' Coordinator';
                                                                case 10:
                                                                    return ' Junior Consultant';
                                                                default:
                                                                    return '';
                                                            }
                                                        })()
                                                    }
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box marginTop={2}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Box>
                                                <Typography fontSize="11px">Basic</Typography>
                                                <Typography fontSize="11px">Commissions per student ({salary.commissionAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</Typography>
                                                <Typography fontSize="11px">No pay deduction per day ({salary.noPayPerDay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) </Typography>
                                                {/* <Typography variant="body2">
                                                    Introduce commission per month: ({
                                                        salary.mainCommissionInfo?.length
                                                            ? (salary.mainCommissionInfo[0].introduceAmount).toFixed(2)
                                                            : 0
                                                    })
                                                </Typography>

                                                <Typography variant="body2">
                                                    Maintain commission per month: ({
                                                        salary.subCommissionInfo?.length
                                                            ? (salary.subCommissionInfo[0].amount).toFixed(2)
                                                            : 0
                                                    })
                                                </Typography> */}
                                            </Box>
                                            <Box>
                                                <Typography fontSize="11px" textAlign="end">{salary.basicSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                                <Typography fontSize="11px" textAlign="end"></Typography>
                                                <Typography fontSize="11px" textAlign="end"></Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ width: "100%", height: "1px", backgroundColor: "gray", marginY: 1 }} />

                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Box>
                                                <Typography fontSize="12px" fontWeight="bold" marginBottom={1}>Earnings</Typography>
                                            </Box>
                                            <Box>
                                                <Typography fontSize="12px" fontWeight="bold" marginBottom={1} textAlign="end">Amount</Typography>
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <Typography variant="body2" fontWeight='bold'>Introduce commissions ({salary?.mainCommissionIds.length})</Typography>
                                                <Typography fontSize="11px" textAlign="end">
                                                    {salary?.mainCommissionInfo
                                                        ?.reduce((sum, mc) => sum + (mc.introduceAmount || 0), 0)
                                                        .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Typography>
                                            </Box>
                                            {salary.mainCommissionInfo.map((item, index) => (
                                                <Box key={index} sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                                    <Typography variant="body2">{item.invoiceId} - {item.studentDetails?.firstName} {item.studentDetails?.lastName}</Typography>
                                                </Box>
                                            ))}
                                            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}>
                                                <Typography variant="body2" fontWeight='bold'>Maintain commissions ({salary?.subCommissionIds.length})</Typography>
                                                <Typography fontSize="11px" textAlign="end">
                                                    {salary?.subCommissionInfo
                                                        ?.reduce((sum, mc) => sum + (mc.amount || 0), 0)
                                                        .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Typography>
                                            </Box>
                                            {salary.subCommissionInfo.map((item, index) => (
                                                <Box key={index} sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                                    <Typography variant="body2">{item.mainCommissionInfo?.invoiceId} - {item.mainCommissionInfo?.studentDetails?.firstName} {item.mainCommissionInfo?.studentDetails?.lastName}</Typography>
                                                </Box>
                                            ))}
                                        </Box>

                                        {salary.additional && salary.additional.length > 0 && (
                                            <>
                                                <Box>
                                                    <Typography fontSize="11px">Additional Incentives:</Typography>

                                                    {salary.additional.map((item, index) => (
                                                        <Box key={index} sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                                            <Typography fontSize="11px" ml={5}>{item.title}</Typography>
                                                            <Typography fontSize="11px">
                                                                {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </>
                                        )}

                                        <Box sx={{ width: "100%", height: "1px", backgroundColor: "gray", marginY: 1 }} />

                                        <Box marginTop={2} sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Box>
                                                <Typography fontSize="12px" fontWeight="bold" marginBottom={1}>Deductions</Typography>
                                                <Typography fontSize="11px">Salary Advances</Typography>
                                                <Typography fontSize="11px">No Pay Deduction ({salary?.leaves.length})</Typography>
                                            </Box>
                                            <Box textAlign="end">
                                                <Typography fontSize="12px" fontWeight="bold" marginBottom={1}>Amount</Typography>
                                                {salary.salaryAdvance && salary.salaryAdvance.length > 0 ? (
                                                    salary.salaryAdvance.map((amount, index) => (
                                                        <Typography key={index} fontSize="11px">
                                                            - {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </Typography>
                                                    ))
                                                ) : (
                                                    <Typography fontSize="11px">0</Typography>
                                                )}
                                                <Typography fontSize="11px">- {salary.totalNoPayDeduction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ width: "100%", display: "flex", flexDirection: "row", marginTop: 1 }}>
                                            <Box sx={{ width: "40%" }}></Box>
                                            <Box sx={{ width: "60%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>

                                                <Box sx={{ display: "flex", gap: 5, justifyContent: "space-between", width: "100%" }}>
                                                    <Typography fontSize="12px" fontWeight="bold">Gross Pay:</Typography>
                                                    <Typography fontSize="12px">{salary.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                                </Box>

                                                <Box sx={{ display: "flex", gap: 5, justifyContent: "space-between", width: "100%" }}>
                                                    <Typography fontSize="12px" fontWeight="bold">Total Deductions:</Typography>
                                                    <Typography fontSize="12px">- {salary.totalDeduction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                                </Box>
                                                <Box sx={{ display: "flex", gap: 5, justifyContent: "space-between", width: "100%" }}>
                                                    <Typography fontSize="12px" fontWeight="bold">Net Pay:</Typography>
                                                    <Typography
                                                        fontSize="12px"
                                                        sx={{
                                                            textDecoration: 'underline double',
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        {salary.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box sx={{ width: "100%", height: "1px", backgroundColor: "gray", marginY: 1 }} />

                                        {/* Signature */}
                                        <Grid container justifyContent="space-between" mt={2}>
                                            <Grid item>
                                                <Typography fontSize="10px">Employer Signature</Typography>
                                                <Divider sx={{ width: "200px", mt: 2 }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography fontSize="10px" align='right'>Employee Signature</Typography>
                                                <Divider sx={{ width: "200px", mt: 2 }} />
                                            </Grid>
                                        </Grid>

                                        <Typography align="center" mt={3} fontSize="10px">
                                            This is system generated payslip
                                        </Typography>
                                    </Box>
                                </Box>

                            </Box>
                        </Box>
                        <Box sx={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <ToastContainer />
        </>
    );
};

export default PaySheet;


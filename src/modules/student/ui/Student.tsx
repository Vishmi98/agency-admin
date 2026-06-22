"use client"

import React, { useRef } from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

import { StudentProp } from '../student.types';


const Student: React.FC<StudentProp> = ({ student, setIsModalOpen }) => {
    const studentRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        const html2pdf = (await import("html2pdf.js")).default;
        const element = studentRef.current;
        if (!element) return;

        const options = {
            margin: 0.5,
            filename: `${student.firstName}_${student.lastName}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(options).from(element).save();
    };

    return (
        <>
            <Box>
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
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        width: "100%",
                        marginBottom: 2,
                        gap: 2,
                    }}
                    paddingRight={3}
                >
                    <Box sx={{ backgroundColor: "#f8f8f8", padding: 1, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <DownloadIcon sx={{ width: "16px", height: "16px", cursor: "pointer" }} onClick={handleDownloadPDF} />
                    </Box>
                </Box>

                {/* Invoice Content */}
                <Box ref={studentRef} padding={3}>
                    {/* Header */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: 3
                    }}>
                        <img
                            src="/logo1.png"
                            alt="Real Smart Logo"
                            width={160}
                            height={90}
                        />
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            alignItems: "flex-end",
                            justifyContent: "flex-end"
                        }}>
                            <Box>
                                <Typography variant="body2" align="right" fontWeight="bold">xxx xxx xxx xxx</Typography>
                                <Typography variant="body2" align="right">xxx xxx xxx</Typography>
                                <Typography variant="body2" align="right">xxx</Typography>
                                <Typography variant="body2" align="right">xxx</Typography>
                                <Typography variant="body2" align="right">xxx@gmail.com</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Student Details */}
                    <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: 2
                        }}>
                            <Typography fontSize="26px" align="left" fontWeight="bold">STUDENT</Typography>
                            <Typography variant='body1' align="left" marginTop={1}>
                                # STU-{student.id}
                            </Typography>
                        </Box>
                    </Stack>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        width: "80%",
                        marginY: 4
                    }}>
                        <Box>
                            <Typography variant="body1" mt={0.5}>Name</Typography>
                            <Typography variant="body1" mt={0.5}>Email Address</Typography>
                            <Typography variant="body1" mt={0.5}>Mobile Number</Typography>
                            <Typography variant="body1" mt={0.5}>Address</Typography>
                            <Typography variant="body1" mt={0.5}>NIC</Typography>
                            <Typography variant="body1" mt={0.5}>Passport Number</Typography>
                            <Typography variant="body1" mt={0.5}>Visa Status</Typography>
                            <Typography variant="body1" mt={0.5}>Passport Issue Date</Typography>
                            <Typography variant="body1" mt={0.5}>Passport Expire Date</Typography>
                            <Typography variant="body1" mt={0.5}>Visa Issue Date</Typography>
                            <Typography variant="body1" mt={0.5}>Visa Expire Date</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1" mt={0.5}><span className='px-2'>:</span> {student.titleInfo.title.EN} {student.firstName} {student.lastName}</Typography>
                            <Typography variant="body1" mt={0.5}><span className='px-2'>:</span> {student.email}</Typography>
                            <Typography variant="body1" mt={0.5}><span className='px-2'>:</span> {student.phone}</Typography>
                            <Typography variant="body1" mt={0.5}><span className='px-2 text-nowrap'>:</span> {student.address}</Typography>
                            <Typography variant="body1" mt={0.5}><span className='px-2'>:</span> {student.nic}</Typography>
                            <Typography variant="body1" mt={0.5}><span className='px-2'>:</span> {student.passportNo}</Typography>
                            <Typography variant="body1" mt={0.5}><span className='px-2'>:</span> {student.visaStatusInfo.title.EN}</Typography>
                            <Typography variant="body1" mt={0.5}><span className='px-2'>:</span> {student.issueDate}</Typography>
                            <Typography variant="body1" mt={0.5}><span className='px-2'>:</span> {student.expireDate}</Typography>
                            <Typography variant="body1" mt={0.5}><span className='px-2'>:</span> {student.visaIssueDate ? student.visaIssueDate : "_"}</Typography>
                            <Typography variant="body1" mt={0.5}><span className='px-2'>:</span> {student.visaExpireDate ? student.visaExpireDate : "_"}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <ToastContainer />
        </>
    );
};

export default Student;
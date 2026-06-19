"use client";

import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

import { getLeaveData } from '../services/leave.services';
import { LeaveType } from '../leave.types';

import { TableProps } from '@/modules/qualification/qualification.types';
import CommonTable from '@/components/CommonTable';
import { ColumnType } from '@/type/common.types';


const LeavesTable: React.FC<TableProps> = ({ refreshFlag }) => {
    const [leaves, setLeaves] = useState<LeaveType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);

    const paginatedData = leaves.slice(page * limit, (page + 1) * limit);

    const fetchLeaveData = async (noLoading?: boolean) => {
        try {
            if (!noLoading) {
                setIsLoading(true);
            }
            else {
                setIsLoading(false);
            }
            const response = await getLeaveData();
            if (response?.success) {
                setLeaves(response?.data || []);
            }
        } catch (error) {
            console.log("Error fetching leave data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveData();
    }, []);

    useEffect(() => {
        fetchLeaveData(true);
    }, [limit]);

    useEffect(() => {
        fetchLeaveData();
    }, [refreshFlag]);

      const onPageChange = (newPage: number) => {
        setPage(newPage);
        fetchLeaveData(true);
    };

    const onRowsPerPageChange = (rows: number) => {
        setLimit(rows);
        setPage(0);
    };

    const columns: ColumnType[] = [
        { label: 'ID', key: 'id', align: 'center' },
        { label: 'Type', key: 'type' },
        { label: 'Title', key: 'title' },
        // { label: 'Description', key: 'description' },
    ];

    const expandedContent = (leave: LeaveType) => (
        <>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
                Additional Details:
            </Typography>
            <Typography variant="body2" paragraph>
                <strong>Description:</strong> {leave.description}
            </Typography>
        </>
    );

    return (
        <CommonTable
            totalRows={leaves.length}
            data={paginatedData}
            columns={columns}
            expandedContent={expandedContent}
            loading={isLoading}
            page={page}
            rowsPerPage={limit}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
        />
    );
};

export default LeavesTable;
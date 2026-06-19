"use client";

import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

import { UserType } from '../user.types';
import { getUserData } from '../services/user.services';

import { TableProps } from '@/modules/qualification/qualification.types';
import CommonTable from '@/components/CommonTable';
import { ColumnType } from '@/type/common.types';


const UsersTable: React.FC<TableProps> = ({ refreshFlag }) => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [totalRows, setTotalRows] = useState(0);

    const paginatedUsers = users.slice(page * limit, (page + 1) * limit);

    const fetchUserData = async (noLoading?: boolean) => {
        try {
            if (!noLoading) {
                setIsLoading(true);
            }
            else {
                setIsLoading(false);
            }
            const response = await getUserData();
            if (response?.success) {
                setUsers(response?.data || []);
                setTotalRows(response?.data?.length || 0);
            }
        } catch (error) {
            console.log("Users table fetchUserData error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        fetchUserData(true);
    }, [limit]);

    useEffect(() => {
        fetchUserData();
    }, [refreshFlag]);

     const onPageChange = (newPage: number) => {
        setPage(newPage);
        fetchUserData(true);
    };

    const onRowsPerPageChange = (rows: number) => {
        setLimit(rows);
        setPage(0);
    };

    const columns: ColumnType[] = [
        { label: 'User Name', key: 'firstName' },
        { label: 'Email', key: 'email' },
        { label: 'Phone Number', key: 'phoneNumber' },
        { label: 'User Type', key: 'type' },
    ];

    const expandedContent = () => (
        <>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
                Additional details:
            </Typography>
        </>
    );

    return (
        <CommonTable
            totalRows={totalRows}
            data={paginatedUsers}
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

export default UsersTable;
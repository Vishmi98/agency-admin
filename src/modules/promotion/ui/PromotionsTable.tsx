"use client";

import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

import { getPromotionData } from '../services/promotion.services';
import { PromotionType } from '../promotion.types';

import { TableProps } from '@/modules/qualification/qualification.types';
import CommonTable from '@/components/CommonTable';
import { ColumnType } from '@/type/common.types';


const PromotionsTable: React.FC<TableProps> = ({ refreshFlag }) => {
    const [promotions, setPromotions] = useState<PromotionType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);

    const paginatedData = promotions.slice(page * limit, (page + 1) * limit);

    const fetchPromotionData = async (noLoading?: boolean) => {
        try {
            if (!noLoading) {
                setIsLoading(true);
            }
            else {
                setIsLoading(false);
            }
            const response = await getPromotionData();
            if (response?.success) {
                setPromotions(response?.data || []);
            }
        } catch (error) {
            console.log('Error fetching promotion data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotionData();
    }, []);

    useEffect(() => {
        fetchPromotionData(true);
    }, [limit]);

    useEffect(() => {
        fetchPromotionData();
    }, [refreshFlag]);

    const onPageChange = async (page: number) => {
        setPage(page)
        fetchPromotionData(true);
    }

    const onRowsPerPageChange = async (rows: number) => {
        setLimit(rows);
        setPage(0);
    }

    const columns: ColumnType[] = [
        { label: 'Promotion ID', key: 'id', align: 'center' },
        { label: 'Title', key: 'title' },
        // { label: 'Description', key: 'description' },
        { label: 'Amount', key: 'amount', align: 'right' },
    ];

    const expandedContent = (promotion: PromotionType) => (
        <>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
                Other Details:
            </Typography>
            <Typography variant="body2" paragraph>
                <strong>Description:</strong> {promotion.description}
            </Typography>
        </>
    );

    return (
        <CommonTable
            totalRows={promotions.length}
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

export default PromotionsTable;
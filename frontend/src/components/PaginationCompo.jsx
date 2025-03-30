import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const PaginationCompo = ({totalPage, currentPage, handlePageChange}) => {
    return (
        <Stack spacing={16}>
            <Pagination 
                size="large"
                count={totalPage}
                page={currentPage + 1}
                onChange={handlePageChange}
                renderItem={(item) => (
                    <PaginationItem
                        slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                        {...item}
                    />
                )}
            />
        </Stack>
    )
}
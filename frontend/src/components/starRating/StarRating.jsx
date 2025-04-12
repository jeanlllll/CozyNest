import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

export const StarRating = ({ rating, isReadOnly, setRating }) => {

    const handleReviewOnChange = (event, value) => {
        setRating(value);
    }

    return (
        <Box sx={{ '& > legend': { mt: 2 } }}>

            {isReadOnly && <div>
                <Rating value={rating} max={5} precision={0.1} readOnly size="large" />
            </div>}
            
            {!isReadOnly && <div>
                <Rating defaultValue={0} max={5} precision={0.5} size="large" onChange={handleReviewOnChange}/>
            </div>}

        </Box >
    );
}
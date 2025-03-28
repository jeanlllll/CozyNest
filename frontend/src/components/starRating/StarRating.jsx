import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { useDispatch } from 'react-redux';
import { setRating } from '../../store/features/reviewSlice';

export const StarRating = ({ rate, isReadOnly }) => {
    const dispatch = useDispatch();
    const [value, setValue] = React.useState(rate || 0);

    const handleReviewOnChange = (event, newValue) => {
        setValue(newValue);
        dispatch(setRating(newValue));
    }

    return (
        <Box sx={{ '& > legend': { mt: 2 } }}>

            {isReadOnly && <div>
                <Rating value={value} precision={0.5} readOnly size="large" />
            </div>}
            
            {!isReadOnly && <div>
                <Rating defaultValue={0} max={5} precision={0.5} size="large" onChange={handleReviewOnChange}/>
            </div>}

        </Box >
    );
}
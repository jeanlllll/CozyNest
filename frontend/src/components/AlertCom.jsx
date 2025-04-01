import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

export const AlertCom = ({ message, type }) => {
    return (
        <div className="font-inter">
            <Stack sx={{ width: '100%' }} spacing={2}>
                {type === "success" &&
                    <Alert severity="success" color="success">
                        <Typography sx={{ fontFamily: 'Inter, sans-serif'}}>{message}</Typography>
                    </Alert>}
                {type === "info" && <Alert severity="info">
                    <Typography sx={{ fontFamily: 'Inter, sans-serif'}}>{message}</Typography>
                </Alert>}
                {type === "warning" && <Alert severity="warning">
                    <Typography sx={{ fontFamily: 'Inter, sans-serif'}}>{message}</Typography>
                </Alert>}
                {type === "error" &&
                    <Alert severity="error" color="error">
                        <Typography sx={{ fontFamily: 'Inter, sans-serif'}}>{message}</Typography>
                    </Alert>}
            </Stack>
        </div>

    );
}
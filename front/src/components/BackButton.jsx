import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export const BackButton = ({ route }) => {
    const navigate = useNavigate()
    const goBack = () => {
        navigate(route)
    }
    return (
        <div>
            <Button color='success' onClick={goBack} variant="outlined"
                startIcon={<ArrowBackIosNewIcon />}
            >
                NAZAD
            </Button>
        </div>
    )
}

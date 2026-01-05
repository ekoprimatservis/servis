import React, { useRef } from 'react'
import { AuthWrapper } from '../components/AuthWrapper'
import { BackgroundWrapper } from '../components/BackgroundWrapper'
import { Box } from '@mui/material'
import { BackButton } from '../components/BackButton'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Container } from '../components/Container'

export const Transport = () => {
    return (
        <AuthWrapper>
            <BackgroundWrapper>
                <Box
                    sx={{
                        padding: "5px",
                        // height: "calc(100vh - 10px)",
                    }}
                >
                    <BackButton route={"/home"} />
                    <Box
                        sx={{
                            minWidth: 350,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            // height: "90vh",
                            flexDirection: "column",
                            overflow: 'auto'
                        }}
                    >
                        <DndProvider backend={HTML5Backend}>
                            <Container />
                        </DndProvider>
                    </Box>
                </Box>
            </BackgroundWrapper>
        </AuthWrapper>
    )
}

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AuthWrapper } from '../components/AuthWrapper'
import { BackgroundWrapper } from '../components/BackgroundWrapper'
import { Box } from '@mui/material'
import { BackButton } from '../components/BackButton'
import { PieChart } from '@mui/x-charts/PieChart';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { getBills } from '../apiCalls/useBill'
import { useQuery } from 'react-query'
import { getExpenses } from '../apiCalls/useExpenses'
import { applyDiscount } from '../helper/calculations'
import { ChartsNoDataOverlay } from '@mui/x-charts/ChartsOverlay'
import { theme } from '../helper/theme'

export const Statistics = () => {
    const [selectedDate, setSelectedDate] = useState('')
    const [chartData, setChartData] = useState([])

    const bills = useQuery(["bills", selectedDate], async () => await getBills(selectedDate, 1, 100, null), { enabled: Boolean(selectedDate) });
    const expenses = useQuery(["expenses", selectedDate], async () => await getExpenses(selectedDate), { enabled: Boolean(selectedDate) });


    useLayoutEffect(() => {
        setSelectedDate(new Date())
    }, [])

    useEffect(() => {
        if (bills.isLoading) {
            return
        }
        const billsResaultsWithDiscount = bills?.data?.data.reduce(
            (partialSum, a) => partialSum + applyDiscount(a.attributes.bill_articles.data, a.attributes.discount),
            0
        );
        const billsResaultsNoDiscount = bills?.data?.data.reduce(
            (partialSum, a) => partialSum + applyDiscount(a.attributes.bill_articles.data, 0),
            0
        );
        const expansesResaults = expenses?.data?.data.reduce(
            (partialSum, a) => partialSum + a.attributes.price,
            0
        );
        setChartData([{ id: 0, value: billsResaultsWithDiscount, label: 'Zarada' },
        { id: 1, value: expansesResaults, label: 'Troskovi' },
        { id: 2, value: billsResaultsNoDiscount - billsResaultsWithDiscount, label: 'Popusti' }
        ])
    }, [bills.isLoading])

    return (
        <AuthWrapper>
            <BackgroundWrapper>
                <Box
                    sx={{
                        padding: "5px",
                        height: "calc(100vh - 10px)",
                        minWidth: 360,
                        overflow: 'auto'
                    }}
                >
                    <BackButton route={"/home"} />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "90vh",
                            flexDirection: "column",
                            width: '100%',
                            overflow: 'auto'
                        }}
                    >
                        <Box sx={{
                            display: "flex",
                            background: theme.primary,
                            justifyContent: "space-between",
                            flexDirection: "column",
                            borderRadius: "15px",
                            padding: "2%",
                        }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    views={['year', 'month']}
                                    value={dayjs(selectedDate)}
                                    onChange={(e) => setSelectedDate(new Date(e))}
                                    label="Datum"
                                    disableFuture
                                    required
                                    sx={{ width: '60%', pb: 1 }}
                                />
                            </LocalizationProvider>
                            <Box
                                sx={{
                                    maxWidth: '100vw',
                                    overflowX: 'auto',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        maxWidth: 360,
                                        overflowX: 'auto',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: 1,
                                    }}
                                >
                                    <Box sx={{ position: 'relative', pb: 6 }}> {/* Adds extra space below */}
                                        <PieChart
                                            loading={Boolean(!chartData.length)}
                                            slots={{ noDataOverlay: <ChartsNoDataOverlay /> }}
                                            series={[{ data: chartData }]}
                                            width={Math.min(window.innerWidth, 350)}
                                            height={400}
                                            margin={{ top: 20, bottom: 120 }} // Increased bottom margin
                                            slotProps={{
                                                legend: {
                                                    // direction: props.direction,
                                                    sx: {
                                                        gap: '16px',
                                                        // CSS-in-JS
                                                        // [`.${legendClasses.mark}`]: {
                                                        //     height: 15,
                                                        //     width: 15,
                                                        // },
                                                        // CSS class
                                                        ['.MuiChartsLegend-series']: {
                                                            gap: '8px',
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </BackgroundWrapper>
        </AuthWrapper>
    )
}

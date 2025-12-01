import React, { useEffect } from 'react'
import update from 'immutability-helper'
import type { FC } from 'react'
import { useCallback, useState } from 'react'

import { Card } from './Card'
import { useQuery } from 'react-query'
import { getBills } from '../apiCalls/useBill'
import { Box, Checkbox, CircularProgress, IconButton, Typography } from '@mui/material'
import { formatPhoneNumber } from '../helper/calculations'
import DeleteIcon from '@mui/icons-material/Delete';
import { backgroundRowColor } from '../helper/theme'

const style = {
    width: 800,
    fontWeight: 600
}

export interface Item {
    id: number
    text: string,
}

export interface ContainerState {
    cards: Item[]
}

export const Container: FC = () => {
    {
        const { data, isLoading } = useQuery("bills", async () => await getBills(null, 1, 100, 'Narudzbina | Ima sifru | Transport'));
        const [filtredData, setFiltredData] = useState([{ id: 1, text: '' }])
        const [selectedItems, setSelectedItems] = useState<number[]>([])

        const handleSelectItems = (text: number) => {
            setSelectedItems(prev => prev.includes(text) ? prev.filter(m => m !== text) : [...prev, text])
        }

        const removeSelected = () => {
            setFiltredData(prev => prev.filter(m => !selectedItems.includes(m.id)))
            setSelectedItems([])
        }

        useEffect(() => {
            if (data?.data?.length) {
                // setFiltredData(data.data.filter(m => !m.attributes.deletedFlag && ((m.attributes.additionalId && m.attributes.payed && m.attributes.articles_location === 1) || ((!m.attributes.additionalId && !m.attributes.payed)) || m.attributes.transportReady)).map((m, index) => {
                setFiltredData(data.data.filter(m => ((m?.attributes?.additionalId && m?.attributes?.payed && m?.attributes?.articles_location === 1) || ((!m?.attributes?.additionalId && !m?.attributes?.payed)) || m?.attributes?.transportReady)).map((m, index) => {
                    const { name, surname, address, addressNumber, city, mobile, floor, entrance, apartment } = m.attributes.client_id.data.attributes
                    return {
                        id: index + 1,
                        text: `${m?.attributes?.additionalId || ''} | ${name} ${surname} | ${city} | ${address} ${addressNumber} | ${floor ? 'sprat: ' + floor + ' |' : ''} ${entrance ? 'ulaz: ' + entrance + ' |' : ''} ${apartment ? 'stan: ' + apartment + ' |' : ''} ${formatPhoneNumber(mobile) || 'NEMA BROJ'}`,
                        obj: m.attributes
                    }
                }))
            }
        }, [data])

        const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
            setFiltredData((prevCards: Item[]) =>
                update(prevCards, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevCards[dragIndex] as Item],
                    ],
                }),
            )
        }, [])
        const renderCard = useCallback(
            (card: { id: number; text: string, obj: any }, index: number) => {
                return (
                    <Box
                        // onClick={() => handleSelectItems(card.text)}
                        key={card.id} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ pr: 1 }}>{index + 1}.</Typography>
                        <Card
                            index={index}
                            id={card.id}
                            text={card.text}
                            moveCard={moveCard}
                            backgroundColor={backgroundRowColor(card.obj)}
                        />
                        <Checkbox
                            sx={{
                                color: 'red',
                                '&.Mui-checked': {
                                    color: 'red',
                                },
                            }}
                            onChange={() => handleSelectItems(card.id)}
                        />
                    </Box>
                )
            },
            [],
        )

        return (
            <>
                {isLoading ? (
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            height: "100vh",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress value={100} disableShrink />
                    </Box>) : (<>
                        <Box sx={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <div style={style}>{filtredData.map((card, i) => renderCard(card, i))}</div>
                            <IconButton disabled={!selectedItems.length} color='error' onClick={removeSelected}>
                                <DeleteIcon sx={{ fontSize: 48 }} />
                            </IconButton>
                        </Box>
                    </>
                )}
            </>
        )
    }
}

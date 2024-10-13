import { LineChart } from '@mui/x-charts/LineChart';
import { EntryModel } from "../models/entry.model.ts";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ChartsProps {
    data: EntryModel[];
}

interface ProcessedData {
    temperature: number | null;
    pressure: number | null;
    humidity: number | null;
    readingDate: string;
}

function Charts({ data: originalData }: ChartsProps) {
    const [collectedData, setCollectedData] = useState<ProcessedData[]>([]);
    const [showOriginal, setShowOriginal] = useState(true);
    const oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000).toISOString();
    const deviceCount = 16;

    useEffect(() => {
        const fetchData = async () => {
            let allData: EntryModel[] = [];
            for (let i = 1; i <= deviceCount; i++) {
                try {
                    const response = await axios.get<EntryModel[]>(`http://localhost:3100/api/data/${i}`, {
                        headers: {
                            'x-auth-token': localStorage.getItem('token') || ''
                        }
                    });
                    const filteredData = response.data.filter(item => item.readingDate >= oneHourAgo);
                    allData = allData.concat(filteredData);
                } catch (error) {
                    console.error(`Error fetching data from device ${i}:`, error);
                }
            }
            setCollectedData(processData(allData));
        };

        fetchData();
    }, []);

    const processData = (data: EntryModel[]): ProcessedData[] => data
        .map((item: EntryModel) => ({
            temperature: item.temperature !== undefined ? item.temperature : null,
            pressure: item.pressure !== undefined ? item.pressure : null,
            humidity: item.humidity !== undefined ? item.humidity : null,
            readingDate: new Date(item.readingDate).toISOString()
        }))
        .sort((a, b) => new Date(a.readingDate).getTime() - new Date(b.readingDate).getTime()); 

    const chartDataOriginal = processData(originalData);
    const chartDataCollected = collectedData;
    const xLabelsOriginal = chartDataOriginal.map(item => new Date(item.readingDate).toLocaleString());
    const xLabelsCollected = chartDataCollected.map(item => new Date(item.readingDate).toLocaleString());
    const hasValidData = (data: ProcessedData[]) => data.every(item => item.temperature !== null || item.pressure !== null || item.humidity !== null);

    return (
        <Box sx={{ padding: 2 }}>
            <Box sx={{ marginBottom: 2 }}>
                <Button variant="contained" onClick={() => setShowOriginal(!showOriginal)}>
                    {showOriginal ? 'Show Last Data Reading from 1h' : 'Show Original Data'}
                </Button>
            </Box>

            {showOriginal ? (
                <Box sx={{ marginBottom: 4, paddingBottom: 4, borderBottom: '1px solid #ccc' }}>
                    <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
                        Device Data
                    </Typography>
                    {chartDataOriginal.length && hasValidData(chartDataOriginal) ? (
                        <LineChart
                            width={1000}
                            height={300}
                            series={[
                                { data: chartDataOriginal.map((item: ProcessedData) => item.pressure !== null ? item.pressure / 10 : null), label: 'Pressure x10 [hPa]' },
                                { data: chartDataOriginal.map((item: ProcessedData) => item.humidity !== null ? item.humidity : null), label: 'Humidity [%]' },
                                { data: chartDataOriginal.map((item: ProcessedData) => item.temperature !== null ? item.temperature : null), label: 'Temperature [°C]' },
                            ]}
                            xAxis={[{ scaleType: 'point', data: xLabelsOriginal }]}
                        />
                    ) : (
                        <Typography variant="h6" component="div">
                            No collected data
                        </Typography>
                    )}
                </Box>
            ) : (
                <Box sx={{ marginBottom: 4, paddingBottom: 4, borderBottom: '1px solid #ccc' }}>
                    <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
                        Last Data Reading from 1h
                    </Typography>
                    {chartDataCollected.length && hasValidData(chartDataCollected) ? (
                        <LineChart
                            width={1000}
                            height={300}
                            series={[
                                { data: chartDataCollected.map((item: ProcessedData) => item.pressure !== null ? item.pressure / 10 : null), label: 'Pressure x10 [hPa]' },
                                { data: chartDataCollected.map((item: ProcessedData) => item.humidity !== null ? item.humidity : null), label: 'Humidity [%]' },
                                { data: chartDataCollected.map((item: ProcessedData) => item.temperature !== null ? item.temperature : null), label: 'Temperature [°C]' },
                            ]}
                            xAxis={[{ scaleType: 'point', data: xLabelsCollected }]}
                        />
                    ) : (
                        <Typography variant="h6" component="div">
                            No collected data
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default Charts;
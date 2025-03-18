'use client'
import { useTheme } from '@payloadcms/ui';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface VisitsChartProps {
    data: {
        date: string;
        visits: number;
        uniqueVisitors: number;
    }[];
}

export default function VisitsChart({ data }: VisitsChartProps) {
    // Get Payload config to access theme information
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    // Theme-aware colors
    const colors = {
        background: isDarkMode ? '#222' : 'white',
        text: isDarkMode ? '#e0e0e0' : '#333',
        gridLines: isDarkMode ? '#444' : '#f0f0f0',
        axisLines: isDarkMode ? '#555' : '#ccc',
        axisTicks: isDarkMode ? '#aaa' : '#666',
        tooltipBg: isDarkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.9)',
        tooltipBorder: isDarkMode ? '#555' : '#ddd',
        line1: '#4f46e5', // Primary color - consistent in both modes
        line2: '#10b981', // Secondary color - consistent in both modes
    }

    return (
        <div style={{
            width: '100%',
            padding: '20px',
            backgroundColor: colors.background,
            borderRadius: '8px',
            boxShadow: isDarkMode
                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
            margin: '20px 0'
        }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: colors.text
            }}>
                Page Visits Analytics
            </h2>
            <div style={{ width: '100%', height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.gridLines} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: colors.axisTicks }}
                            axisLine={{ stroke: colors.axisLines }}
                        />
                        <YAxis
                            tick={{ fill: colors.axisTicks }}
                            axisLine={{ stroke: colors.axisLines }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: colors.tooltipBg,
                                borderRadius: '4px',
                                border: `1px solid ${colors.tooltipBorder}`,
                                boxShadow: isDarkMode
                                    ? '0 2px 5px rgba(0, 0, 0, 0.3)'
                                    : '0 2px 5px rgba(0, 0, 0, 0.1)',
                                color: colors.text
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ color: colors.text }}
                        />
                        <Line
                            type="monotone"
                            dataKey="visits"
                            stroke={colors.line1}
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            name="Total Visits"
                        />
                        <Line
                            type="monotone"
                            dataKey="uniqueVisitors"
                            stroke={colors.line2}
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            name="Unique Visitors"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
'use client'
import type { BeforeListTableClientProps } from 'payload'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function MyBeforeListComponent(props: BeforeListTableClientProps) {
    // Sample page visits data - in a real app, this would come from your API/database
    const data = [
        { date: '2023-01-01', visits: 120, uniqueVisitors: 85 },
        { date: '2023-01-02', visits: 145, uniqueVisitors: 97 },
        { date: '2023-01-03', visits: 162, uniqueVisitors: 105 },
        { date: '2023-01-04', visits: 134, uniqueVisitors: 91 },
        { date: '2023-01-05', visits: 187, uniqueVisitors: 110 },
        { date: '2023-01-06', visits: 203, uniqueVisitors: 122 },
        { date: '2023-01-07', visits: 178, uniqueVisitors: 98 },
    ]

    return (
        <div className='bg-red-400' style={{ width: '100%', height: '300px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Page Visits Analytics</h2>
            <ResponsiveContainer width="100%">
                <LineChart data={data}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="visits" stroke="#8884d8" name="Total Visits" />
                    <Line type="monotone" dataKey="uniqueVisitors" stroke="#82ca9d" name="Unique Visitors" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
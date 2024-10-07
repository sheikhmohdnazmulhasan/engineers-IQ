'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Divider } from "@nextui-org/divider"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useTheme } from 'next-themes'

import useAnalytics from '@/hooks/use_analytics'
import useUser from '@/hooks/useUser'

import Loading from '../loading'

export const Analytics: React.FC = () => {
    const { currentUser } = useUser()
    const { data: analyticsData, isLoading, error } = useAnalytics(currentUser?._id as string);
    const { theme } = useTheme();

    if (error || !analyticsData) {
        return (
            <div className=" h-screen flex justify-center flex-col items-center -mt-32">
                <h2 className='text-center'>There is no analytics data to display yet!</h2>
            </div>
        )
    };

    if (isLoading) {
        return <Loading />
    }

    const chartData = analyticsData.articlesSummary.map((article, index) => ({
        name: `Article ${index + 1}`,
        views: article.views,
        claps: article.claps,
        comments: article.comments
    }))

    const isDark = theme === 'dark'
    const chartColor = isDark ? '#8884d8' : '#6366f1'
    const barColor = isDark ? '#00e5ff' : '#3b82f6'
    const axisColor = isDark ? '#888888' : '#4b5563'
    const tooltipBackground = isDark ? '#1f2937' : '#eee'
    const tooltipTextColor = isDark ? '#ffffff' : '#000000'

    return (
        <div className="">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { title: 'Total Views', value: analyticsData.totalViews },
                    { title: 'Total Claps', value: analyticsData.totalClaps },
                    { title: 'Total Comments', value: analyticsData.totalComments }
                ].map((item, index) => (
                    <Card key={index}>
                        <CardBody>
                            <p className="text-2xl font-bold">{item.value}</p>
                            <p className="text-sm text-default-500">{item.title}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Views Summary</h2>
                </CardHeader>
                <Divider />
                <CardBody>
                    <ResponsiveContainer height={200} width="100%">
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" stroke={axisColor} />
                            <YAxis stroke={axisColor} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: tooltipBackground,
                                    border: 'none',
                                    borderRadius: '3px',
                                    color: tooltipTextColor
                                }}
                            />
                            <Line dataKey="views" stroke={chartColor} strokeWidth={2} type="monotone" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {['Claps', 'Comments'].map((metric, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">{metric} Summary</h2>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <ResponsiveContainer height={200} width="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" stroke={axisColor} />
                                    <YAxis stroke={axisColor} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: tooltipBackground,
                                            border: 'none',
                                            color: tooltipTextColor
                                        }}
                                    />
                                    <Bar dataKey={metric.toLowerCase()} fill={barColor} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}
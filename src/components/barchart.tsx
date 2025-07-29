import { useData } from '@/context'
import React, { useEffect, useState } from 'react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const BarChart = () => {
    const { jsonData, llmData } = useData();
    const [chartData, setChartData] = useState<any>({});

    const preparingData = () => {
        try {
            if (!llmData || !jsonData.length) {
                console.log('LLM data or JSON data is not available');
                return;
            }

            const processedData: any = {};

            Object.entries(llmData).forEach(([column, config]) => {
                if (config.charts === 'bar' && config.xkey && config.ykey) {
                    console.log('Processing Column:', column);
                    console.log('Config:', config);
                    console.log('X-key:', config.xkey);
                    console.log('Y-key:', config.ykey);

                    // Format data for Recharts BarChart
                    const rechartsData = jsonData.map((item, index) => {
                        const xValue = item[config.xkey as keyof typeof item];
                        let yValue = item[config.ykey as keyof typeof item];

                        // Handle Score field that might contain asterisks
                        if (typeof yValue === 'string' && column === 'Score') {
                            yValue = parseInt(yValue.replace('*', ''), 10);
                        }

                        // Recharts expects an object with named properties
                        return {
                            [config.xkey!]: xValue,
                            [config.ykey!]: yValue,
                            name: xValue, // For tooltip display
                            value: yValue, // For tooltip display
                            originalData: item
                        };
                    });

                    processedData[column] = {
                        config: config,
                        data: rechartsData,
                        xKey: config.xkey,
                        yKey: config.ykey
                    };

                    console.log(`Recharts Data for ${column}:`, rechartsData);
                    console.log('---');
                }
            });

            setChartData(processedData);

        } catch (error) {
            console.log('Something went wrong: ' + error);
        }
    }

    useEffect(() => {
        preparingData()
    }, [jsonData, llmData])

    return (
        <div className='text-black p-10'>
            <h2 className='text-white text-center font-bold p-2 text-2xl'>Bar Charts</h2>
            
            {Object.entries(chartData).map(([column, chartInfo]: [string, any]) => (
                <div key={column} style={{ 
                    marginBottom: '40px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px'
                }}>
                    <h3 style={{ color: 'green', marginBottom: '20px' }}>
                        {column} Chart
                    </h3>
                    
                    <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                        <div>X-axis: {chartInfo.xKey}</div>
                        <div>Y-axis: {chartInfo.yKey}</div>
                    </div>

                    {/* Recharts Bar Chart */}
                    <ResponsiveContainer width="100%" height={400}>
                        <RechartsBarChart
                            data={chartInfo.data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 60
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey={chartInfo.xKey}
                                angle={-40}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis 
                                label={{ value: chartInfo.yKey, angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip 
                                formatter={(value, name) => [value, chartInfo.yKey]}
                                labelFormatter={(label) => `${chartInfo.xKey}: ${label}`}
                            />
                            
                            <Bar 
                                dataKey={chartInfo.yKey} 
                                fill="#8884d8"
                                name={chartInfo.yKey}
                            />
                        <Legend />
                        </RechartsBarChart>
                    </ResponsiveContainer>

                    {/* Data Preview */}
                    <details style={{ marginTop: '20px' }}>
                        <summary className='text-white' style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                            View Data ({chartInfo.data.length} items)
                        </summary>
                        <div style={{ 
                            maxHeight: '200px', 
                            overflow: 'auto', 
                            backgroundColor: '#f5f5f5', 
                            padding: '10px',
                            marginTop: '10px',
                            borderRadius: '4px'
                        }}>
                            {chartInfo.data.map((dataPoint: any, idx: number) => (
                                <div key={idx} style={{ fontSize: '12px', marginBottom: '2px' }}>
                                    {dataPoint[chartInfo.xKey]}: {dataPoint[chartInfo.yKey]}
                                </div>
                            ))}
                        </div>
                    </details>
                </div>
            ))}

            {Object.keys(chartData).length === 0 && llmData && (
                <div style={{ 
                    textAlign: 'center', 
                    color: '#666', 
                    fontStyle: 'italic',
                    padding: '40px'
                }}>
                    No bar chart configurations found in LLM data
                </div>
            )}

            {/* Debug section */}
            <div style={{ 
                marginTop: '40px', 
                padding: '15px', 
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                fontSize: '14px'
            }}>
                <h4>Debug Info:</h4>
                <div>JSON Data Length: {jsonData.length}</div>
                <div>LLM Data Available: {llmData ? 'Yes' : 'No'}</div>
                <div>Chart Configurations Found: {Object.keys(chartData).join(', ') || 'None'}</div>
            </div>
        </div>
    )
}

export default BarChart
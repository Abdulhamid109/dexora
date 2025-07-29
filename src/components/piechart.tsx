import { useData } from '@/context'
import React, { useEffect, useState } from 'react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const PieChart = () => {
    const { jsonData, llmData } = useData();
    const [chartData, setChartData] = useState<any>({});

    // Colors for pie chart segments
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

    const preparingData = () => {
        try {
            if (!llmData || !jsonData.length) {
                console.log('LLM data or JSON data is not available');
                return;
            }

            const processedData: any = {};

            Object.entries(llmData).forEach(([column, config]) => {
                if (config.charts === 'pie') {
                    console.log('Processing Column:', column);
                    console.log('Config:', config);
                    console.log('Type:', config.type);

                    let rechartsData: any[] = [];

                    if (config.type === 'category' && !config.xkey && !config.ykey) {
                        // For categorical pie charts, count occurrences of each category
                        const categoryCount: { [key: string]: number } = {};
                        
                        jsonData.forEach((item) => {
                            const categoryValue = item[column as keyof typeof item];
                            const categoryString = String(categoryValue);
                            
                            if (categoryCount[categoryString]) {
                                categoryCount[categoryString]++;
                            } else {
                                categoryCount[categoryString] = 1;
                            }
                        });

                        // Convert to recharts format
                        rechartsData = Object.entries(categoryCount).map(([category, count]) => ({
                            name: category,
                            value: count,
                            originalData: { category, count }
                        }));

                    } else if (config.xkey && config.ykey) {
                        // For value-based pie charts
                        rechartsData = jsonData.map((item, index) => {
                            const xValue = item[config.xkey as keyof typeof item];
                            let yValue = item[config.ykey as keyof typeof item];

                            // Handle Score field that might contain asterisks
                            if (typeof yValue === 'string' && column === 'Score') {
                                yValue = parseInt(yValue.replace('*', ''), 10);
                            }

                            return {
                                name: xValue,
                                value: yValue,
                                [config.xkey!]: xValue,
                                [config.ykey!]: yValue,
                                originalData: item
                            };
                        });
                    }

                    if (rechartsData.length > 0) {
                        processedData[column] = {
                            config: config,
                            data: rechartsData,
                            xKey: config.xkey || column,
                            yKey: config.ykey || 'Count',
                            isCategory: config.type === 'category'
                        };

                        console.log(`Recharts Data for ${column}:`, rechartsData);
                        console.log('---');
                    }
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

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize="12"
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className='text-black p-10'>
            <h2 className='text-white text-center font-bold p-2 text-2xl'>Pie Charts</h2>
            
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
                        {chartInfo.isCategory ? (
                            <>
                                <div>Category: {chartInfo.xKey}</div>
                                <div>Shows count of each {column}</div>
                            </>
                        ) : (
                            <>
                                <div>Category: {chartInfo.xKey}</div>
                                <div>Value: {chartInfo.yKey}</div>
                            </>
                        )}
                    </div>

                    {/* Recharts Pie Chart */}
                    <ResponsiveContainer width="100%" height={400}>
                        <RechartsPieChart>
                            <Pie
                                data={chartInfo.data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartInfo.data.map((entry: any, index: number) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index % COLORS.length]} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value, name) => [
                                    value, 
                                    chartInfo.isCategory ? 'Count' : chartInfo.yKey
                                ]}
                                labelFormatter={(label) => `${
                                    chartInfo.isCategory ? column : chartInfo.xKey
                                }: ${label}`}
                            />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                formatter={(value) => value}
                            />
                        </RechartsPieChart>
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
                                    <span style={{ 
                                        display: 'inline-block', 
                                        width: '12px', 
                                        height: '12px', 
                                        backgroundColor: COLORS[idx % COLORS.length],
                                        marginRight: '8px'
                                    }}></span>
                                    {dataPoint.name}: {dataPoint.value}
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
                    No pie chart configurations found in LLM data
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

export default PieChart
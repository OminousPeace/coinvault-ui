
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Button } from '@/components/ui/button';

// Sample data for the chart
const generateData = (days: number, baseValue: number, volatility: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create a value with some randomness for the APY
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    const value = baseValue * randomFactor;
    
    // Add a second line with less volatility for the moving average
    const avgValue = baseValue * (1 + (Math.random() * volatility - volatility/2));
    
    data.push({
      date: date.toLocaleDateString('en-US', { 
        month: 'numeric', 
        day: 'numeric' 
      }),
      value: parseFloat(value.toFixed(2)),
      avgValue: parseFloat(avgValue.toFixed(2))
    });
  }
  
  return data;
};

// Generate sample APY data
const sampleData = generateData(180, 4.2, 0.7);

interface HistoricalRateChartProps {
  title?: string;
}

const HistoricalRateChart: React.FC<HistoricalRateChartProps> = ({ title = "Historical rate" }) => {
  const [chartData] = useState(sampleData);
  const [activeTab, setActiveTab] = useState('APY');
  const [showAverage, setShowAverage] = useState(true);
  const [timeRange, setTimeRange] = useState('1Y');
  
  // Filter data based on time range
  const getRangeData = () => {
    switch (timeRange) {
      case '1D':
        return chartData.slice(-2);
      case '1W':
        return chartData.slice(-7);
      case '1M':
        return chartData.slice(-30);
      case '1Y':
        return chartData;
      default:
        return chartData;
    }
  };
  
  const displayData = getRangeData();
  
  // Find min and max values for YAxis
  const minValue = Math.floor(Math.min(...displayData.map(item => item.value)) * 0.9);
  const maxValue = Math.ceil(Math.max(...displayData.map(item => item.value)) * 1.1);
  
  // Custom tooltip to style the chart tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-vault-dark p-3 border border-vault-accent/30 rounded-lg shadow-lg">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-base font-medium">
            <span className="text-white">{payload[0].value}%</span>
          </p>
          {showAverage && (
            <p className="text-sm text-blue-400">
              Average: {payload[1]?.value}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-vault rounded-xl p-4 border border-vault-light/50 animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        
        <div className="flex space-x-1 bg-vault-light rounded-md p-1">
          {['APY', 'TVL', 'Price'].map(tab => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              className={`text-xs font-medium px-3 py-1 ${
                activeTab === tab
                  ? 'tab-active'
                  : 'text-muted-foreground hover:text-white hover:bg-vault-accent/20'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              tickMargin={10}
            />
            <YAxis 
              domain={[minValue, maxValue]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
              dot={false}
              animationDuration={1000}
            />
            {showAverage && (
              <Line
                type="monotone"
                dataKey="avgValue"
                stroke="#5D6BF6"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
                animationDuration={1000}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between mt-4">
        <div className="flex items-center space-x-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showAverage}
              onChange={() => setShowAverage(!showAverage)}
              className="sr-only"
            />
            <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${
              showAverage ? 'bg-primary border-primary' : 'border-muted-foreground'
            }`}>
              {showAverage && <Check size={12} className="text-white" />}
            </div>
            <span className="text-xs text-muted-foreground">MOVING AVERAGE</span>
          </label>
        </div>
        
        <div className="flex space-x-1">
          {['1D', '1W', '1M', '1Y'].map(range => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              className={`text-xs px-2 ${
                timeRange === range
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-white'
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoricalRateChart;

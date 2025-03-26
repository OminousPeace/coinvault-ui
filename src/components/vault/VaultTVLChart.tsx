
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpDown, Percent, Clock, ChevronRight } from 'lucide-react';
import { VaultMetadata } from '@/utils/contractHelpers';

interface VaultTVLChartProps {
  vaultMetadata: VaultMetadata | null;
}

const VaultTVLChart: React.FC<VaultTVLChartProps> = ({ vaultMetadata }) => {
  const formatTimeSince = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const generateTVLData = () => {
    const data = [];
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-03-05');
    
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= daysDiff; i += 7) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const randomTVL = 10 + Math.random() * 30;
      
      data.push({
        date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tvl: randomTVL,
      });
    }
    
    return data;
  };

  const tvlData = generateTVLData();

  return (
    <div className="lg:col-span-2 bg-vault rounded-xl p-4 border border-vault-light/50">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Vault TVL</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">All Time</span>
            <ChevronRight size={16} className="opacity-70" />
          </div>
        </div>
        
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tvlData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="date" 
                stroke="#888" 
                tick={{ fill: '#888' }}
              />
              <YAxis 
                domain={[0, 50]} 
                ticks={[0, 10, 20, 30, 40, 50]} 
                stroke="#888" 
                tick={{ fill: '#888' }}
                label={{ value: 'TVL', angle: -90, position: 'insideLeft', fill: '#888' }}
              />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#ccc' }}
              />
              <Line 
                type="monotone" 
                dataKey="tvl" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-vault-dark/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Percent size={18} className="mt-0.5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">DAO Fee</div>
                <div className="font-medium">{vaultMetadata ? vaultMetadata.boringDAOFee : '0.1'}%</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <ArrowUpDown size={18} className="mt-0.5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Strategy Allocation</div>
                <div className="font-medium">{vaultMetadata ? vaultMetadata.strategyTargetPercentage : '95'}%</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock size={18} className="mt-0.5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Last Harvest</div>
                <div className="font-medium">{vaultMetadata ? formatTimeSince(vaultMetadata.lastHarvest) : '14 minutes ago'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultTVLChart;


import React from 'react';
import StatCard from '@/components/StatCard';
import { VaultMetadata } from '@/utils/contractHelpers';

interface VaultStatsProps {
  vaultMetadata: VaultMetadata | null;
}

const VaultStats: React.FC<VaultStatsProps> = ({ vaultMetadata }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <StatCard 
        label="TVL" 
        value={vaultMetadata ? `$${parseFloat(vaultMetadata.tvl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$1.62M"} 
        subValue="$2.69M" 
        tooltip="Total Value Locked in the Coinchange DeFi Simple USD vault on Morpho"
        isAnimated={true}
      />
      
      <StatCard 
        label="APY" 
        value={vaultMetadata ? `${vaultMetadata.apy}%` : "4.14%"} 
        subValue="3.87%" 
        tooltip="Annual Percentage Yield - the rate of return on your investment"
        isAnimated={true}
      />
      
      <StatCard 
        label="DAILY" 
        value={vaultMetadata ? `${(parseFloat(vaultMetadata.apy) / 365).toFixed(3)}%` : "0.011%"} 
        subValue="0.0104%" 
        tooltip="Daily interest rate based on the current APY"
        isAnimated={true}
      />
    </div>
  );
};

export default VaultStats;

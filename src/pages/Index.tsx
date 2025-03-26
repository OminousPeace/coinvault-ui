import React, { useState, useEffect } from 'react';
import VaultHeader from '@/components/VaultHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from '@/components/StatCard';
import DepositForm from '@/components/DepositForm';
import InfoTooltip from '@/components/InfoTooltip';
import { toast } from 'sonner';
import { useWeb3 } from '@/context/Web3Context';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpDown, Percent, Clock, ChevronRight } from 'lucide-react';

const Index = () => {
  const { 
    isConnected, 
    vaultMetadata, 
    userData,
    refreshVaultData 
  } = useWeb3();
  
  const [yourDeposit, setYourDeposit] = useState<number>(0);

  useEffect(() => {
    if (userData) {
      setYourDeposit(parseFloat(userData.balance));
    }
  }, [userData]);

  const handleDeposit = (amount: number, token: string) => {
    console.log(`Deposited ${amount} ${token}`);
    setYourDeposit(prev => prev + amount);
    toast.success(`Successfully deposited ${amount} ${token} into the Coinchange DeFi Simple USD vault`);
    
    refreshVaultData();
  };

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
    <div className="min-h-screen bg-vault-dark text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <VaultHeader title="Coinchange DeFi Simple USD vault" />
          <ConnectWalletButton />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <StatCard 
            label="TVL" 
            value={vaultMetadata ? `$${parseFloat(vaultMetadata.totalSupply).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$1.62M"} 
            subValue="$2.69M" 
            tooltip="Total Value Locked in the Coinchange DeFi Simple USD vault"
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
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
                    <Tooltip 
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
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                label="YOUR DEPOSIT" 
                value={yourDeposit === 0 ? "0" : yourDeposit.toFixed(4)}
                isAnimated={true}
              />
              
              <StatCard 
                label="PRICE PER SHARE" 
                value={vaultMetadata ? parseFloat(vaultMetadata.pricePerShare).toFixed(6) : "1.0045"}
                tooltip="Current price of one cDSUSD token"
                isAnimated={true}
              />
            </div>
            
            <Tabs defaultValue="deposit" className="w-full">
              <TabsList className="grid grid-cols-2 bg-vault-light h-12">
                <TabsTrigger value="deposit" className="text-base">Deposit</TabsTrigger>
                <TabsTrigger value="withdraw" className="text-base">Withdraw</TabsTrigger>
              </TabsList>
              <TabsContent value="deposit" className="mt-4 space-y-4">
                <DepositForm 
                  onDeposit={handleDeposit} 
                  depositFee={vaultMetadata ? parseFloat(vaultMetadata.depositFee) : 0} 
                />
                
                <div className="bg-vault-dark p-4 rounded-lg border border-vault-light/30 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 mb-2">
                    <span>The displayed APY accounts for performance fee</span>
                    <InfoTooltip content={`A ${vaultMetadata ? vaultMetadata.performanceFee : '10'}% performance fee is deducted from generated yield.`} />
                  </div>
                  <span>that is deducted from the generated yield only.</span>
                </div>
              </TabsContent>
              <TabsContent value="withdraw">
                <div className="bg-vault p-8 rounded-xl border border-vault-light/50 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg">Withdraw functionality is coming soon</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      You currently have no deposits to withdraw
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;


import React, { useState, useEffect } from 'react';
import VaultHeader from '@/components/VaultHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from '@/components/StatCard';
import DepositForm from '@/components/DepositForm';
import InfoTooltip from '@/components/InfoTooltip';
import { toast } from 'sonner';
import { useWeb3 } from '@/context/Web3Context';
import ConnectWalletButton from '@/components/ConnectWalletButton';

const Index = () => {
  const { 
    isConnected, 
    vaultMetadata, 
    userData,
    refreshVaultData 
  } = useWeb3();
  
  const [yourDeposit, setYourDeposit] = useState<number>(0);

  // Update user deposit from blockchain data
  useEffect(() => {
    if (userData) {
      setYourDeposit(parseFloat(userData.balance));
    }
  }, [userData]);

  const handleDeposit = (amount: number, token: string) => {
    console.log(`Deposited ${amount} ${token}`);
    setYourDeposit(prev => prev + amount);
    toast.success(`Successfully deposited ${amount} ${token} into the Coinchange BTC vault`);
    
    // Refresh data from blockchain
    refreshVaultData();
  };

  // Format the time since last harvest
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

  return (
    <div className="min-h-screen bg-vault-dark text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <VaultHeader title="Coinchange BTC Vault" />
          <ConnectWalletButton />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <StatCard 
            label="TVL" 
            value={vaultMetadata ? `$${parseFloat(vaultMetadata.totalSupply).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$1.62M"} 
            subValue="$2.69M" 
            tooltip="Total Value Locked in the Coinchange BTC Vault"
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
        

          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                label="YOUR DEPOSIT" 
                value={yourDeposit === 0 ? "0" : yourDeposit.toFixed(4)}
                isAnimated={true}
              />
              
              <StatCard 
                label="LAST HARVEST" 
                value={vaultMetadata ? formatTimeSince(vaultMetadata.lastHarvest) : "14 minutes ago"}
                isAnimated={true}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-2 bg-vault rounded-xl p-4 border border-vault-light/50">
                <div className="flex justify-center items-center h-full">
                  <div className="text-center p-8">
                    <h3 className="text-xl font-medium mb-2">Coinchange BTC Vault</h3>
                      <p className="text-muted-foreground">Deposit BTC to earn yield through our diversified strategy
                    </p>
                  </div>
                </div>
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
                    <InfoTooltip content="The APY displayed is net of performance fees, which means it's what you'll actually earn after fees are deducted." />
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

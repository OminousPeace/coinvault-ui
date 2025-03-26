
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from '@/components/StatCard';
import DepositForm from '@/components/DepositForm';
import InfoTooltip from '@/components/InfoTooltip';
import { useWeb3 } from '@/context/Web3Context';
import { VaultMetadata } from '@/utils/contractHelpers';

interface UserDepositsProps {
  vaultMetadata: VaultMetadata | null;
  onDeposit: (amount: number, token: string) => void;
}

const UserDeposits: React.FC<UserDepositsProps> = ({ vaultMetadata, onDeposit }) => {
  const { userData } = useWeb3();
  const [yourDeposit, setYourDeposit] = useState<number>(0);

  useEffect(() => {
    if (userData) {
      setYourDeposit(parseFloat(userData.balance));
    }
  }, [userData]);

  return (
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
            onDeposit={onDeposit} 
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
  );
};

export default UserDeposits;

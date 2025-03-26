
import React, { useState } from 'react';
import VaultHeader from '@/components/VaultHeader';
import { toast } from 'sonner';
import { useWeb3 } from '@/context/Web3Context';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import VaultStats from '@/components/vault/VaultStats';
import VaultTVLChart from '@/components/vault/VaultTVLChart';
import UserDeposits from '@/components/vault/UserDeposits';

const Index = () => {
  const { 
    isConnected, 
    vaultMetadata, 
    refreshVaultData 
  } = useWeb3();

  const handleDeposit = (amount: number, token: string) => {
    console.log(`Deposited ${amount} ${token}`);
    toast.success(`Successfully deposited ${amount} ${token} into the Coinchange DeFi Simple USD vault`);
    
    refreshVaultData();
  };

  return (
    <div className="min-h-screen bg-vault-dark text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <VaultHeader title="Coinchange DeFi Simple USD vault" />
          <ConnectWalletButton />
        </div>
        
        <VaultStats vaultMetadata={vaultMetadata} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <VaultTVLChart vaultMetadata={vaultMetadata} />
          
          <div className="space-y-4">
            <UserDeposits 
              vaultMetadata={vaultMetadata} 
              onDeposit={handleDeposit} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

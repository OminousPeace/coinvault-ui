
import React from 'react';
import { Button } from "@/components/ui/button";
import { useWeb3 } from '@/context/Web3Context';
import { Wallet } from 'lucide-react';

const ConnectWalletButton: React.FC = () => {
  const { isConnected, isConnecting, account, connect, disconnect } = useWeb3();

  if (isConnected && account) {
    const displayAddress = `${account.substring(0, 6)}...${account.substring(
      account.length - 4
    )}`;

    return (
      <Button
        variant="outline"
        className="bg-vault-light hover:bg-vault-accent/30 border-vault-accent/30 flex gap-2"
        onClick={disconnect}
      >
        <Wallet size={16} />
        {displayAddress}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="bg-vault-light hover:bg-vault-accent/30 border-vault-accent/30 flex gap-2"
      onClick={connect}
      disabled={isConnecting}
    >
      <Wallet size={16} />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};

export default ConnectWalletButton;

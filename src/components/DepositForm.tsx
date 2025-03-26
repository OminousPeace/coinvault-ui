
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import TokenLogo from './TokenLogo';
import InfoTooltip from './InfoTooltip';
import { ChevronsUpDown, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from 'sonner';
import { useWeb3 } from '@/context/Web3Context';
import { depositToVault, USDC_ADDRESS, USDT_ADDRESS } from '@/utils/contractHelpers';

const tokens = [
  { symbol: 'USDC', name: 'USD Coin', address: USDC_ADDRESS, balance: 5000, decimals: 6 },
  { symbol: 'USDT', name: 'Tether', address: USDT_ADDRESS, balance: 3500, decimals: 6 },
];

interface DepositFormProps {
  onDeposit: (amount: number, token: string) => void;
  depositFee: number;
}

const DepositForm: React.FC<DepositFormProps> = ({ onDeposit, depositFee = 0 }) => {
  const { isConnected, vaultMetadata, provider, refreshVaultData } = useWeb3();
  const [amount, setAmount] = useState<string>('0');
  const [percentage, setPercentage] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (vaultMetadata) {
      // The deposit fee is now coming from the smart contract via vaultMetadata
    }
  }, [vaultMetadata]);

  const handleSliderChange = (newValue: number[]) => {
    const newPercentage = newValue[0];
    setPercentage(newPercentage);
    
    const calculatedAmount = (selectedToken.balance * newPercentage) / 100;
    setAmount(calculatedAmount.toFixed(calculatedAmount < 0.001 ? 8 : 4));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    if (input === '' || /^\d*\.?\d*$/.test(input)) {
      setAmount(input);
      
      const numAmount = parseFloat(input || '0');
      const newPercentage = Math.min(100, (numAmount / selectedToken.balance) * 100);
      setPercentage(isNaN(newPercentage) ? 0 : newPercentage);
    }
  };

  const handleDeposit = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (numAmount > selectedToken.balance) {
      toast.error('Insufficient balance');
      return;
    }
    
    if (!isConnected || !provider) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the updated depositToVault function that handles token approvals
      const tx = await depositToVault(provider, amount, selectedToken.address);
      
      toast.loading('Transaction pending...', { id: 'deposit' });
      
      await tx.wait();
      
      onDeposit(numAmount, selectedToken.symbol);
      
      await refreshVaultData();
      
      toast.success(`Successfully deposited ${amount} ${selectedToken.symbol} into the Coinchange DeFi Simple USD vault`, { id: 'deposit' });
      
      setAmount('0');
      setPercentage(0);
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Failed to deposit: ' + (error as Error).message, { id: 'deposit' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectToken = (token: typeof selectedToken) => {
    setSelectedToken(token);
    setPopoverOpen(false);
    setAmount('0');
    setPercentage(0);
  };

  const formatBalance = (balance: number) => {
    return balance < 0.001 ? balance.toFixed(8) : balance.toFixed(4);
  };

  const calculateFee = () => {
    if (!vaultMetadata) return depositFee;
    return parseFloat(vaultMetadata.depositFee);
  };

  const calculatePerformanceFee = () => {
    if (!vaultMetadata) return 0;
    return parseFloat(vaultMetadata.performanceFee);
  };

  return (
    <div className="flex flex-col space-y-6 bg-vault rounded-xl p-6 border border-vault-light/50 animate-fade-up">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">You Deposit</h3>
        <div className="text-sm text-muted-foreground">
          Balance: {formatBalance(selectedToken.balance)} {selectedToken.symbol}
        </div>
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-vault-light hover:bg-vault-accent/30 border-vault-accent/30"
              >
                <TokenLogo token={selectedToken.symbol} />
                <span>{selectedToken.symbol}</span>
                <ChevronsUpDown size={16} className="opacity-70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-0 bg-vault-dark border border-vault-accent/30">
              <div className="p-2">
                <div className="text-sm font-medium px-2 py-1.5 text-muted-foreground">Select token</div>
                <div className="mt-2 space-y-1">
                  {tokens.map((token) => (
                    <button
                      key={token.symbol}
                      className={`flex items-center justify-between w-full px-2 py-2 text-left rounded-md hover:bg-vault-light ${
                        token.symbol === selectedToken.symbol ? 'bg-vault-light' : ''
                      }`}
                      onClick={() => selectToken(token)}
                    >
                      <div className="flex items-center gap-2">
                        <TokenLogo token={token.symbol} />
                        <div>
                          <div>{token.symbol}</div>
                          <div className="text-xs text-muted-foreground">{token.name}</div>
                        </div>
                      </div>
                      {token.symbol === selectedToken.symbol && (
                        <Check size={16} className="text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="relative flex-1 ml-3">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full bg-transparent text-right text-2xl font-medium focus:outline-none"
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="mt-6 mb-1 px-1 flex justify-between text-sm text-muted-foreground">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
        
        <Slider
          value={[percentage]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleSliderChange}
          className="my-4"
        />
        
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[25, 50, 75, 100].map((percent) => (
            <Button
              key={percent}
              variant="outline"
              size="sm"
              className="bg-vault-light hover:bg-vault-accent/30 border-vault-accent/30"
              onClick={() => handleSliderChange([percent])}
            >
              {percent}%
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3 mt-2">
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            Deposit Fee
            <InfoTooltip content="The fee charged for depositing into the vault" />
          </div>
          <div>{calculateFee()}%</div>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            Performance Fee
            <InfoTooltip content="Fee taken from the yield generated by the strategy" />
          </div>
          <div>{calculatePerformanceFee()}%</div>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            You Receive
            <InfoTooltip content="Amount of cDSUSD tokens you'll receive" />
          </div>
          <div className="flex items-center gap-1">
            <span>{amount === '0' ? '0' : amount}</span>
            <TokenLogo token="cDSUSD" size="sm" />
            <span>cDSUSD</span>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary/80 text-white font-medium py-6"
        disabled={!isConnected || parseFloat(amount) <= 0 || parseFloat(amount) > selectedToken.balance || isLoading}
        onClick={handleDeposit}
      >
        {!isConnected 
          ? 'Connect Wallet' 
          : parseFloat(amount) > selectedToken.balance 
            ? 'Insufficient Balance' 
            : parseFloat(amount) <= 0 
              ? 'Enter Amount' 
              : isLoading 
                ? 'Processing...' 
                : 'Deposit'}
      </Button>
    </div>
  );
};

export default DepositForm;

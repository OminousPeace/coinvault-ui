
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

const tokens = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.125 },
  { symbol: 'USDC', name: 'USD Coin', balance: 5000 },
  { symbol: 'ETH', name: 'Ethereum', balance: 2.5 },
];

interface DepositFormProps {
  onDeposit: (amount: number, token: string) => void;
  depositFee: number;
}

const DepositForm: React.FC<DepositFormProps> = ({ onDeposit, depositFee = 0 }) => {
  const [amount, setAmount] = useState<string>('0');
  const [percentage, setPercentage] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleSliderChange = (newValue: number[]) => {
    const newPercentage = newValue[0];
    setPercentage(newPercentage);
    
    // Calculate amount based on percentage of the selected token's balance
    const calculatedAmount = (selectedToken.balance * newPercentage) / 100;
    setAmount(calculatedAmount.toFixed(calculatedAmount < 0.001 ? 8 : 4));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Allow empty input or valid number
    if (input === '' || /^\d*\.?\d*$/.test(input)) {
      setAmount(input);
      
      // Calculate percentage based on input amount
      const numAmount = parseFloat(input || '0');
      const newPercentage = Math.min(100, (numAmount / selectedToken.balance) * 100);
      setPercentage(isNaN(newPercentage) ? 0 : newPercentage);
    }
  };

  const handleDeposit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (numAmount > selectedToken.balance) {
      toast.error('Insufficient balance');
      return;
    }
    
    onDeposit(numAmount, selectedToken.symbol);
    toast.success(`Successfully deposited ${numAmount} ${selectedToken.symbol}`);
    
    // Reset form
    setAmount('0');
    setPercentage(0);
  };

  const selectToken = (token: typeof selectedToken) => {
    setSelectedToken(token);
    setPopoverOpen(false);
    // Reset the amount when changing tokens
    setAmount('0');
    setPercentage(0);
  };

  // Format for display
  const formatBalance = (balance: number) => {
    return balance < 0.001 ? balance.toFixed(8) : balance.toFixed(4);
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
                        <TokenLogo token={token.symbol} size="sm" />
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
          <div>{depositFee}%</div>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            You Receive
            <InfoTooltip content="Amount of CFBTC tokens you'll receive" />
          </div>
          <div className="flex items-center gap-1">
            <span>{amount === '0' ? '0' : amount}</span>
            <TokenLogo token="CFBTC" size="sm" />
            <span>CFBTC</span>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary/80 text-white font-medium py-6"
        disabled={parseFloat(amount) <= 0 || parseFloat(amount) > selectedToken.balance}
        onClick={handleDeposit}
      >
        {parseFloat(amount) > selectedToken.balance 
          ? 'Insufficient Balance' 
          : parseFloat(amount) <= 0 
            ? 'Enter Amount' 
            : 'Deposit'}
      </Button>
    </div>
  );
};

export default DepositForm;

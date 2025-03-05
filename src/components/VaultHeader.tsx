
import React from 'react';
import LogoIcon from './LogoIcon';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface VaultHeaderProps {
  title: string;
  chain?: string;
  platform?: string;
}

const VaultHeader: React.FC<VaultHeaderProps> = ({ 
  title = 'cDSUSD',
  chain = 'Ethereum',
  platform = 'Coinchange'
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText('Coinchange DeFi Simple USD vault');
    toast.success('Copied to clipboard!');
  };
  
  return (
    <div className="flex items-center justify-between py-4 animate-fade-up">
      <div className="flex items-center gap-3">
        <LogoIcon />
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex gap-2 items-center text-sm">
          <span className="text-muted-foreground">CHAIN:</span>
          <span className="font-semibold">{chain}</span>
        </div>
        
        <div className="mx-2 hidden sm:block text-muted-foreground">|</div>
        
        <div className="hidden sm:flex gap-2 items-center text-sm">
          <span className="text-muted-foreground">PLATFORM:</span>
          <span className="font-semibold">{platform}</span>
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-md bg-vault-light border-vault-accent/30 hover:bg-vault-accent/30"
            onClick={handleCopy}
          >
            <Copy size={14} />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-md bg-vault-light border-vault-accent/30 hover:bg-vault-accent/30"
          >
            <Share2 size={14} />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-md bg-vault-light border-vault-accent/30 hover:bg-vault-accent/30"
          >
            <ExternalLink size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VaultHeader;

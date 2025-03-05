
import React from 'react';

interface TokenLogoProps {
  token?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TokenLogo: React.FC<TokenLogoProps> = ({ token = 'BTC', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  const getTokenColor = (token: string) => {
    const colors: Record<string, string> = {
      BTC: 'from-amber-500 to-amber-600',
      ETH: 'from-blue-400 to-purple-600',
      USDC: 'from-blue-400 to-blue-600',
      USDT: 'from-green-400 to-green-600',
      CFBTC: 'from-blue-500 to-blue-700',
      cDSUSD: 'from-blue-500 to-blue-700',
      default: 'from-gray-400 to-gray-600',
    };
    
    return colors[token] || colors.default;
  };

  return (
    <div className={`flex-shrink-0 rounded-full ${sizeClasses[size]} bg-gradient-to-br ${getTokenColor(token)} flex items-center justify-center text-white font-bold shadow-md`}>
      {token === 'CFBTC' ? '₵' : token === 'cDSUSD' ? '₵' : token.charAt(0)}
    </div>
  );
};

export default TokenLogo;

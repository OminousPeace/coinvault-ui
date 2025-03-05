import { ethers } from 'ethers';

// ABI for the Coinchange DeFi Simple USD Vault contract
const VAULT_ABI = [
  // Vault info functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  
  // Deposit/Withdraw functions
  "function deposit(uint256 amount) returns (uint256)",
  "function withdraw(uint256 shares) returns (uint256)",
  
  // Transfer functions
  "function transfer(address to, uint256 value) returns (bool)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",
  
  // Vault-specific functions
  "function getPricePerFullShare() view returns (uint256)",
  "function getAPY() view returns (uint256)",
  "function getDepositFee() view returns (uint256)",
  "function getWithdrawalFee() view returns (uint256)",
  "function getLastHarvest() view returns (uint256)",
  
  // Events
  "event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)",
  "event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Updated contract address
export const VAULT_CONTRACT_ADDRESS = "0xef00b163a04df9960eb7d41e40fc8834589a0677";

// Interface for the vault metadata
export interface VaultMetadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  pricePerShare: string;
  apy: string;
  depositFee: string;
  withdrawalFee: string;
  lastHarvest: Date;
}

// Interface for user-specific data
export interface UserVaultData {
  balance: string;
  allowance: string;
}

/**
 * Initialize the vault contract
 */
export const getVaultContract = (provider: ethers.providers.Web3Provider) => {
  return new ethers.Contract(VAULT_CONTRACT_ADDRESS, VAULT_ABI, provider.getSigner());
};

/**
 * Get metadata about the vault
 */
export const getVaultMetadata = async (provider: ethers.providers.Web3Provider): Promise<VaultMetadata> => {
  const contract = getVaultContract(provider);
  
  const [
    name,
    symbol,
    decimals,
    totalSupply,
    pricePerShare,
    apy,
    depositFee,
    withdrawalFee,
    lastHarvestTimestamp
  ] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply(),
    contract.getPricePerFullShare(),
    contract.getAPY(),
    contract.getDepositFee(),
    contract.getWithdrawalFee(),
    contract.getLastHarvest()
  ]);
  
  // Convert big numbers to readable strings
  const formattedTotalSupply = ethers.utils.formatUnits(totalSupply, decimals);
  const formattedPricePerShare = ethers.utils.formatUnits(pricePerShare, decimals);
  
  // APY comes in basis points (1 basis point = 0.01%), so divide by 100 to get percentage
  const formattedAPY = (Number(apy) / 100).toFixed(2);
  
  // Fees come in basis points (1 basis point = 0.01%), so divide by 100 to get percentage
  const formattedDepositFee = (Number(depositFee) / 100).toFixed(2);
  const formattedWithdrawalFee = (Number(withdrawalFee) / 100).toFixed(2);
  
  // Convert timestamp to Date
  const lastHarvest = new Date(Number(lastHarvestTimestamp) * 1000);
  
  return {
    name,
    symbol,
    decimals,
    totalSupply: formattedTotalSupply,
    pricePerShare: formattedPricePerShare,
    apy: formattedAPY,
    depositFee: formattedDepositFee,
    withdrawalFee: formattedWithdrawalFee,
    lastHarvest
  };
};

/**
 * Get user-specific data
 */
export const getUserVaultData = async (
  provider: ethers.providers.Web3Provider,
  userAddress: string
): Promise<UserVaultData> => {
  const contract = getVaultContract(provider);
  
  const [balance, allowance] = await Promise.all([
    contract.balanceOf(userAddress),
    contract.allowance(userAddress, VAULT_CONTRACT_ADDRESS)
  ]);
  
  const decimals = await contract.decimals();
  
  return {
    balance: ethers.utils.formatUnits(balance, decimals),
    allowance: ethers.utils.formatUnits(allowance, decimals)
  };
};

/**
 * Deposit BTC into the vault
 */
export const depositToVault = async (
  provider: ethers.providers.Web3Provider,
  amount: string
): Promise<ethers.ContractTransaction> => {
  const contract = getVaultContract(provider);
  const decimals = await contract.decimals();
  const amountInWei = ethers.utils.parseUnits(amount, decimals);
  
  return await contract.deposit(amountInWei);
};

/**
 * Withdraw BTC from the vault
 */
export const withdrawFromVault = async (
  provider: ethers.providers.Web3Provider,
  amount: string
): Promise<ethers.ContractTransaction> => {
  const contract = getVaultContract(provider);
  const decimals = await contract.decimals();
  const amountInWei = ethers.utils.parseUnits(amount, decimals);
  
  return await contract.withdraw(amountInWei);
};

/**
 * Approve the vault to spend user's BTC
 */
export const approveVault = async (
  provider: ethers.providers.Web3Provider,
  amount: string
): Promise<ethers.ContractTransaction> => {
  // For this function, we assume the BTC token contract is accessible
  // This would need to be implemented with the actual BTC token contract
  // For simplicity, this is a placeholder
  
  // In a real implementation, you would:
  // 1. Get the BTC token contract
  // 2. Call approve(VAULT_CONTRACT_ADDRESS, amount)
  
  throw new Error("This function needs to be implemented with the actual BTC token contract");
};

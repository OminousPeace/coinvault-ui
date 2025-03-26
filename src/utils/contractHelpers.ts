
import { ethers } from 'ethers';

// ABI for the Coinchange Boring Vault contract (cDSUSD)
const VAULT_ABI = [
  // Basic ERC20 functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  
  // Deposit/Withdraw functions
  "function deposit(uint256 amount) returns (uint256)",
  "function withdraw(uint256 shares) returns (uint256)",
  
  // Token transfer functions
  "function transfer(address to, uint256 value) returns (bool)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",
  
  // Boring Vault specific functions
  "function getPricePerFullShare() view returns (uint256)",
  "function getAPY() view returns (uint256)",
  "function getDepositFee() view returns (uint256)",
  "function getWithdrawalFee() view returns (uint256)",
  "function getLastHarvest() view returns (uint256)",
  "function getStrategyTargetPercentage() view returns (uint256)",
  "function getBoringDAOFee() view returns (uint256)",
  "function getPerformanceFee() view returns (uint256)",
  "function getStrategyAddress() view returns (address)",
  
  // Events
  "event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)",
  "event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Contract address for the cDSUSD vault on Ethereum Mainnet
export const VAULT_CONTRACT_ADDRESS = "0xA5269A8e31B93Ff27B887B56720A25F844db0529";

// Stablecoin addresses
export const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

// Interface for vault metadata
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
  strategyTargetPercentage: string;
  boringDAOFee: string;
  performanceFee: string;
  strategyAddress: string;
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
    lastHarvestTimestamp,
    strategyTargetPercentage,
    boringDAOFee,
    performanceFee,
    strategyAddress
  ] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply(),
    contract.getPricePerFullShare(),
    contract.getAPY(),
    contract.getDepositFee(),
    contract.getWithdrawalFee(),
    contract.getLastHarvest(),
    contract.getStrategyTargetPercentage(),
    contract.getBoringDAOFee(),
    contract.getPerformanceFee(),
    contract.getStrategyAddress()
  ]);
  
  // Convert big numbers to readable strings
  const formattedTotalSupply = ethers.utils.formatUnits(totalSupply, decimals);
  const formattedPricePerShare = ethers.utils.formatUnits(pricePerShare, decimals);
  
  // APY comes in basis points (1 basis point = 0.01%), so divide by 100 to get percentage
  const formattedAPY = (Number(apy) / 100).toFixed(2);
  
  // Fees come in basis points, convert to percentage
  const formattedDepositFee = (Number(depositFee) / 100).toFixed(2);
  const formattedWithdrawalFee = (Number(withdrawalFee) / 100).toFixed(2);
  const formattedStrategyTargetPercentage = (Number(strategyTargetPercentage) / 100).toFixed(2);
  const formattedBoringDAOFee = (Number(boringDAOFee) / 100).toFixed(2);
  const formattedPerformanceFee = (Number(performanceFee) / 100).toFixed(2);
  
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
    lastHarvest,
    strategyTargetPercentage: formattedStrategyTargetPercentage,
    boringDAOFee: formattedBoringDAOFee,
    performanceFee: formattedPerformanceFee,
    strategyAddress
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
  
  const [balance, allowanceUSDC, allowanceUSDT] = await Promise.all([
    contract.balanceOf(userAddress),
    // Get allowances for both USDC and USDT
    new ethers.Contract(USDC_ADDRESS, ["function allowance(address,address) view returns (uint256)"], provider).allowance(userAddress, VAULT_CONTRACT_ADDRESS),
    new ethers.Contract(USDT_ADDRESS, ["function allowance(address,address) view returns (uint256)"], provider).allowance(userAddress, VAULT_CONTRACT_ADDRESS)
  ]);
  
  const decimals = await contract.decimals();
  
  return {
    balance: ethers.utils.formatUnits(balance, decimals),
    allowance: ethers.utils.formatUnits(Math.max(Number(allowanceUSDC), Number(allowanceUSDT)), decimals)
  };
};

/**
 * Deposit stablecoins into the vault
 */
export const depositToVault = async (
  provider: ethers.providers.Web3Provider,
  amount: string,
  tokenAddress: string
): Promise<ethers.ContractTransaction> => {
  // First approve the vault to spend tokens
  const tokenContract = new ethers.Contract(
    tokenAddress,
    [
      "function approve(address spender, uint256 amount) returns (bool)",
      "function decimals() view returns (uint8)"
    ],
    provider.getSigner()
  );
  
  const decimals = await tokenContract.decimals();
  const amountInWei = ethers.utils.parseUnits(amount, decimals);
  
  // Approve the vault to spend tokens
  const approveTx = await tokenContract.approve(VAULT_CONTRACT_ADDRESS, amountInWei);
  await approveTx.wait();
  
  // Now deposit to the vault
  const vaultContract = getVaultContract(provider);
  return await vaultContract.deposit(amountInWei);
};

/**
 * Withdraw from the vault
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

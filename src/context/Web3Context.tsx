
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { VaultMetadata, UserVaultData, getVaultMetadata, getUserVaultData } from '@/utils/contractHelpers';

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  vaultMetadata: VaultMetadata | null;
  userData: UserVaultData | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshVaultData: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [vaultMetadata, setVaultMetadata] = useState<VaultMetadata | null>(null);
  const [userData, setUserData] = useState<UserVaultData | null>(null);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connect();
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          await disconnect();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          if (provider) {
            await refreshVaultData();
          }
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account, provider]);

  // Fetch vault data when connected
  useEffect(() => {
    if (provider && account) {
      refreshVaultData();
    }
  }, [provider, account]);

  const connect = async () => {
    if (!window.ethereum) {
      toast.error('No Ethereum wallet detected. Please install MetaMask.');
      return;
    }

    setIsConnecting(true);

    try {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const _signer = _provider.getSigner();
      const _chainId = (await _provider.getNetwork()).chainId;

      setProvider(_provider);
      setSigner(_signer);
      setAccount(accounts[0]);
      setChainId(_chainId);
      setIsConnected(true);

      toast.success('Wallet connected successfully');

      // Fetch initial vault data
      await refreshVaultData(_provider, accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    setVaultMetadata(null);
    setUserData(null);
    toast.info('Wallet disconnected');
  };

  const refreshVaultData = async (_provider?: ethers.providers.Web3Provider, _account?: string) => {
    const activeProvider = _provider || provider;
    const activeAccount = _account || account;
    
    if (!activeProvider || !activeAccount) {
      return;
    }
    
    try {
      const metadata = await getVaultMetadata(activeProvider);
      setVaultMetadata(metadata);
      
      const userVaultData = await getUserVaultData(activeProvider, activeAccount);
      setUserData(userVaultData);
    } catch (error) {
      console.error('Error fetching vault data:', error);
      toast.error('Failed to fetch vault data');
    }
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        isConnected,
        isConnecting,
        vaultMetadata,
        userData,
        connect,
        disconnect,
        refreshVaultData
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

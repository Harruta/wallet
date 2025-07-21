/**
 * Wallet-related TypeScript definitions
 */

export interface WalletState {
  mnemonic: string;
  publicKeys: string[];
  currentIndex: number;
}

export interface SolanaWalletProps {
  mnemonic: string;
  publicKeys: string[];
  onAddWallet: () => Promise<void>;
  onDeleteWallet: (index: number) => void;
  isLoading?: boolean;
}

export interface WalletItem {
  publicKey: string;
  index: number;
  onDelete: (index: number) => void;
  canDelete: boolean;
}

export interface CopyState {
  isSuccess: boolean;
  isLoading: boolean;
  error?: string;
}

export type WalletAction = 
  | { type: 'SET_MNEMONIC'; payload: string }
  | { type: 'SET_PUBLIC_KEYS'; payload: string[] }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'ADD_PUBLIC_KEY'; payload: string }
  | { type: 'DELETE_WALLET'; payload: number }
  | { type: 'RESET_WALLET' }; 
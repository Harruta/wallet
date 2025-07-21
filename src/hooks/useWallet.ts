import { useState, useCallback } from 'react';
import { mnemonicToSeed, generateMnemonic } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';

import type { WalletState } from '../types/wallet';
import { SOLANA_DERIVATION_PATH, ACCOUNT_SUFFIX } from '../constants/wallet';

/**
 * Custom hook for managing Solana wallet operations
 * Handles wallet creation, key derivation, and state management
 */
export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    mnemonic: '',
    publicKeys: [],
    currentIndex: 0,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Derives a Solana keypair from mnemonic at given index
   */
  const deriveKeypair = useCallback(async (mnemonic: string, index: number): Promise<Keypair> => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const derivationPath = `${SOLANA_DERIVATION_PATH}/${index}${ACCOUNT_SUFFIX}`;
      const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      
      return Keypair.fromSecretKey(secret);
    } catch (err) {
      throw new Error(`Failed to derive keypair: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  /**
   * Creates a new wallet with mnemonic and generates first keypair
   */
  const createWallet = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate new mnemonic
      const newMnemonic = generateMnemonic();
      
      // Create first wallet automatically
      const firstKeypair = await deriveKeypair(newMnemonic, 0);
      
      // Update wallet state
      setWalletState({
        mnemonic: newMnemonic,
        publicKeys: [firstKeypair.publicKey.toBase58()],
        currentIndex: 1,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet';
      setError(errorMessage);
      console.error('Wallet creation failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [deriveKeypair]);

  /**
   * Adds a new wallet to the existing seed phrase
   */
  const addWallet = useCallback(async (): Promise<void> => {
    if (!walletState.mnemonic) {
      setError('No mnemonic available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newKeypair = await deriveKeypair(walletState.mnemonic, walletState.currentIndex);
      
      setWalletState(prev => ({
        ...prev,
        publicKeys: [...prev.publicKeys, newKeypair.publicKey.toBase58()],
        currentIndex: prev.currentIndex + 1,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add wallet';
      setError(errorMessage);
      console.error('Add wallet failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [walletState.mnemonic, walletState.currentIndex, deriveKeypair]);

  /**
   * Resets the wallet state
   */
  const resetWallet = useCallback((): void => {
    setWalletState({
      mnemonic: '',
      publicKeys: [],
      currentIndex: 0,
    });
    setError(null);
  }, []);

  return {
    walletState,
    isLoading,
    error,
    createWallet,
    addWallet,
    resetWallet,
  };
}; 
'use client';

// Import Buffer for crypto operations
import { Buffer } from 'buffer';

import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { generateMnemonic } from "bip39";
import nacl from "tweetnacl";

// Simple inline interfaces
interface WalletItemProps {
  publicKey: string;
  index: number;
  onDelete: (index: number) => void;
  canDelete: boolean;
}

// Simple inline wallet item component
function WalletItem({ publicKey, index, onDelete, canDelete }: WalletItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-xl p-5 mb-4 font-mono text-white flex justify-between items-center gap-4 hover:bg-gray-700 transition-all duration-200">
      <div className="flex flex-col gap-2 flex-1 text-left">
        <strong>Wallet {index + 1}:</strong>
        <span className="text-sm text-gray-300 break-all">{publicKey}</span>
      </div>
      
      {canDelete && (
        <div className="flex items-center">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2 animate-slideIn">
              <span className="text-sm text-gray-400 mr-1">Delete?</span>
              <button
                onClick={() => onDelete(index)}
                className="bg-white text-black px-2 py-1 rounded text-sm font-semibold hover:bg-red-600 hover:text-white transition-all duration-200"
              >
                ✓
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-500 text-white px-2 py-1 rounded text-sm font-semibold hover:bg-gray-400 transition-all duration-200"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const createWallet = async () => {
    try {
      setIsAnimating(true);
      
      console.log('Starting wallet creation...');
      const newMnemonic = generateMnemonic();
      console.log('Generated mnemonic:', newMnemonic);
      setMnemonic(newMnemonic);
      
      setPublicKeys([]);
      setCurrentIndex(0);
      
      // Create first wallet
      console.log('Converting mnemonic to seed...');
      const seed = await mnemonicToSeed(newMnemonic);
      console.log('Seed generated successfully');
      
      const path = `m/44'/501'/0'/0'`;
      console.log('Deriving path:', path);
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      console.log('Path derived successfully');
      
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      console.log('Secret key generated');
      
      const keypair = Keypair.fromSecretKey(secret);
      console.log('Keypair created:', keypair.publicKey.toBase58());
      
      setPublicKeys([keypair.publicKey.toBase58()]);
      setCurrentIndex(1);

             setTimeout(() => {
         console.log('Showing wallet content...');
         console.log('Mnemonic set:', !!newMnemonic);
         console.log('Public keys length:', publicKeys.length);
         setShowContent(true);
         setIsAnimating(false);
       }, 1000);
    } catch (error) {
      console.error('Error creating wallet:', error);
      setIsAnimating(false);
      alert('Failed to create wallet: ' + (error as Error).message);
    }
  };

  const addWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      setCurrentIndex(currentIndex + 1);
      setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]);
    } catch (error) {
      console.error('Error adding wallet:', error);
      alert('Failed to add wallet: ' + (error as Error).message);
    }
  };

  const deleteWallet = (index: number) => {
    if (publicKeys.length <= 1) {
      alert('Cannot delete the last wallet');
      return;
    }
    setPublicKeys(publicKeys.filter((_, i) => i !== index));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-center p-8 text-white">
      <h1 className="text-4xl font-semibold mb-8">Solana Wallet Generator</h1>
      
      {/* Debug info - remove this later */}
      <div className="text-xs text-gray-500 mb-4 text-left max-w-md mx-auto">
        
        
      </div>
      
      <button 
        onClick={createWallet}
        disabled={isAnimating}
        className="block mx-auto text-xl px-10 py-5 bg-white text-black rounded-xl font-semibold min-w-[200px] hover:bg-gray-100 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isAnimating ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
            Creating Wallet...
          </div>
        ) : (
          'Create Sol Wallet'
        )}
      </button>

      {/* Loading Animation */}
      {isAnimating && (
        <div className="flex flex-col items-center justify-center min-h-[400px] mt-8 animate-fadeIn">
          <div className="relative flex items-center justify-center w-30 h-30 mb-8">
            <div className="absolute border-2 border-white/30 rounded-full w-20 h-20 animate-pulse-custom"></div>
            <div className="absolute border-2 border-white/30 rounded-full w-25 h-25 animate-pulse-custom" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute border-2 border-white/30 rounded-full w-30 h-30 animate-pulse-custom" style={{animationDelay: '0.6s'}}></div>
            <div className="w-12 h-12 text-white z-10 animate-float">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zM12 16h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
          </div>
          <p className="text-gray-400 text-lg animate-fadeInOut">
            Generating your secure wallet...
          </p>
        </div>
      )}

      {/* Wallet content */}
      {mnemonic && showContent && (
        <div className="mt-8 opacity-0 translate-y-7 animate-slideInUp">
          {/* Wallets */}
          <div className="mb-8">
            <h2 className="text-white text-2xl font-semibold mb-6 text-center">
              Solana Wallets
            </h2>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 mb-8">
              {publicKeys.length === 0 ? (
                <div className="text-gray-400 italic p-8 text-center">No wallets created yet</div>
              ) : (
                publicKeys.map((publicKey, index) => (
                  <WalletItem
                    key={`wallet-${index}-${publicKey.slice(-8)}`}
                    publicKey={publicKey}
                    index={index}
                    onDelete={deleteWallet}
                    canDelete={publicKeys.length > 1}
                  />
                ))
              )}
              <button
                onClick={addWallet}
                className="bg-white text-black border-none rounded-xl px-8 py-4 text-base font-semibold cursor-pointer transition-all duration-200 mt-4 hover:bg-gray-100 hover:-translate-y-0.5"
              >
                Add Wallet
              </button>
            </div>
          </div>

          {/* Mnemonic */}
          <div 
            className="bg-gray-900 border border-gray-700 rounded-3xl p-12 mt-8 relative cursor-pointer transition-all duration-200 hover:bg-gray-800 hover:border-gray-600" 
            onClick={copyToClipboard}
          >
            <h2 className="text-white text-3xl font-semibold mb-4 text-center">
              Your Secret Phrase
            </h2>
            <p className="text-gray-400 text-base mb-8 text-center">
              Store this phrase safely. It&apos;s the only way to recover your wallets.
            </p>
            
            <div className="grid grid-cols-4 gap-4 my-8 max-w-4xl mx-auto md:grid-cols-3 sm:grid-cols-2">
              {mnemonic.split(' ').map((word, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-4 font-mono transition-all duration-200 text-white text-left flex items-center hover:bg-gray-700 hover:border-gray-600 hover:-translate-y-0.5">
                  <span className="font-semibold text-gray-500 mr-2 text-sm min-w-[20px]">
                    {index + 1}
                  </span>
                  <span className="flex-1">{word}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8 text-gray-500 text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              <span>Click Anywhere To Copy</span>
            </div>
            
            <button
              onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
              className="bg-white text-black border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer transition-all duration-200 mt-4 hover:bg-gray-100 hover:-translate-y-0.5"
            >
              Copy Secret Phrase
            </button>
            
            {copySuccess && (
              <div className="text-green-400 text-sm mt-2 opacity-100 transition-opacity duration-300">
                ✓ Copied to clipboard!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

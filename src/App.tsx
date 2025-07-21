import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { generateMnemonic } from "bip39";
import nacl from "tweetnacl";
import './App.css'

interface SolanaWalletProps {
  mnemonic: string;
  publicKeys: string[];
  setPublicKeys: (keys: string[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onDeleteWallet: (index: number) => void;
}

export function SolanaWallet({ 
  mnemonic, 
  publicKeys, 
  setPublicKeys, 
  currentIndex, 
  setCurrentIndex,
  onDeleteWallet
}: SolanaWalletProps) {
  const addWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    setCurrentIndex(currentIndex + 1);
    setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]);
  };

  return (
    <div className="wallet-section">
      <h2>Solana Wallets</h2>
      <div className="wallet-list">
        {publicKeys.length === 0 ? (
          <div className="empty-state">No wallets created yet</div>
        ) : (
          publicKeys.map((publicKey: string, index: number) => (
            <WalletItem
              key={`wallet-${index}-${publicKey.slice(-8)}`}
              publicKey={publicKey}
              index={index}
              onDelete={onDeleteWallet}
              canDelete={publicKeys.length > 1}
            />
          ))
        )}
        <button onClick={addWallet} className="add-wallet-button">
          Add Wallet
        </button>
      </div>
    </div>
  );
}

interface WalletItemProps {
  publicKey: string;
  index: number;
  onDelete: (index: number) => void;
  canDelete: boolean;
}

function WalletItem({ publicKey, index, onDelete, canDelete }: WalletItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (): void => {
    if (!canDelete) return;
    setShowConfirm(true);
  };

  const handleConfirmDelete = (): void => {
    onDelete(index);
    setShowConfirm(false);
  };

  const handleCancelDelete = (): void => {
    setShowConfirm(false);
  };

  return (
    <div className="wallet-item">
      <div className="wallet-info">
        <strong>Wallet {index + 1}:</strong>
        <span className="wallet-address">{publicKey}</span>
      </div>
      
      <div className="wallet-actions">
        {canDelete && (
          <>
            {!showConfirm ? (
              <button
                onClick={handleDeleteClick}
                className="delete-wallet-button"
                aria-label={`Delete wallet ${index + 1}`}
                type="button"
              >
                Delete
              </button>
            ) : (
              <div className="delete-confirmation">
                <span className="confirm-text">Delete?</span>
                <button
                  onClick={handleConfirmDelete}
                  className="confirm-delete-button"
                  aria-label="Confirm delete wallet"
                  type="button"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="cancel-delete-button"
                  aria-label="Cancel delete wallet"
                  type="button"
                >
                  ✕
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  const [mnemonic, setMnemonic] = useState<string>('')
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const createWallet = async () => {
    setIsAnimating(true);
    
    // Generate mnemonic
    const newMnemonic = generateMnemonic() 
    setMnemonic(newMnemonic)
    
    // Reset wallet state
    setPublicKeys([]);
    setCurrentIndex(0);
    
    // Create first wallet automatically
    const seed = await mnemonicToSeed(newMnemonic);
    const path = `m/44'/501'/0'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    
    setPublicKeys([keypair.publicKey.toBase58()]);
    setCurrentIndex(1);

    // Show content after a brief delay for animation effect
    setTimeout(() => {
      setShowContent(true);
      setIsAnimating(false);
    }, 1000);
  }

  const deleteWallet = (index: number): void => {
    // Prevent deletion if only one wallet remains
    if (publicKeys.length <= 1) {
      alert('Cannot delete the last wallet. You must have at least one wallet.');
      return;
    }

    // Validate index
    if (index < 0 || index >= publicKeys.length) {
      alert('Invalid wallet index');
      return;
    }

    // Remove wallet at specified index
    const updatedPublicKeys = publicKeys.filter((_, i) => i !== index);
    setPublicKeys(updatedPublicKeys);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = mnemonic;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Check if wallet has been created
  const hasWallet = Boolean(mnemonic);

  return (
    <div className="app">
      <h1>Solana Wallet Generator</h1>
      
      <button 
        onClick={createWallet} 
        className={`create-wallet-button ${isAnimating ? 'creating' : ''}`}
        disabled={isAnimating}
      >
        {isAnimating ? (
          <>
            <div className="loading-spinner"></div>
            Creating Wallet...
          </>
        ) : (
          'Create Sol Wallet'
        )}
      </button>

      {/* Loading Animation */}
      {isAnimating && (
        <div className="creation-animation">
          <div className="animation-container">
            <div className="pulse-ring"></div>
            <div className="pulse-ring pulse-ring-2"></div>
            <div className="pulse-ring pulse-ring-3"></div>
            <div className="wallet-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zM12 16h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
          </div>
          <p className="animation-text">Generating your secure wallet...</p>
        </div>
      )}

      {/* Wallet Display Section - Only show when wallet exists and animation is complete */}
      {hasWallet && showContent && (
        <div className="wallet-content-container">
          <SolanaWallet 
            mnemonic={mnemonic}
            publicKeys={publicKeys}
            setPublicKeys={setPublicKeys}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            onDeleteWallet={deleteWallet}
          />
          
          <div className="mnemonic-section" onClick={copyToClipboard}>
            <h2>Your Secret Phrase</h2>
            <p className="mnemonic-description">
              Store this phrase safely. It's the only way to recover your wallets.
            </p>
            <div className="mnemonic-grid">
              {mnemonic.split(' ').map((word: string, index: number) => (
                <div key={index} className="mnemonic-word">
                  <span className="word-number">{index + 1}</span>
                  <span className="word-text">{word}</span>
                </div>
              ))}
            </div>
            <div className="copy-instruction">
              <svg className="copy-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              Click Anywhere To Copy
            </div>
            <button onClick={(e) => { e.stopPropagation(); copyToClipboard(); }} className="copy-button">
              Copy Secret Phrase
            </button>
            <div className={`copy-success ${copySuccess ? 'show' : ''}`}>
              ✓ Copied to clipboard!
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
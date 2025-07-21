// React hooks
import { useState } from 'react';

// Custom hooks
import { useWallet } from './hooks/useWallet';
import { useClipboard } from './hooks/useClipboard';

// Components
import { SolanaWallet } from './components/SolanaWallet';
import { MnemonicDisplay } from './components/MnemonicDisplay';
import { ErrorBoundary } from './components/ErrorBoundary';

// Constants
import { BUTTON_LABELS } from './constants/wallet';

// Styles
import './App.css';

/**
 * Main application component
 * Manages wallet creation and displays wallet information with mnemonic phrase
 */
const App: React.FC = () => {
  // Animation state
  const [showContent, setShowContent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Wallet operations hook
  const {
    walletState,
    isLoading: isWalletLoading,
    error: walletError,
    createWallet,
    addWallet,
  } = useWallet();

  // Clipboard operations hook
  const { copyState, copyToClipboard } = useClipboard();

  // Handler for creating a new wallet
  const handleCreateWallet = async (): Promise<void> => {
    setIsAnimating(true);
    await createWallet();
    
    // Show content after a brief delay for animation effect
    setTimeout(() => {
      setShowContent(true);
      setIsAnimating(false);
    }, 1000);
  };

  // Handler for copying mnemonic to clipboard
  const handleCopyMnemonic = async (): Promise<void> => {
    if (walletState.mnemonic) {
      await copyToClipboard(walletState.mnemonic);
    }
  };

  // Check if wallet has been created
  const hasWallet = Boolean(walletState.mnemonic);

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>Solana Wallet Generator</h1>
        </header>

        <main className="app-main">
          {/* Wallet Creation Section */}
          <section className="wallet-creation-section">
            <button
              onClick={handleCreateWallet}
              className={`create-wallet-button ${isAnimating ? 'creating' : ''}`}
              disabled={isWalletLoading}
              aria-label="Create new Solana wallet"
              type="button"
            >
              {isWalletLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating Wallet...
                </>
              ) : (
                BUTTON_LABELS.CREATE_WALLET
              )}
            </button>

            {/* Display wallet error if exists */}
            {walletError && (
              <div className="error-message" role="alert">
                <strong>Error:</strong> {walletError}
              </div>
            )}
          </section>

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
              {/* Solana Wallets List */}
              <SolanaWallet
                mnemonic={walletState.mnemonic}
                publicKeys={walletState.publicKeys}
                onAddWallet={addWallet}
                isLoading={isWalletLoading}
              />

              {/* Mnemonic Phrase Display */}
              <MnemonicDisplay
                mnemonic={walletState.mnemonic}
                copyState={copyState}
                onCopy={handleCopyMnemonic}
              />
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
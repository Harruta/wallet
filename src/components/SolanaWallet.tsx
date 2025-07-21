import type { SolanaWalletProps, WalletItem } from '../types/wallet';
import { MESSAGES, BUTTON_LABELS } from '../constants/wallet';

/**
 * Individual wallet item component
 */
const WalletItem: React.FC<WalletItem> = ({ publicKey, index }) => (
  <div className="wallet-item">
    <strong>Wallet {index + 1}:</strong> {publicKey}
  </div>
);

/**
 * Empty state component when no wallets exist
 */
const EmptyWalletState: React.FC = () => (
  <div className="empty-state">{MESSAGES.NO_WALLETS}</div>
);

/**
 * Solana wallet list component
 * Displays generated wallets and provides functionality to add more
 */
export const SolanaWallet: React.FC<SolanaWalletProps> = ({
  publicKeys,
  onAddWallet,
  isLoading = false,
}) => {
  const handleAddWallet = async (): Promise<void> => {
    if (isLoading) return;
    await onAddWallet();
  };

  return (
    <div className="wallet-section">
      <h2>Solana Wallets</h2>
      
      <div className="wallet-list">
        {publicKeys.length === 0 ? (
          <EmptyWalletState />
        ) : (
          <>
            {publicKeys.map((publicKey, index) => (
              <WalletItem
                key={`wallet-${index}`}
                publicKey={publicKey}
                index={index}
              />
            ))}
          </>
        )}
        
        <button
          onClick={handleAddWallet}
          className="add-wallet-button"
          disabled={isLoading}
          aria-label="Add new wallet"
        >
          {isLoading ? 'Adding...' : BUTTON_LABELS.ADD_WALLET}
        </button>
      </div>
    </div>
  );
}; 
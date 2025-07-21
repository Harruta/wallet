import { useState } from 'react';
import type { SolanaWalletProps, WalletItem } from '../types/wallet';
import { MESSAGES, BUTTON_LABELS } from '../constants/wallet';

/**
 * Individual wallet item component with delete functionality
 */
const WalletItem: React.FC<WalletItem> = ({ publicKey, index, onDelete, canDelete }) => {
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
                {BUTTON_LABELS.DELETE_WALLET}
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
};

/**
 * Empty state component when no wallets exist
 */
const EmptyWalletState: React.FC = () => (
  <div className="empty-state">{MESSAGES.NO_WALLETS}</div>
);

/**
 * Solana wallet list component
 * Displays generated wallets with add and delete functionality
 */
export const SolanaWallet: React.FC<SolanaWalletProps> = ({
  publicKeys,
  onAddWallet,
  onDeleteWallet,
  isLoading = false,
}) => {
  const handleAddWallet = async (): Promise<void> => {
    if (isLoading) return;
    await onAddWallet();
  };

  const handleDeleteWallet = (index: number): void => {
    onDeleteWallet(index);
  };

  // Don't allow deletion if only one wallet remains
  const canDeleteWallets = publicKeys.length > 1;

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
                key={`wallet-${index}-${publicKey.slice(-8)}`}
                publicKey={publicKey}
                index={index}
                onDelete={handleDeleteWallet}
                canDelete={canDeleteWallets}
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
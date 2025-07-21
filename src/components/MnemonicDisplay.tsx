import type { CopyState } from '../types/wallet';
import { MESSAGES, BUTTON_LABELS } from '../constants/wallet';

interface MnemonicWordProps {
  word: string;
  index: number;
}

interface MnemonicDisplayProps {
  mnemonic: string;
  copyState: CopyState;
  onCopy: () => Promise<void>;
}

/**
 * Individual mnemonic word component
 */
const MnemonicWord: React.FC<MnemonicWordProps> = ({ word, index }) => (
  <div className="mnemonic-word">
    <span className="word-number">{index + 1}</span>
    <span className="word-text">{word}</span>
  </div>
);

/**
 * Copy instruction component with icon
 */
const CopyInstruction: React.FC = () => (
  <div className="copy-instruction">
    <svg className="copy-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
    <span>{MESSAGES.COPY_INSTRUCTION}</span>
  </div>
);

/**
 * Copy status indicator component
 */
const CopyStatus: React.FC<{ copyState: CopyState }> = ({ copyState }) => {
  if (copyState.isLoading) {
    return <div className="copy-loading">Copying...</div>;
  }

  if (copyState.error) {
    return <div className="copy-error">Error: {copyState.error}</div>;
  }

  if (copyState.isSuccess) {
    return <div className="copy-success show">{MESSAGES.COPY_SUCCESS}</div>;
  }

  return <div className="copy-success" aria-live="polite" />;
};

/**
 * Mnemonic phrase display component
 * Shows the seed phrase with copy functionality and proper accessibility
 */
export const MnemonicDisplay: React.FC<MnemonicDisplayProps> = ({
  mnemonic,
  copyState,
  onCopy,
}) => {
  const mnemonicWords = mnemonic.split(' ');
  
  const handleSectionClick = async (): Promise<void> => {
    await onCopy();
  };

  const handleButtonClick = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation(); // Prevent section click from firing
    await onCopy();
  };

  return (
    <section 
      className="mnemonic-section" 
      onClick={handleSectionClick}
      role="button"
      tabIndex={0}
      aria-label="Click to copy secret phrase"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSectionClick();
        }
      }}
    >
      <h2>Your Secret Phrase</h2>
      
      <p className="mnemonic-description">
        {MESSAGES.STORE_SAFELY}
      </p>
      
      <div className="mnemonic-grid" role="grid" aria-label="Secret recovery phrase">
        {mnemonicWords.map((word, index) => (
          <MnemonicWord
            key={`word-${index}`}
            word={word}
            index={index}
          />
        ))}
      </div>
      
      <CopyInstruction />
      
      <button
        onClick={handleButtonClick}
        className="copy-button"
        disabled={copyState.isLoading}
        aria-label="Copy secret phrase to clipboard"
        type="button"
      >
        {copyState.isLoading ? 'Copying...' : BUTTON_LABELS.COPY_PHRASE}
      </button>
      
      <CopyStatus copyState={copyState} />
    </section>
  );
}; 
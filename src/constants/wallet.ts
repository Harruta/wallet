/**
 * Wallet application constants
 */

// Solana derivation path constants
export const SOLANA_DERIVATION_PATH = "m/44'/501'";
export const ACCOUNT_SUFFIX = "'/0'";

// UI Constants
export const COPY_SUCCESS_TIMEOUT = 2000;
export const MNEMONIC_WORDS_COUNT = 12;

// Grid layout breakpoints
export const GRID_COLUMNS = {
  DESKTOP: 4,
  TABLET: 3,
  MOBILE: 2,
} as const;

// Messages
export const MESSAGES = {
  NO_WALLETS: 'No wallets created yet',
  COPY_SUCCESS: '✓ Copied to clipboard!',
  COPY_INSTRUCTION: 'Click Anywhere To Copy',
  STORE_SAFELY: "Store this phrase safely. It's the only way to recover your wallets.",
  COPY_ERROR: 'Failed to copy to clipboard',
} as const;

// Button labels
export const BUTTON_LABELS = {
  CREATE_WALLET: 'Create Sol Wallet',
  ADD_WALLET: 'Add Wallet',
  COPY_PHRASE: 'Copy Secret Phrase',
} as const; 
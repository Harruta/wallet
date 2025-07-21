import { useState, useCallback } from 'react';
import type { CopyState } from '../types/wallet';
import { COPY_SUCCESS_TIMEOUT, MESSAGES } from '../constants/wallet';

/**
 * Custom hook for clipboard operations
 * Provides copy functionality with loading states and error handling
 */
export const useClipboard = () => {
  const [copyState, setCopyState] = useState<CopyState>({
    isSuccess: false,
    isLoading: false,
    error: undefined,
  });

  /**
   * Fallback copy method for older browsers
   */
  const fallbackCopy = (text: string): boolean => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return false;
    }
  };

  /**
   * Copies text to clipboard with modern API and fallback support
   */
  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    if (!text?.trim()) {
      setCopyState({
        isSuccess: false,
        isLoading: false,
        error: 'No text to copy',
      });
      return;
    }

    setCopyState({ isSuccess: false, isLoading: true, error: undefined });

    try {
      // Try modern clipboard API first
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const success = fallbackCopy(text);
        if (!success) {
          throw new Error('Clipboard operation not supported');
        }
      }

      // Success state
      setCopyState({ isSuccess: true, isLoading: false, error: undefined });
      
      // Reset success state after timeout
      setTimeout(() => {
        setCopyState(prev => ({ ...prev, isSuccess: false }));
      }, COPY_SUCCESS_TIMEOUT);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : MESSAGES.COPY_ERROR;
      setCopyState({
        isSuccess: false,
        isLoading: false,
        error: errorMessage,
      });
      
      console.error('Copy to clipboard failed:', err);
    }
  }, []);

  /**
   * Resets copy state
   */
  const resetCopyState = useCallback((): void => {
    setCopyState({ isSuccess: false, isLoading: false, error: undefined });
  }, []);

  return {
    copyState,
    copyToClipboard,
    resetCopyState,
  };
}; 
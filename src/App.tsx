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
}

export function SolanaWallet({ 
  mnemonic, 
  publicKeys, 
  setPublicKeys, 
  currentIndex, 
  setCurrentIndex 
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
            <div key={index} className="wallet-item">
              <strong>Wallet {index + 1}:</strong> {publicKey}
            </div>
          ))
        )}
        <button onClick={addWallet} className="add-wallet-button">
          Add Wallet
        </button>
      </div>
    </div>
  );
}

function App() {
  const [mnemonic, setMnemonic] = useState<string>('')
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const createWallet = async () => {
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
  }

  return (
    <div className="app">
      <h1> Solana Wallet Generator</h1>
      
      <button onClick={createWallet} className="create-wallet-button">
        Create Sol Wallet
      </button>

      {mnemonic && (
        <>
          <SolanaWallet 
            mnemonic={mnemonic}
            publicKeys={publicKeys}
            setPublicKeys={setPublicKeys}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
          
          <div className="mnemonic-section">
            <h2>🔐 Secret Recovery Phrase</h2>
            <p style={{ color: '#888', fontSize: '0.9em', marginBottom: '1rem' }}>
              Store this phrase safely. It's the only way to recover your wallets.
            </p>
            <div className="mnemonic-grid">
              {mnemonic.split(' ').map((word: string, index: number) => (
                <div key={index} className="mnemonic-word">
                  <span className="word-number">{index + 1}.</span>
                  {word}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
   )
}

export default App
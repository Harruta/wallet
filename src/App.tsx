import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { generateMnemonic } from "bip39";
import nacl from "tweetnacl";
import './App.css'

interface SolanaWalletProps {
  mnemonic: string;
}

export function SolanaWallet({ mnemonic }: SolanaWalletProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);

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
    <div>
      <button onClick={addWallet}>
        Add wallet
      </button>
      {publicKeys.map((publicKey: string, index: number) => (
        <div key={index}>
          {publicKey}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [mnemonic, setMnemonic] = useState<string>('')

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic() 
    setMnemonic(newMnemonic)
    console.log(newMnemonic)
    console.log(mnemonic)
  }

  return (
    <div className="app">
      <button onClick={handleGenerateMnemonic}>
        Generate Mnemonic
      </button>
      <h1>Secret Recovery Phrase</h1>
      {mnemonic && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#004030'}}>
          <h3>Generated Mnemonic</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px'}}>
            {mnemonic.split(' ').map((word: string, index: number) => (
              <div key={index} style={{
                padding: '10px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                <span style={{
                  fontWeight: 'bold'
                }}>
                  {index + 1}.
                </span>
                {word}
              </div>
            ))}
          </div> 
          <SolanaWallet mnemonic={mnemonic} />
        </div>
      )}
    </div>
   )
}

export default App
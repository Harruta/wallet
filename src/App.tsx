import { useState } from "react";
import { generateMnemonic } from "bip39";
import './App.css'

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
      </div>
      )}
    </div>
   )
}

export default App
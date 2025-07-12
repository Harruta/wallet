import { useState } from 'react'
import { generateMnemonic } from 'bip39'
import './App.css'

function App() {
  const [mnemonic, setMnemonic] = useState<string>('')

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic()
    setMnemonic(newMnemonic)
    // Remove console.log in production for security
    console.log('Generated Mnemonic:', newMnemonic)
  }

  return (
    <div className="App">
      <button onClick={handleGenerateMnemonic}>
        Generate Mnemonic
      </button>
      <h1>Hello World</h1>
      {mnemonic && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <h3>Generated Mnemonic:</h3>
          <p style={{ fontFamily: 'monospace' }}>{mnemonic}</p>
        </div>
      )}
    </div>
  )
}

export default App
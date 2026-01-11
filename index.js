import { useState } from 'react';
import { Indexer } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';

export default function OGPortal() {
  const [address, setAddress] = useState(null);
  const [status, setStatus] = useState("");

  const myNfts = [
    { id: "1", passport: "TEST-001", name: "Zero-Knowledge AI Consensus", cid: "0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658", file: "test.txt" },
    { id: "2", passport: "1761793985109", name: "Decentralized Storage Optimization", cid: "0x1fd2b628bb731da5282c54e7a91bb3e0d4db54e30947eead2d9baf5219c7c0d0", file: "restoreCode.bat" },
    { id: "3", passport: "1761846773817", name: "Quantum-Resistant Signatures", cid: "0x731e410375e3066e67a3757773ed97f3c8f366d990a50e441418fa50aaed7f92", file: "0g_research.txt" },
    { id: "4", passport: "1761966502531", name: "Bio-Inspired Consensus", cid: "0x20e2ec236aeb85f958e8dc779e15fe6e820dd4b1355dd93cbeefb45e398ab98b", file: "Renewable_Energy.txt" }
  ];

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
    } else {
      alert("Open this in Trust Wallet Browser!");
    }
  }

  async function downloadFile(cid, filename) {
    setStatus(`Connecting to 0G for ${filename}...`);
    try {
      const indexer = new Indexer("https://indexer-storage-testnet-turbo.0g.ai");
      // The SDK pulls chunks from the decentralized nodes
      const fileData = await indexer.download(cid, filename, true);
      
      const blob = new Blob([fileData]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      setStatus("✅ Downloaded!");
    } catch (e) {
      console.error(e);
      setStatus("❌ Storage node busy. Try again.");
    }
  }

  return (
    <div style={{ backgroundColor: '#050505', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#3b82f6' }}>0G Research iNFT Portal</h1>
        <p style={{ color: '#666' }}>{status || "Connect your wallet to access research data"}</p>
        
        {!address ? (
          <button onClick={connectWallet} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            Connect Trust Wallet
          </button>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
            {myNfts.map(nft => (
              <div key={nft.id} style={{ background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
                <div style={{ fontSize: '10px', color: '#555' }}>PASSPORT #{nft.passport}</div>
                <h3 style={{ margin: '10px 0' }}>{nft.name}</h3>
                <button 
                  onClick={() => downloadFile(nft.cid, nft.file)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#3b82f620', border: '1px solid #3b82f650', color: '#3b82f6', fontWeight: 'bold' }}
                >
                  Download {nft.file}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

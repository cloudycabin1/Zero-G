import React, { useState, useEffect } from 'react';
import { Indexer } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';

// Essential for 0G SDK in browser
if (typeof window !== "undefined") {
    window.Buffer = Buffer;
}

export default function ZeroGravityPortal() {
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState("Ready");

    // We store the large hex strings in a clean object
    const researchData = {
        nfts: [
            { id: 1, passport: "TEST", name: "Zero-Knowledge AI", cid: "0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658", file: "research.txt" },
            { id: 2, passport: "1761793985109", name: "Storage Optimization", cid: "0xda25a5f5ea40e210db8a662801647b655dd2d1030ab89285441c74ced13e2945", file: "restoreCode.bat" },
            { id: 3, passport: "1761846773817", name: "Quantum Signatures", cid: "0xbf02c1cab5034303eccda34e461e0f65c3277c217023979ca1901f57ce6ba6b0", file: "0g_research.txt" },
            { id: 4, passport: "1761966502531", name: "Bio-Consensus", cid: "0x175dce81758f5c91c49fb8a0c4af35653bdf92fc21a02daf53adcc3004c0b57c", file: "Renewable_Energy.txt" }
        ]
    };

    const connect = async () => {
        if (!window.ethereum) return alert("Use Trust Wallet Browser");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accs = await provider.send("eth_requestAccounts", []);
        setAddress(accs[0]);
    };

    const download = async (cid, name) => {
        setStatus(`Fetching ${name}...`);
        try {
            const indexer = new Indexer("https://indexer-storage-testnet-turbo.0g.ai");
            const fileData = await indexer.download(cid, 0, true); // 0 is the block start
            const blob = new Blob([fileData]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            a.click();
            setStatus("Success!");
        } catch (e) {
            console.error(e);
            setStatus("Error: Node timeout");
        }
    };

    return (
        <div style={{background:'#000', color:'#fff', minHeight:'100vh', padding:'20px', fontFamily:'sans-serif'}}>
            <header style={{borderBottom:'1px solid #333', paddingBottom:'20px', marginBottom:'40px'}}>
                <h1>0G iNFT Portal</h1>
                <button onClick={connect} style={{background:'#3b82f6', color:'#fff', padding:'10px 20px', borderRadius:'8px', border:'none'}}>
                    {address ? `Connected: ${address.substring(0,6)}...` : "Connect Trust Wallet"}
                </button>
            </header>

            <div style={{display:'grid', gap:'20px'}}>
                {researchData.nfts.map(nft => (
                    <div key={nft.id} style={{background:'#111', padding:'20px', borderRadius:'12px', border:'1px solid #222'}}>
                        <div style={{color:'#666', fontSize:'12px'}}>ID: {nft.passport}</div>
                        <h2 style={{fontSize:'18px'}}>{nft.name}</h2>
                        <button onClick={() => download(nft.cid, nft.file)} style={{marginTop:'10px', color:'#3b82f6', background:'none', border:'1px solid #3b82f6', padding:'5px 15px', borderRadius:'5px'}}>
                            Download {nft.file}
                        </button>
                    </div>
                ))}
            </div>
            <p style={{marginTop:'20px', color:'#444'}}>{status}</p>
        </div>
    );
      }

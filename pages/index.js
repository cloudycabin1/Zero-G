import React, { useState } from 'react';
import { Indexer } from '@0glabs/0g-ts-sdk';

export default function Home() {
  const [msg, setMsg] = useState("System Ready");

  const pull = async (cid, name) => {
    setMsg("Connecting to 0G...");
    try {
      const idx = new Indexer("https://indexer-storage-testnet-turbo.0g.ai");
      const data = await idx.download(cid, 0, true);
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      setMsg("Download Started");
    } catch (e) {
      setMsg("Node Error: Check Console");
    }
  };

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', padding:'20px'}}>
      <h1>0G Storage Portal</h1>
      <p>{msg}</p>
      <button onClick={() => pull('0xbf02c1cab5034303eccda34e461e0f65c3277c217023979ca1901f57ce6ba6b0', 'research.txt')} 
              style={{padding:'10px', background:'#3b82f6', border:'none', color:'#fff', borderRadius:'5px'}}>
        Download Research Doc
      </button>
    </div>
  );
}

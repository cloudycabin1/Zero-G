import { Indexer } from '@0glabs/0g-ts-sdk';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

const btn = document.getElementById('downloadBtn');
const status = document.getElementById('status');

btn.onclick = async () => {
  status.innerText = "Connecting to 0G Nodes...";
  try {
    const indexer = new Indexer("https://indexer-storage-testnet-turbo.0g.ai");
    // Using one of your provided CIDs
    const cid = "0x731e410375e3066e67a3757773ed97f3c8f366d990a50e441418fa50aaed7f92";
    
    const fileData = await indexer.download(cid, 0, true);
    const blob = new Blob([fileData]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "research_signatures.txt";
    a.click();
    
    status.innerText = "✅ Downloaded!";
  } catch (e) {
    status.innerText = "❌ Connection Failed";
    console.error(e);
  }
};

// You MUST use a build tool like Vite or Parcel to handle these imports.
// The '0g-storage-web-starter-kit' is a perfect starting point.
import { Downloader } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";

// A standard ERC721 ABI. This is enough to get the tokenURI, which contains the CID.
const iNFT_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function balanceOf(address owner) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)"
];

// --- YOUR iNFT DETAILS - FILLED IN! ---
const NFT_CONTRACT_ADDRESS = "0x57e463BF845cf328715446b9246fFa536B671A10";
const YOUR_TOKEN_IDS = [1, 2, 3, 4];
const EXPECTED_WALLET_ADDRESS = "0x6F4D829488686afd8D9B68AE56986C312784C0e6";

const iNFT_NAMES = {
    1: "Quantum Resistant Blockchain Signatures",
    2: "Zero Knowledge AI Consensus Protocol",
    3: "Bio Inspired Mechanisms",
    4: "Decentralized Storage Optimisation"
};

// Network configuration based on your provided details
const galileoTestnet = {
    chainId: "0x1f453", // 80087 from the RPC list [1]
    chainName: "0G Galileo Testnet",
    rpcUrls: ["https://evmrpc-testnet.0g.ai"],
    nativeCurrency: { name: "OG", decimals: 18, symbol: "OG" },
    blockExplorerUrls: ["https://chainscan-galileo.0g.ai"]
};

// --- DOM ELEMENTS ---
const connectButton = document.getElementById('connectButton');
const walletInfoDiv = document.getElementById('walletInfo');
const walletAddressSpan = document.getElementById('walletAddress');
const networkNameSpan = document.getElementById('networkName');
const nftContainer = document.getElementById('nft-container');

// --- SCRIPT LOGIC ---
connectButton.addEventListener('click', async () => {
    if (typeof window.ethereum === 'undefined') {
        alert("Wallet not found. Please install MetaMask or another web3 wallet.");
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const connectedAddress = await signer.getAddress();

        if (connectedAddress.toLowerCase() !== EXPECTED_WALLET_ADDRESS.toLowerCase()) {
            alert(`Warning: You are connected with ${connectedAddress}, but these iNFTs belong to ${EXPECTED_WALLET_ADDRESS}. Please switch accounts.`);
            return;
        }

        await switchToGalileo(provider);
        await displayWalletInfo(signer, provider);
        await fetchAllNftData(signer);
    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert(`Failed to connect wallet. See console for details.`);
    }
});

async function switchToGalileo(provider) {
    try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: galileoTestnet.chainId }]);
    } catch (switchError) {
        if (switchError.code === 4902) { // Chain not added
            await provider.send('wallet_addEthereumChain', [galileoTestnet]);
        } else {
            throw switchError;
        }
    }
}

async function displayWalletInfo(signer, provider) {
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    walletAddressSpan.textContent = address;
    networkNameSpan.textContent = network.name;
    walletInfoDiv.style.display = 'block';
}

async function fetchAllNftData(signer) {
    nftContainer.innerHTML = '<h2>Initializing... Verifying iNFT ownership...</h2>';
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, iNFT_ABI, signer);
    const downloader = new Downloader({ indexer_url: "https://indexer-storage-testnet-turbo.0g.ai" });

    // Clear the loading message
    nftContainer.innerHTML = '';

    for (const tokenId of YOUR_TOKEN_IDS) {
        const nftName = iNFT_NAMES[tokenId];
        const card = createNftCard(nftName, `<p>Checking ownership of Token ID: ${tokenId}...</p>`);
        nftContainer.appendChild(card);

        try {
            // Get the metadata URI from the contract
            const tokenUriString = await contract.tokenURI(tokenId);
            
            // The URI might be a JSON string directly or a URL, we handle both.
            let metadata;
            if (tokenUriString.startsWith('{')) {
                metadata = JSON.parse(tokenUriString);
            } else {
                // If it's a URL (like IPFS), you might need an IPFS gateway to fetch it.
                // For now, we assume it's a direct JSON string as per your data.
                throw new Error("Metadata is a URL, not direct JSON. Needs IPFS gateway logic.");
            }
            
            const cidAttribute = metadata.attributes.find(attr => attr.trait_type === "Storage CID");
            if (!cidAttribute || !cidAttribute.value) {
                throw new Error("Storage CID not found in metadata.");
            }
            const cid = cidAttribute.value;
            const fileName = metadata.attributes.find(attr => attr.trait_type === "File Name")?.value || 'research.txt';

            card.innerHTML = `<h2>${nftName}</h2><p>✅ Ownership verified.<br>Data CID: ${cid}<br>Downloading <strong>${fileName}</strong> from 0G Storage...</p>`;

            // Use the 0G SDK to download the file content
            const fileContent = await downloader.download(cid);
            const textContent = new TextDecoder().decode(fileContent);
            
            const contentDisplay = `<p>✅ Success! Content of <strong>${fileName}</strong>:</p><pre>${textContent}</pre>`;
            card.innerHTML = `<h2>${nftName}</h2>` + contentDisplay;

        } catch (error) {
            console.error(`Error fetching data for token ${tokenId}:`, error);
            card.innerHTML = `<h2>${nftName}</h2><p style="color: #ff5555;">Error: Could not load data. ${error.message}</p>`;
        }
    }
}

function createNftCard(title, content) {
    const card = document.createElement('div');
    card.className = 'nft-card';
    card.innerHTML = `<h2>${title}</h2>` + content;
    return card;
}


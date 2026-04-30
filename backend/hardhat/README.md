# Hardhat Sepolia Skeleton

This workspace is the Sepolia receipt-token skeleton for the Greek Energy Receipt Network.

## Contract model

- ERC-721 receipt NFT
- one token per verified submission
- owner-only mint path for now

## Setup

```bash
cd hardhat
npm install
cp .env.example .env
npm run compile
npm run deploy:sepolia
```

## Expected backend env vars

- `SEPOLIA_ENABLED`
- `SEPOLIA_RPC_URL`
- `SEPOLIA_PRIVATE_KEY`
- `SEPOLIA_CHAIN_ID`
- `RECEIPT_TOKEN_CONTRACT_ADDRESS`

The Python backend keeps a chain-service skeleton and can later swap from mock mint mode to real Sepolia transactions.

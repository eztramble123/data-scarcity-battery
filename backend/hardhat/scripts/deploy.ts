import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const receiptToken = await ethers.deployContract("ReceiptToken", [deployer.address]);
  await receiptToken.waitForDeployment();

  const address = await receiptToken.getAddress();
  console.log(JSON.stringify({
    network: "sepolia",
    chainId: 11155111,
    deployer: deployer.address,
    receiptTokenAddress: address,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

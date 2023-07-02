// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const timeStart = Math.floor(Date.now() / 1000) + 60;
  const timeEnd = timeStart + 180;
  const candidates = ["pc", "playstation", "nintendo", "xbox"];
  const voting = await Voting.deploy(timeStart, timeEnd, candidates);
  await voting.deployed();
  console.log("Voting deployed to:", voting.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

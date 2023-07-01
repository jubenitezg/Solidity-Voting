const { expect } = require("chai");
const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

// Simple check whether we use the hardhat network
const isHardHatNetwork = () => {
  return hre.network.name === "hardhat";
};

// Make sure the current block has been mined
const waitNextBlock = async () => {
  if (isHardHatNetwork()) {
    return helpers.mine();
  }
  const startBlock = await ethers.provider.getBlockNumber();
  return new Promise((resolve, reject) => {
    const isNextBlock = async () => {
      const currentBlock = await ethers.provider.getBlockNumber();
      if (currentBlock > startBlock) {
        resolve();
      } else {
        setTimeout(isNextBlock, 300);
      }
    };
    setTimeout(isNextBlock, 300);
  });
};

describe("Voting", function () {});

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

describe("Voting", function () {
  let candidates = ["Xbox", "Playstation", "Nintendo", "PC"];
  let accounts;

  let votingValid;
  let votingExpired;

  this.beforeAll(async () => {
    accounts = await ethers.getSigners();
    timeStart = Math.floor(Date.now() / 1000) - 60;
    timeEnd = timeStart + 3600;
    let vote = await ethers.getContractFactory("Voting");
    votingValid = await vote.deploy(timeStart, timeEnd, candidates);
    await votingValid.deployed();

    timeStart = Math.floor(Date.now() / 1000) - 3600;
    timeEnd = timeStart + 3600;
    votingExpired = await vote.deploy(timeStart, timeEnd, candidates);
    await votingExpired.deployed();
  });

  it("Should allow to vote", async function () {
    await votingValid.connect(accounts[0]).vote("Xbox");
    let voteCount = await votingValid.getVoteCount("Xbox");
    expect(voteCount).to.equal(1);
  });

  it("Should not allow to vote in invalid time", async function () {
    await expect(
      votingExpired.connect(accounts[0]).vote("Xbox")
    ).to.be.revertedWith("Voting is only not allowed at this time.");
  });

  it("Should not allow to vote twice", async function () {
    await expect(
      votingValid.connect(accounts[0]).vote("Xbox")
    ).to.be.revertedWith("You have already voted.");
  });
});

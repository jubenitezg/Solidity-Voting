require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    local: {
      url: "http://localhost:8545",
      chainId: 5342,
      accounts: [
        "1bfbe97a391737419d82afed614dd3ddccffc2b6fc65da0c7f6bdf51899ad3e7",
        "f69739878ad475d8c24296bef0298d648785721ce17f29a36d7f92275d000439",
      ],
    },
  },
};

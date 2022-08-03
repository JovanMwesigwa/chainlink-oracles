const { ethers } = require('hardhat')
const networkConfig = {
  31337: {
    name: 'localhost',
    wethContractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    amount: ethers.utils.parseEther('50'),
    lendingPoolAddressesProviderContractAddress:
      '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
  },
  137: {
    name: 'polygon-mainnet',
    wethContractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    amount: ethers.utils.parseEther('50'),
    lendingPoolAddressesProviderContractAddress:
      '0xd05e3E715d945B59290df0ae8eF85c1BdB684744',
  },
  80001: {
    name: 'polygon-testnet',
    wethContractAddress: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    amount: ethers.utils.parseEther('50'),
    lendingPoolAddressesProviderContractAddress:
      '0xd05e3E715d945B59290df0ae8eF85c1BdB684744',
  },
}

module.exports = {
  networkConfig,
}

const { ethers, getNamedAccounts, network } = require('hardhat')
const { networkConfig } = require('../helper-hardhat-config')

async function getWeth() {
  const { deployer } = await getNamedAccounts()
  const chainID = network.config.chainId
  const AMOUNT = networkConfig[chainID].amount
  // We need to get the address of the WETH contract and the ABI of the WETH contract in order to call the .deposit() method
  const wethAddress = networkConfig[chainID].wethContractAddress
  // Get the ABI of the WETH contract
  const wethContract = await ethers.getContractAt(
    'IWeth',
    wethAddress,
    deployer
  )

  const tx = await wethContract.deposit({
    value: AMOUNT,
  })
  await tx.wait(1)

  const wethBalance = await wethContract.balanceOf(deployer)

  console.log(
    `You have successfully deposited ${wethBalance.toString()} WETH to the WETH contract at ${wethAddress}`
  )
}

module.exports = getWeth

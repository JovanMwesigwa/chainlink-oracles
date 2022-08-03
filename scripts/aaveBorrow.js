const { ethers, getNamedAccounts, network } = require('hardhat')
const { networkConfig } = require('../helper-hardhat-config')
const getWeth = require('./getWeth')

async function main() {
  const { deployer } = await getNamedAccounts()
  const chainID = network.config.chainId
  const lendingPoolAddressesProviderContractAddress =
    networkConfig[chainID].lendingPoolAddressesProviderContractAddress
  const wethAddress = networkConfig[chainID].wethContractAddress
  const AMOUNT = networkConfig[chainID].amount

  await getWeth()
  //   Time to deposit into the aave lending pool contract but before we do that, we need to get the address of the aave lending pool contract and the ABI of the aave lending pool contract in order to call the .borrow() method
  // To get it we use the lending pool addresses provider contract
  const lendingPoolAddress = await getLendingPoolAddress(
    lendingPoolAddressesProviderContractAddress,
    deployer
  )
  // Get the ABI of the aave lending pool contract
  const lendingPoolContract = await ethers.getContractAt(
    'ILendingPool',
    lendingPoolAddress,
    deployer
  )
  //   Get account status before depositing
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await getUserAccountStatus(lendingPoolContract, deployer)
  //   Lets first deposit the Weth into the aave lending pool contract using the .deposit() method
  await approveERC20(wethAddress, lendingPoolAddress, AMOUNT, deployer)
  await depositWeth(lendingPoolContract, wethAddress, deployer, AMOUNT)
  //   Get account status after depositing
  await getUserAccountStatus(lendingPoolContract, deployer)

  //   Time to borrow from the aave lending pool using the .borrow() method
}

async function getLendingPoolAddress(address, account) {
  // get the ABI of the aave lending pool addresses provider contract
  const lendingPoolAddressesProviderContract = await ethers.getContractAt(
    'ILendingPoolAddressesProvider',
    address,
    account
  )
  // get the address of the aave lending pool contract
  const lendingPoolAddress =
    await lendingPoolAddressesProviderContract.getLendingPool()
  console.log(`Success! aave lending pool address: ${lendingPoolAddress}`)
  return lendingPoolAddress
}

async function depositWeth(lendingPool, wethAddress, account, amount) {
  const tx = await lendingPool.deposit(wethAddress, amount, account, 1)
  await tx.wait(1)
  console.log(
    `Deposited ${amount} WETH into the aave lending pool contract at ${lendingPool.address}`
  )
}

async function getUserAccountStatus(lendingPool, account) {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account)
  console.log(`User account status:`)
  console.log(`You have a Total collateral ETH: ${totalCollateralETH}`)
  console.log(`Total debt ETH: ${totalDebtETH}`)
  console.log(`You can borrow upto ETH: ${availableBorrowsETH}`)
  return { totalCollateralETH, totalDebtETH, availableBorrowsETH }
}

async function approveERC20(
  wethTokenAddress,
  lendingPoolAddress,
  amount,
  account
) {
  const erc20 = await ethers.getContractAt('IERC20', wethTokenAddress, account)
  const tx = await erc20.approve(lendingPoolAddress, amount)
  await tx.wait(1)
  console.log(`IERC20 contract approved`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

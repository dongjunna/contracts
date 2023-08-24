const bluebird = require('bluebird')

const SafeMath = artifacts.require('openzeppelin-solidity/contracts/math/SafeMath.sol')
const RLPReader = artifacts.require('solidity-rlp/contracts/RLPReader.sol')
const Common = artifacts.require('Common')
const Merkle = artifacts.require('Merkle')
const MerklePatriciaProof = artifacts.require('MerklePatriciaProof')
const RLPEncode = artifacts.require('RLPEncode')
const RootChainManagerTest = artifacts.require('RootChainManagerTest')
const RootChainManagerProxy = artifacts.require('RootChainManagerProxy')
const utils = require('./utils')

async function test(address) {
  console.log('Getting Checkpoint data: ', address)
  const test = await RootChainManagerTest.at(address)
  console.log('* checkpoint: ', (await test.getCheckpoint(1)))
}

module.exports = async function(deployer, network, accounts) {
  await deployer

  const contractAddresses = utils.getContractAddresses()

  console.log('deploying contracts...')

  await deployer.deploy(RootChainManagerTest)
  const RootChainManagerTestInstance = await RootChainManagerTest.at(RootChainManagerTest.address)

  console.log('Setting ChildChainManager: ', contractAddresses.root.RootChain)
  await RootChainManagerTestInstance.setCheckpointManager(contractAddresses.root.RootChain)

  const rootChainContractAddresses = {
    RootChainManagerTest: RootChainManagerTest.address
  }

  await test(RootChainManagerTest.address)

  console.log('* rootChainContractAddresses:', rootChainContractAddresses.toString())
}

const META = artifacts.require('META')
const utils = require('./utils')
// const Buffer = require('safe-buffer').Buffer
const { bufferToHex, rlp, toBuffer, BN, keccak256 } = require('ethereumjs-util')
const Trie = require('merkle-patricia-tree')
const { Buffer } = require('safe-buffer')
const MetaLockable = artifacts.require('MetaLockable')
const RootChainManagerTest = artifacts.require('RootChainManagerTest')

module.exports = async function(deployer, network, accounts) {
  await deployer

  const contractAddresses = utils.getContractAddresses()

  // const metaLockable = await MetaLockable.at(contractAddresses.child.tokens.META)
  // const address = await metaLockable.token()

  const rootChainManagerTest = await RootChainManagerTest.at('0x00d74642B1288278185da1A6493dbEEb5141a640')
  const rootToken = await rootChainManagerTest.childToRootToken('0x4f0ff11EBF566768A9269FF03E63E7E3197CeBAF')

  console.log('rootToken: ', rootToken)
}

const utils = require('./utils')
const rlp = require('rlp')

const RootChainManager = artifacts.require('RootChainManager')
const contractAddresses = utils.getContractAddresses()

async function getRootChainManager() {
  return RootChainManager.at(contractAddresses.root.RootChainManagerProxy)
}

// const privateKey = '0xb1e8f16106c8a54e1525cce93d14fcd3f9503f5422308f9cf9c236b53683c2c3';

async function exit() {
  const rootChainManager = await getRootChainManager()

  const txHash = '0x299069966448f927306f775b511100a4cc2daaaf50b606c6b5cd34a8ee3a9616'
  const checkpointNumber = 0

  const accounts = await web3.eth.getAccounts()
  // const account = await web3.eth.accounts.privateKeyToAccount(privateKey);
  console.log('* account: ', accounts[0])
  console.log('* balance of account: ', await web3.eth.getBalance(accounts[0]))

  const tx = await web3.eth.getTransaction(txHash)
  const txReceipt = await web3.eth.getTransactionReceipt(txHash)

  const block = await web3.eth.getBlock(tx.blockNumber)

  // const headerBlockData = await contracts.root.RootChainProxy.headerBlocks(checkpointNumber)

  const metaLockable = contractAddresses.child.tokens.META
  console.log('* metaLockable: ', metaLockable)

  // const storageList = []

  const storage = await web3.eth.getStorageAt(metaLockable)

  if (storage) {
    console.log('* storage: ', storage.toString())
  }

  // storageList.push(storage)

  // const proof = (await web3.eth.getProof(metaLockable, [storage], tx.blockNumber)).storageProof

  const proof = {
    accountProof: ['0xf90191a0fcf4058217b1bee3757eb57331de022d57d61811461a09fbd27cdc5b53e7d3c0a0c89e86d2651d1f2b468f27d70256e69d97758adf39cf1c8265d75357a359b0cea01e0e3d36f0447af7c55897863ce6584f51e11717e460611b940ac6a0d20e7804a0c242ca288bc5431aa723d56b52ec1d90eb1cadbebd94a8c3003a76679a20df83a00fda29ece137f1cc56aa056311fd775327227caba0ffcf2ad8891114cfc3ed5fa047ecb70cbb2cf8c786da1ffdaf8f73976f745622ce934e282eed01bd451b08b9a065dc874988f41a2a32a48791b9edad29a9eec9a931bd3c9b36afaa0a931601d9a08aeaee35aa0c69c68216ffa3ab907f25491ce07573cf8a906b62ae8341e954fda0c7897b4a2c3b4aaf134cc0b8382a4b6cca8f13d544da91d7b1e37a0ca92b0d6180a0d59333b38e4314c5df8f744a317db98b478fbb6fbe7e9dbf40cc60296e86d169a050302ce980c229c5eefe7c4ead72d38edd8f75337db5820106c92dfa136944d580a068528d5f9eb85d84da17c7f45921d13f233341e8ce8e67488937ffdcbd5e64aa808080', '0xf85180a0e2b2d64aecbaf1e8ae75e8e0b0cdb47394ad848a160594f8a86f5174ca8904278080808080808080808080a01e5f4f4e48a2e30436254e7693470dec44e83cd6913d310a7c0ba9a7ba6b9b90808080', '0xf872a0209af8abd0ce51a2143793fe18989b8cdb4ff4eb810732dec37a61cdbdfbdfdfb84ff84d01893635c9adc5dea00000a0c7798f45ea9e814409bb3c4e5d4a0cce9bdc33b49c0db3e5fd3f6916b2a8a669a083226eacff6aa1e8fd43b96c48c8c0daa5d99cb6727bb33ad424405131d10906'],
    address: '0x4f0ff11ebf566768a9269ff03e63e7e3197cebaf',
    balance: '0x3635c9adc5dea00000',
    codeHash: '0x83226eacff6aa1e8fd43b96c48c8c0daa5d99cb6727bb33ad424405131d10906',
    nonce: '0x1',
    storageHash: '0xc7798f45ea9e814409bb3c4e5d4a0cce9bdc33b49c0db3e5fd3f6916b2a8a669',
    storageProof: [{
      key: '0x000000000000000000000000a121d7b3c4174414ab69741a9a27dd809de91407',
      proof: ['0xf8918080a051361cbe139a9dc670495e16cac3e12b9f433e3e472562f840e0b98b55bd007e80808080a06fdd33d0c43436ef9542c945cb30d834573a3b3d944d2989b4226c8e636102288080808080a034605cb89fe48115e12dc1ae9438035b408221d7b4ea674d8ff5b45e33a240da80a00e030eb425356690f5b4179b7fd999b9dc428645a7286692db3471b838c48dc680'],
      value: '0x0'
    }]
  }

  //
  // const proofString = '{\n' +
  //   '  accountProof: ["0xf90191a0fcf4058217b1bee3757eb57331de022d57d61811461a09fbd27cdc5b53e7d3c0a0c89e86d2651d1f2b468f27d70256e69d97758adf39cf1c8265d75357a359b0cea01e0e3d36f0447af7c55897863ce6584f51e11717e460611b940ac6a0d20e7804a0c242ca288bc5431aa723d56b52ec1d90eb1cadbebd94a8c3003a76679a20df83a00fda29ece137f1cc56aa056311fd775327227caba0ffcf2ad8891114cfc3ed5fa047ecb70cbb2cf8c786da1ffdaf8f73976f745622ce934e282eed01bd451b08b9a065dc874988f41a2a32a48791b9edad29a9eec9a931bd3c9b36afaa0a931601d9a08aeaee35aa0c69c68216ffa3ab907f25491ce07573cf8a906b62ae8341e954fda0c7897b4a2c3b4aaf134cc0b8382a4b6cca8f13d544da91d7b1e37a0ca92b0d6180a0d59333b38e4314c5df8f744a317db98b478fbb6fbe7e9dbf40cc60296e86d169a050302ce980c229c5eefe7c4ead72d38edd8f75337db5820106c92dfa136944d580a068528d5f9eb85d84da17c7f45921d13f233341e8ce8e67488937ffdcbd5e64aa808080", "0xf85180a0e2b2d64aecbaf1e8ae75e8e0b0cdb47394ad848a160594f8a86f5174ca8904278080808080808080808080a01e5f4f4e48a2e30436254e7693470dec44e83cd6913d310a7c0ba9a7ba6b9b90808080", "0xf872a0209af8abd0ce51a2143793fe18989b8cdb4ff4eb810732dec37a61cdbdfbdfdfb84ff84d01893635c9adc5dea00000a0c7798f45ea9e814409bb3c4e5d4a0cce9bdc33b49c0db3e5fd3f6916b2a8a669a083226eacff6aa1e8fd43b96c48c8c0daa5d99cb6727bb33ad424405131d10906"],\n' +
  //   '  address: "0x4f0ff11ebf566768a9269ff03e63e7e3197cebaf",\n' +
  //   '  balance: "0x3635c9adc5dea00000",\n' +
  //   '  codeHash: "0x83226eacff6aa1e8fd43b96c48c8c0daa5d99cb6727bb33ad424405131d10906",\n' +
  //   '  nonce: "0x1",\n' +
  //   '  storageHash: "0xc7798f45ea9e814409bb3c4e5d4a0cce9bdc33b49c0db3e5fd3f6916b2a8a669",\n' +
  //   '}'
  //
  // const storageProofString = '{\n' +
  //   '      key: "0x000000000000000000000000a121d7b3c4174414ab69741a9a27dd809de91407",\n' +
  //   '      proof: ["0xf8918080a051361cbe139a9dc670495e16cac3e12b9f433e3e472562f840e0b98b55bd007e80808080a06fdd33d0c43436ef9542c945cb30d834573a3b3d944d2989b4226c8e636102288080808080a034605cb89fe48115e12dc1ae9438035b408221d7b4ea674d8ff5b45e33a240da80a00e030eb425356690f5b4179b7fd999b9dc428645a7286692db3471b838c48dc680"],\n' +
  //   '      value: "0x0"\n' +
  //   '  }'
  //
  // const storageProofProof = ['0xf8918080a051361cbe139a9dc670495e16cac3e12b9f433e3e472562f840e0b98b55bd007e80808080a06fdd33d0c43436ef9542c945cb30d834573a3b3d944d2989b4226c8e636102288080808080a034605cb89fe48115e12dc1ae9438035b408221d7b4ea674d8ff5b45e33a240da80a00e030eb425356690f5b4179b7fd999b9dc428645a7286692db3471b838c48dc680']
  // const storageProofJson = JSON.parse(storageProofString)
  // console.log('* storageProof: ', storageProofJson)
  // storageProofJson.proof = storageProofProof
  //
  // const storageProof = []
  // storageProof.push(storageProofJson)
  //
  // const proof = JSON.parse(proofString)
  // proof.storageProof = storageProof

  console.log('* proof: ', proof)

  const blockProof = await web3.utils.sha3(proof.toString())
  console.log('* blockProof: ', blockProof)
  const blockNumber = block.number
  console.log('* blockNumber: ', blockNumber)
  const blockTimestamp = block.timestamp
  console.log('* blockTimestamp: ', blockTimestamp)
  const txRoot = web3.utils.sha3(block.transactionsRoot.slice(2))
  console.log('* txRoot: ', txRoot)
  const receiptRoot = web3.utils.sha3(block.receiptsRoot.slice(2))
  console.log('* receiptRoot: ', receiptRoot)
  const receiptProof =  web3.utils.sha3(rlp.encode(proof.storageProof.map(s => s.proof)))
  console.log('* receiptProof: ', receiptProof)
  const txReceiptString = web3.utils.sha3(txReceipt.toString())
  console.log('* txReceipt: ', txReceiptString)
  const branchMaskAsUint = web3.utils.sha3(txReceipt.transactionIndex.toString())
  console.log('* branchMaskAsUint: ', branchMaskAsUint)
  const logIndex = 0

  const encodeData = rlp.encode([
    checkpointNumber,
    blockProof,
    blockNumber,
    blockTimestamp,
    txRoot,
    receiptRoot,
    txReceiptString,
    receiptProof,
    branchMaskAsUint,
    logIndex
  ])

  console.log('* encodeData: ', encodeData)

  const result = web3.utils.toHex(encodeData)

  if (result) { console.log('result: ', result) }

  await rootChainManager.exit(result)
}

module.exports = async function(callback) {
  console.log('called export')
  try {
    await exit()
  } catch (e) {
    console.log(e)
  }
}

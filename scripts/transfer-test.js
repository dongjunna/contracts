console.log('*** start ***')
// const rlp = require('rlp')
const Trie = require('merkle-patricia-tree');
const Web3 = require('web3')
// const { GetProof } = require('eth-proof')
const EthereumTx = require('ethereumjs-tx')
const { bufferToHex, rlp, toBuffer, BN, keccak256 } = require('ethereumjs-util')
const Buffer = require('safe-buffer').Buffer
const MerkleTree = require('./merkle-tree.js')
const wemixWeb3 = new Web3('http://3.38.235.244:8588')
const metaWeb3 = new Web3('http://3.38.235.244:7588')
// const metaEp = new GetProof('http://3.38.235.244:7588')
const contractAddresses = require('./contractAddress.json')
const RootChainManagerContractABI = require('./rootchainmanamger-abi.json')
const RootChainManagerAddress = contractAddresses.root.RootChainManager

// const testRootChainABI = require('../../abi/get-checkpoint-abi.json')
// const testRootChainAddress = '0x2ed19785716f3F603C7fab50C247F05f7c7F315c'

async function exit() {
    // const rootChainManagerContract = new wemixWeb3.eth.Contract(testRootChainABI, testRootChainAddress)
    const rootChainManagerContract = new wemixWeb3.eth.Contract(RootChainManagerContractABI, RootChainManagerAddress)
    const toContract = RootChainManagerAddress

    const startBlock = 0
    const endBlock = 50
    const chainId = 1111
    const sender = '0xA121d7b3C4174414Ab69741a9a27dd809DE91407'
    const privateKey = '0xb1e8f16106c8a54e1525cce93d14fcd3f9503f5422308f9cf9c236b53683c2c3'
    const txHash = '0x1973a28349c12456d9163be98d6b9605e559aec1b7b2e8da0fbc2e1e22851995'
    const checkpointNumber = 10000

    const accounts = await metaWeb3.eth.getAccounts()
    // const account = await web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log('* account: ', accounts[0])
    console.log('* balance of account: ', await metaWeb3.eth.getBalance(accounts[0]))

    const tx = await metaWeb3.eth.getTransaction(txHash)
    console.log('* getTransactoin: ', tx)

    const txReceipt = await metaWeb3.eth.getTransactionReceipt(txHash)
    console.log('* txReceipt: ', txReceipt)

    const block = await metaWeb3.eth.getBlock(tx.blockNumber, true)
    console.log('* block: ', block)

    const txBlockHeader = await getBlockHeader(block)

    let blockList = []

    for (let i = startBlock; i <= endBlock; i += 1) {
        let checkpointBlock = await metaWeb3.eth.getBlock(i, true)
        let blockHeader = await getBlockHeader(checkpointBlock)
        console.log('* ', i, '번째 blockHeader: ', blockHeader.toString())
        blockList.push(blockHeader)
    }

    const tree = await new MerkleTree(blockList)
    console.log('* MerkleTree: ', tree)

    const metaLockable = contractAddresses.child.tokens.META
    console.log('* metaLockable: ', metaLockable)

    /** proof */
    const blockProof = tree.getProof(txBlockHeader)
    console.log('* blockProof: ', blockProof)

    /** number */
    const blockNumber = block.number
    console.log('* blockNumber: ', blockNumber)

    /** timestamp */
    const blockTimestamp = block.timestamp
    console.log('* blockTimestamp: ', blockTimestamp)

    /** transactionsRoot */
    const txRoot = block.transactionsRoot
    console.log('* txRoot: ', txRoot)

    /** receiptsRoot */
    const receiptRoot = block.receiptsRoot
    console.log('* receiptRoot: ', receiptRoot)

    /** receipt */
    const txReceiptRlp = await getReceiptBytes(txReceipt)
    console.log('* txReceiptRlp: ', txReceiptRlp)

    /** receiptParentNodes */
    const receiptProof = await getReceiptProof(txReceipt, block,  [txReceipt])

    const jsVerified = await verifyTxProof(receiptProof)
    if(!jsVerified) {
        console.log('*** Proof verification in js failed for receipt: ', txReceipt.transactionIndex)
    }else{
        console.log('*** 성공~: ', txReceipt.transactionIndex)
    }

    const rlpParentNodes =  rlp.encode(receiptProof.parentNodes)
    console.log('* rlpParentNodes: ', rlpParentNodes)

    /** path */
    const encodedPath = Buffer.concat([
        Buffer.from('00', 'hex'),
        receiptProof.path
    ])
    console.log('* encodedPath: ', encodedPath)

    /** logIndex */
    const logIndex = 0

    const encodeData = bufferToHex(
        rlp.encode([
            checkpointNumber,
            bufferToHex(Buffer.concat(blockProof)),
            blockNumber,
            blockTimestamp,
            bufferToHex(txRoot),
            bufferToHex(receiptRoot),
            bufferToHex(txReceiptRlp),
            bufferToHex(rlpParentNodes),
            bufferToHex(encodedPath), // branch mask,
            logIndex
        ])
    )

    const data = await rootChainManagerContract.methods.exit(encodeData).call();
    console.log('* contract data: ', data)
    //
    // let genTx = {}
    // // genTx.chainId = chainId
    // // genTx.from = sender
    // genTx.nonce = await wemixWeb3.eth.getTransactionCount(sender);
    // genTx.gasLimit = wemixWeb3.utils.toHex('100000')
    // genTx.maxPriorityFeePerGas = wemixWeb3.utils.toHex('100000000001')
    // genTx.maxFeePerGas = wemixWeb3.utils.toHex('100000000001')
    // genTx.to = toContract
    // genTx.value = "0x"
    // genTx.accessList = []
    // genTx.input = data
    //
    // const signData = await wemixWeb3.eth.accounts.signTransaction(genTx, privateKey)
    // console.log('* signData: ', signData.rawTransaction.toString())
    //
    // await wemixWeb3.eth.sendSignedTransaction(signData.rawTransaction.toString()).then(r => console.log(r));
}

async function getBlockHeader(block) {
    let n = new BN(block.number).toArrayLike(Buffer, 'be', 32)
    let ts = new BN(block.timestamp).toArrayLike(Buffer, 'be', 32)
    let txRoot = toBuffer(block.transactionsRoot)
    let receiptsRoot = toBuffer(block.receiptsRoot)

    return keccak256(Buffer.concat([n, ts, txRoot, receiptsRoot]))
}

async function getReceiptBytes(receipt) {
    console.log('* [getReceiptBytes] receipt.status: ', receipt.status)
    console.log('* [getReceiptBytes] receipt.cumulativeGasUsed: ', receipt.cumulativeGasUsed)
    console.log('* [getReceiptBytes] receipt.logsBloom: ', receipt.logsBloom)
    console.log('* [getReceiptBytes] receipt.logs: ', receipt.logs)
    return rlp.encode([
        toBuffer('0x1'),
        toBuffer(receipt.cumulativeGasUsed),
        toBuffer(receipt.logsBloom),

        // encoded log array
        receipt.logs.map(l => {
            // [address, [topics array], data]
            return [
                toBuffer(l.address), // convert address to buffer
                l.topics.map(toBuffer), // convert topics to buffer
                toBuffer(l.data) // convert data to buffer
            ]
        })
    ])
}

async function rawStack(input){
    let output = []
    for (var i = 0; i < input.length; i++) {
        output.push(input[i].raw)
    }
    return output
}

async function getReceiptProof(receipt, block, receipts) {
    const receiptsTrie = new Trie()

    for (let i = 0; i < receipts.length; i++) {
        const siblingReceipt = receipts[i]
        const path = rlp.encode(siblingReceipt.transactionIndex)
        console.log('path', i, ': ', path, ',', siblingReceipt.transactionIndex)
        const rawReceipt = await getReceiptBytes(siblingReceipt)
        await new Promise((resolve, reject) => {
            receiptsTrie.put(path, rawReceipt, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    // promise
    return new Promise((resolve, reject) => {
        receiptsTrie.findPath(
            rlp.encode(receipt.transactionIndex),
            (err, rawReceiptNode, reminder, stack) => {
                if (err) {
                    return reject(err)
                }

                if (reminder.length > 0) {
                    return reject(new Error('Node does not contain the key'))
                }

                const prf = {
                    blockHash: toBuffer(receipt.blockHash),
                    parentNodes: stack.map(s => s.raw),
                    path: rlp.encode(receipt.transactionIndex),
                    value: rlp.decode(rawReceiptNode.value)
                }
                resolve(prf)
            }
        )
    })
}

async function verifyTxProof(proof) {
    const path = proof.path.toString('hex')
    const value = proof.value
    const parentNodes = proof.parentNodes
    const txRoot = proof.root
    try {
        var currentNode
        var len = parentNodes.length
        var nodeKey = txRoot
        var pathPtr = 0
        for (var i = 0; i < len; i++) {
            currentNode = parentNodes[i]
            const encodedNode = Buffer.from(
                keccak256(rlp.encode(currentNode)),
                'hex'
            )
            if (!nodeKey==encodedNode) {
                return false
            }
            if (pathPtr > path.length) {
                return false
            }
            switch (currentNode.length) {
                case 17: // branch node
                    if (pathPtr === path.length) {
                        if (currentNode[16] === rlp.encode(value)) {
                            return true
                        } else {
                            return false
                        }
                    }
                    nodeKey = currentNode[parseInt(path[pathPtr], 16)] // must === sha3(rlp.encode(currentNode[path[pathptr]]))
                    pathPtr += 1
                    break
                case 2:
                    // eslint-disable-next-line
                    const traversed = nibblesToTraverse(
                        currentNode[0].toString('hex'),
                        path,
                        pathPtr
                    )
                    if ((traversed + pathPtr) === path.length) {
                        // leaf node
                        if (currentNode[1].equals(rlp.encode(value))) {
                            return true
                        } else {
                            return false
                        }
                    }
                    // extension node
                    if (traversed === 0) {
                        return false
                    }
                    pathPtr += traversed
                    nodeKey = currentNode[1]
                    break
                default:
                    console.log('all nodes must be length 17 or 2')
                    return false
            }
        }
    } catch (e) {
        console.log(e)
        return false
    }
    return false
}

function nibblesToTraverse(encodedPartialPath, path, pathPtr) {
    let partialPath
    if (
        String(encodedPartialPath[0]) === '0' ||
        String(encodedPartialPath[0]) === '2'
    ) {
        partialPath = encodedPartialPath.slice(2)
    } else {
        partialPath = encodedPartialPath.slice(1)
    }

    if (partialPath === path.slice(pathPtr, pathPtr + partialPath.length)) {
        return partialPath.length
    } else {
        throw new Error('path was wrong')
    }
}

exit()

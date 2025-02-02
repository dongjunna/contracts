// Deploy minimal number of contracts to link the libraries with the contracts
const utils = require('./utils')

const bluebird = require('bluebird')

const SafeMath = artifacts.require('openzeppelin-solidity/contracts/math/SafeMath.sol')
const RLPReader = artifacts.require('solidity-rlp/contracts/RLPReader.sol')
const BytesLib = artifacts.require('BytesLib')
const Common = artifacts.require('Common')
const ECVerify = artifacts.require('ECVerify')
const Merkle = artifacts.require('Merkle')
const MerklePatriciaProof = artifacts.require('MerklePatriciaProof')
const PriorityQueue = artifacts.require('PriorityQueue')
const RLPEncode = artifacts.require('RLPEncode')

const Registry = artifacts.require('Registry')
const Governance = artifacts.require('Governance')
const GovernanceProxy = artifacts.require('GovernanceProxy')
const RootChain = artifacts.require('RootChain')
const RootChainProxy = artifacts.require('RootChainProxy')
const DepositManager = artifacts.require('DepositManager')
const DepositManagerProxy = artifacts.require('DepositManagerProxy')
const WithdrawManager = artifacts.require('WithdrawManager')
const WithdrawManagerProxy = artifacts.require('WithdrawManagerProxy')
const StateSender = artifacts.require('StateSender')
const StakeManager = artifacts.require('StakeManager')
const StakeManagerProxy = artifacts.require('StakeManagerProxy')
const SlashingManager = artifacts.require('SlashingManager')
const StakingInfo = artifacts.require('StakingInfo')
const StakingNFT = artifacts.require('StakingNFT')
const ValidatorShareFactory = artifacts.require('ValidatorShareFactory')
const ValidatorShare = artifacts.require('ValidatorShare')
const ERC20Predicate = artifacts.require('ERC20Predicate')
const ERC721Predicate = artifacts.require('ERC721Predicate')
const MintableERC721Predicate = artifacts.require('MintableERC721Predicate')
const Marketplace = artifacts.require('Marketplace')
const MarketplacePredicate = artifacts.require('MarketplacePredicate')
const MarketplacePredicateTest = artifacts.require('MarketplacePredicateTest')
const TransferWithSigPredicate = artifacts.require('TransferWithSigPredicate')
const TransferWithSigUtils = artifacts.require('TransferWithSigUtils')

const StakeManagerTestable = artifacts.require('StakeManagerTestable')
const StakeManagerTest = artifacts.require('StakeManagerTest')

const ExitNFT = artifacts.require('ExitNFT')
const MaticWeth = artifacts.require('MaticWETH')
const TestToken = artifacts.require('TestToken')
const RootERC721 = artifacts.require('RootERC721')

const StakeManagerExtension = artifacts.require('StakeManagerExtension')
const EventsHub = artifacts.require('EventsHub')
const EventsHubProxy = artifacts.require('EventsHubProxy')

// pos-portal: contracts
const RootChainManager = artifacts.require('RootChainManager')
const RootChainManagerProxy = artifacts.require('RootChainManagerProxy')

const META = artifacts.require('META')

const ZeroAddress = '0x0000000000000000000000000000000000000000'

const libDeps = [
  {
    lib: BytesLib,
    contracts: [WithdrawManager, ERC20Predicate, ERC721Predicate, MintableERC721Predicate]
  },
  {
    lib: Common,
    contracts: [
      WithdrawManager,
      ERC20Predicate,
      ERC721Predicate,
      MintableERC721Predicate,
      MarketplacePredicate,
      MarketplacePredicateTest,
      TransferWithSigPredicate,
      RootChainManager
    ]
  },
  {
    lib: ECVerify,
    contracts: [
      StakeManager,
      SlashingManager,
      StakeManagerTestable,
      MarketplacePredicate,
      MarketplacePredicateTest,
      TransferWithSigPredicate
    ]
  },
  {
    lib: Merkle,
    contracts: [
      WithdrawManager,
      ERC20Predicate,
      ERC721Predicate,
      MintableERC721Predicate,
      StakeManager,
      StakeManagerTestable,
      StakeManagerTest,
      RootChainManager
    ]
  },
  {
    lib: MerklePatriciaProof,
    contracts: [
      WithdrawManager,
      ERC20Predicate,
      ERC721Predicate,
      MintableERC721Predicate,
      RootChainManager
    ]
  },
  {
    lib: PriorityQueue,
    contracts: [WithdrawManager]
  },
  {
    lib: RLPEncode,
    contracts: [
      WithdrawManager,
      ERC20Predicate,
      ERC721Predicate,
      MintableERC721Predicate,
      MarketplacePredicate,
      MarketplacePredicateTest,
      RootChainManager
    ]
  },
  {
    lib: RLPReader,
    contracts: [
      RootChain,
      StakeManager,
      ERC20Predicate,
      ERC721Predicate,
      MintableERC721Predicate,
      MarketplacePredicate,
      MarketplacePredicateTest,
      RootChainManager
    ]
  },
  {
    lib: SafeMath,
    contracts: [
      RootChain,
      ERC20Predicate,
      ERC721Predicate,
      MintableERC721Predicate,
      MarketplacePredicate,
      MarketplacePredicateTest,
      TransferWithSigPredicate,
      StakeManager,
      SlashingManager,
      StakingInfo,
      StateSender,
      StakeManagerExtension,
      RootChainManager
    ]
  },
  {
    lib: SafeMath,
    contracts: [
      RootChain,
      ERC20Predicate,
      RootChainManager
    ]
  },
  {
    lib: TransferWithSigUtils,
    contracts: [
      TransferWithSigPredicate,
      MarketplacePredicate,
      MarketplacePredicateTest
    ]
  }
]

module.exports = async function(deployer, network, accounts) {
  if (!process.env.HEIMDALL_ID) {
    console.log('HEIMDALL_ID is not set; defaulting to heimdall-DAqKXZ')
    process.env.HEIMDALL_ID = 'heimdall-DAqKXZ'
  }

  deployer.then(async() => {
    await bluebird.map(libDeps, async e => {
      await deployer.deploy(e.lib)
      deployer.link(e.lib, e.contracts)
    })

    await deployer.deploy(Governance)
    await deployer.deploy(GovernanceProxy, Governance.address)
    await deployer.deploy(Registry, GovernanceProxy.address)
    await deployer.deploy(ValidatorShareFactory)
    await deployer.deploy(ValidatorShare)
    // const maticToken = await deployer.deploy(TestToken, 'MATIC', 'MATIC')
    await deployer.deploy(TestToken, 'Test ERC20', 'TEST20')
    await deployer.deploy(RootERC721, 'Test ERC721', 'TST721')
    await deployer.deploy(StakingInfo, Registry.address)
    await deployer.deploy(StakingNFT, 'Matic Validator', 'MV')

    await deployer.deploy(RootChain)
    await deployer.deploy(RootChainProxy, RootChain.address, Registry.address, process.env.HEIMDALL_ID)
    await deployer.deploy(StateSender)
    await deployer.deploy(StakeManagerTestable)
    await deployer.deploy(StakeManagerTest)

    // pos-portal: rootChainManager deploy
    {
      const rootChainManager = await deployer.deploy(RootChainManager)
      const rootChainManagerProxy = await deployer.deploy(RootChainManagerProxy, ZeroAddress)
      await rootChainManagerProxy.updateAndCall(RootChainManager.address, rootChainManager.contract.methods.initialize(accounts[0]).encodeABI())
    }

    // pos-portal: L1 Meta Token deploy
    await deployer.deploy(META, 'META', 'META', RootChainManager.address)
    console.log('* RootChainManager: ', RootChainManager.address)

    await deployer.deploy(DepositManager)
    await deployer.deploy(DepositManagerProxy, DepositManager.address, Registry.address, RootChainProxy.address, GovernanceProxy.address)

    await deployer.deploy(ExitNFT, Registry.address)
    await deployer.deploy(WithdrawManager)
    await deployer.deploy(WithdrawManagerProxy, WithdrawManager.address, Registry.address, RootChainProxy.address, ExitNFT.address)

    {
      let eventsHubImpl = await deployer.deploy(EventsHub)
      let proxy = await deployer.deploy(EventsHubProxy, ZeroAddress)
      await proxy.updateAndCall(eventsHubImpl.address, eventsHubImpl.contract.methods.initialize(
        Registry.address
      ).encodeABI())
    }

    const stakeManager = await deployer.deploy(StakeManager)
    const stakeMangerProxy = await deployer.deploy(StakeManagerProxy, ZeroAddress)
    const auctionImpl = await deployer.deploy(StakeManagerExtension)
    await stakeMangerProxy.updateAndCall(
      StakeManager.address,
      stakeManager.contract.methods.initialize(
        Registry.address,
        RootChainProxy.address,
        META.address,
        StakingNFT.address,
        StakingInfo.address,
        ValidatorShareFactory.address,
        GovernanceProxy.address,
        accounts[0],
        auctionImpl.address
      ).encodeABI()
    )

    await deployer.deploy(SlashingManager, Registry.address, StakingInfo.address, process.env.HEIMDALL_ID)
    let stakingNFT = await StakingNFT.deployed()
    await stakingNFT.transferOwnership(StakeManagerProxy.address)

    await deployer.deploy(MaticWeth)

    await Promise.all([
      deployer.deploy(ERC20Predicate, WithdrawManagerProxy.address, DepositManagerProxy.address, Registry.address),
      deployer.deploy(ERC721Predicate, WithdrawManagerProxy.address, DepositManagerProxy.address),
      deployer.deploy(MintableERC721Predicate, WithdrawManagerProxy.address, DepositManagerProxy.address),
      deployer.deploy(Marketplace),
      deployer.deploy(MarketplacePredicateTest),
      deployer.deploy(MarketplacePredicate, RootChain.address, WithdrawManagerProxy.address, Registry.address),
      deployer.deploy(TransferWithSigPredicate, RootChain.address, WithdrawManagerProxy.address, Registry.address)
    ])

    const contractAddresses = {
      root: {
        Registry: Registry.address,
        RootChain: RootChain.address,
        GovernanceProxy: GovernanceProxy.address,
        RootChainProxy: RootChainProxy.address,
        RootChainManager: RootChainManager.address,
        RootChainManagerProxy: RootChainManagerProxy.address,
        DepositManager: DepositManager.address,
        DepositManagerProxy: DepositManagerProxy.address,
        WithdrawManager: WithdrawManager.address,
        WithdrawManagerProxy: WithdrawManagerProxy.address,
        StakeManager: StakeManager.address,
        StakeManagerProxy: StakeManagerProxy.address,
        SlashingManager: SlashingManager.address,
        StakingInfo: StakingInfo.address,
        ExitNFT: ExitNFT.address,
        StateSender: StateSender.address,
        predicates: {
          ERC20Predicate: ERC20Predicate.address,
          ERC721Predicate: ERC721Predicate.address,
          MarketplacePredicate: MarketplacePredicate.address,
          TransferWithSigPredicate: TransferWithSigPredicate.address
        },
        tokens: {
          META: META.address,
          MaticWeth: MaticWeth.address,
          TestToken: TestToken.address,
          RootERC721: RootERC721.address
        },
        heimdall: {
          matic_token_address: META.address,
          staking_manager_address: StakeManagerProxy.address,
          slash_manager_address: SlashingManager.address,
          root_chain_address: RootChainProxy.address,
          staking_info_address: StakingInfo.address,
          state_sender_address: StateSender.address,
        }
      }
    }

    utils.writeContractAddresses(contractAddresses)
  })
}

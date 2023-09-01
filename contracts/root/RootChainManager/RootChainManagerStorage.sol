pragma solidity ^0.5.2;

import {IStateSender} from "../stateSyncer/IStateSender.sol";
import {ICheckpointManager} from "../ICheckpointManager.sol";
import {ProxyStorage} from "../../common/misc/ProxyStorage.sol";
import "../RootChainStorage.sol";
import "../RootChain.sol";

contract RootChainManagerStorage is ProxyStorage {
  mapping(bytes32 => address) public typeToPredicate;
  mapping(address => address) public rootToChildToken;
  mapping(address => address) public childToRootToken;
  mapping(address => bytes32) public tokenToType;
  mapping(bytes32 => bool) public processedExits;
  IStateSender internal _stateSender;
  RootChain internal _rootChainStorage;
  address public childChainManagerAddress;
}

//pragma solidity ^0.5.2;
//
//import {Ownable} from "openzeppelin-solidity/contracts/ownership/Ownable.sol";
//
///**
// * @title RootChainable
// */
//contract TokenMintable is Ownable {
//    address public rootChainManeger;
//    address public _owner;
//
//    // Rootchain changed
//    event RootChainChanged(
//        address indexed previousRootChain,
//        address indexed newRootChain
//    );
//
//    // only root chain
//    modifier onlyRootChain() {
//        require(msg.sender == rootChain);
//        _;
//    }
//
//    /**
//   * @dev Allows the current owner to change root chain address.
//   * @param newRootChain The address to new rootchain.
//   */
//    function setRootChainManager(address newRootChainManeger) public onlyOwner {
//        require(newRootChain != address(0));
//        emit RootChainChanged(rootChain, newRootChain);
//        rootChain = newRootChain;
//    }
//}

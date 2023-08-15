pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IMETA.sol";

// import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

contract META is ERC20Pausable, ERC20Detailed, ERC20Mintable, ERC20Burnable, Ownable {
    address public rootChainManager;

    constructor (string memory name, string memory symbol, uint8 decimals, uint256 totalSupply, address rootChainManager)
    public
    ERC20Detailed (name, symbol, decimals) {
      _mint(msg.sender, totalSupply);
      _transferOwnership(rootChainManager);
    }

//    function mint(address to, uint256 value) public onlyOwner {
//      _mint(account, value);
//    }
//
//    function burn(address account, uint256 value) public onlyOwner {
//      _burn(account, value);
//    }

//    modifier onlyRootChainManager() {
//      require(msg.sender == rootChainManager || onlyOwner, "No Permission");
//    _;
//    }
//
//    function setRootChainManager(address newRootChainManager) public onlyOwner {
//      require(newRootChainManager != address(0));
//      emit RootChainChanged(rootChainManager, newRootChainManager);
//      rootChainManager = newRootChainManager;
//    }
}

pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IMETA.sol";

// import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

contract META is ERC20Pausable, ERC20Detailed, IMETA, Ownable {
    address public rootChainManeger;

    constructor (string memory name, string memory symbol, uint8 decimals, uint256 totalSupply)
    public
    ERC20Detailed (name, symbol, decimals) {
      _mint(msg.sender, totalSupply);
    }

    function mint(address account, uint256 value) public onlyRootChainManager {
      _mint(account, value);
    }

    function burn(address account, uint256 value) public onlyRootChainManager {
      _burn(account, value);
    }

    modifier onlyRootChainManager() {
      require(msg.sender == rootChainManeger || onlyOwner, "No Permission");
    _;
    }

    function setRootChainManager(address newRootChainManeger) public onlyOwner {
      require(newRootChainManeger != address(0));
      emit RootChainChanged(rootChainManeger, newRootChainManeger);
      rootChainManeger = newRootChainManeger;
    }
}

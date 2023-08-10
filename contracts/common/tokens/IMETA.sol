pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

interface IMETA is IERC20 {

    function mint(address account, uint256 value) external;

    function burn(address account, uint256 value) external;

    function setRootChainManager(address newRootChainManeger) external;
}

pragma solidity 0.6.6;

import {UpgradableProxy} from "../../common/misc/UpgradableProxy.sol";

contract RootChainManagerProxy is UpgradableProxy {
    constructor(address _proxyTo)
        public
        UpgradableProxy(_proxyTo)
    {}
}

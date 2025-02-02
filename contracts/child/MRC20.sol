pragma solidity ^0.5.11;

import "./BaseERC20NoSig.sol";

/**
 * @title Matic token contract
 * @notice This contract is an ECR20 like wrapper over native ether (matic token) transfers on the matic chain
 * @dev ERC20 methods have been made payable while keeping their method signature same as other ChildERC20s on Matic
 */
contract MRC20 is BaseERC20NoSig {
    event Transfer(address indexed from, address indexed to, uint256 value);

    uint256 public currentSupply = 0;
    uint8 private constant DECIMALS = 18;
    bool isInitialized;

    //TODO locked balance 관련 변수
    mapping(address => uint256) private _balance;
    mapping(address => uint256) private _lockedBalance;
    uint256 private _totalLockedBalance;

    constructor() public {}

    function initialize(address _childChain, address _token) public {
        // Todo: once BorValidator(@0x1000) contract added uncomment me
        // require(msg.sender == address(0x1000));
        require(!isInitialized, "The contract is already initialized");
        isInitialized = true;
        token = _token;
        _transferOwnership(_childChain);
    }

    function setParent(address) public {
        revert("Disabled feature");
    }

    //TODO L1->L2 deposit: amount unlock
    //TODO 돈이 들어온다는 heimdall의 이벤트 알림이 오면 여기선 lock된 돈을 풀고 -> 사용자에게 보내줘야함 -> 디포짓 이벤트 발생
    // wemix의 stakingImp에서는,, deposit이 stake하기 위한 자산 lock하는 기능이고, 여기는 L1에서 들어와서 unlock하는 기능이어야 함
    // 여기 balanceOf는 네이티브 커런시의 진짜 밸런스를 보여주고, wemix는 이 토큰 컨트랙트에 묶인 수량을 보여주는 듯
    function deposit(address user, uint256 amount) public onlyOwner {
        // check for amount and user
        require(
            amount > 0 && user != address(0x0),
            "Insufficient amount or invalid user"
        );

        // input balance
        uint256 input1 = balanceOf(user);

        // transfer amount to user
        address payable _user = address(uint160(user));
        _user.transfer(amount);

        currentSupply = currentSupply.add(amount);

        // deposit events
        emit Deposit(token, user, amount, input1, balanceOf(user));
    }

    //TODO L2->L1 withdraw: amount lock
    //TODO L1으로 돈을 보내고 싶으면 이 함수로 돈을 옮기고 -> 돈을 lock하고 -> 이벤트 발생
    // wemix의 stakingImp에서는,, withdraw가 stake를 위해 lock된 자산을 unlock하고 사용자에게 돌려주기 위함이고, 여기는 L1으로 자산을 보내기 위해 lock 하는 기능이어야 함
    function withdraw(uint256 amount) public payable {
        address user = msg.sender;
        // input balance
        uint256 input = balanceOf(user);

        currentSupply = currentSupply.sub(amount);
        // check for amount
        require(
            amount > 0 && msg.value == amount,
            "Insufficient amount"
        );

        // withdraw event
        emit Withdraw(token, user, amount, input, balanceOf(user));
    }

    function name() public pure returns (string memory) {
        return "Matic Token";
    }

    function symbol() public pure returns (string memory) {
        return "MATIC";
    }

    function decimals() public pure returns (uint8) {
        return DECIMALS;
    }

    function totalSupply() public view returns (uint256) {
        return 10000000000 * 10**uint256(DECIMALS);
    }

    function balanceOf(address account) public view returns (uint256) {
        return account.balance;
    }

    /// @dev Function that is called when a user or another contract wants to transfer funds.
    /// @param to Address of token receiver.
    /// @param value Number of tokens to transfer.
    /// @return Returns success of function call.
    function transfer(address to, uint256 value) public payable returns (bool) {
        if (msg.value != value) {
            return false;
        }
        return _transferFrom(msg.sender, to, value);
    }

    /**
   * @dev _transfer is invoked by _transferFrom method that is inherited from BaseERC20.
   * This enables us to transfer MaticEth between users while keeping the interface same as that of an ERC20 Token.
   */
    function _transfer(address sender, address recipient, uint256 amount)
        internal
    {
        require(recipient != address(this), "can't send to MRC20");
        address(uint160(recipient)).transfer(amount);
        emit Transfer(sender, recipient, amount);
    }
}

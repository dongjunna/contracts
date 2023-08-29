# contract test

### 테스트 노드 구성
1. metadium private network start
- bin/gmet.sh init-gov metadium_bp1 config.json
- bin/gmet.sh console metadium_bp1 -> admin.etcdInit()
2. 테스트 자산 이동
- bp1 -> 테스트에 사용될 지갑
- personal.signTransaction({"from":"bp1","to":"test","nonce":"0xF","value":"0x152D02C7E14AF6800000","maxPriorityFeePerGas":"0x174876E801","maxFeePerGas":"0x174876E801","gas":"0x5208"},"1234")
- eth.sendRawTransaction("rawTransaction")

***

### 컨트랙트 배포 및 L2->L1 자산 이동 테스트
1. L1 Contract 배포   
   npm run truffle:migrate:gwemix:dev -- --reset --to 4
2. L2 Contract 배포   
   npm run truffle:migrate:dev:gmet -- --reset -f 5 --to 5
3. L1 Contract 세팅   
   npm run truffle:migrate:gwemix:dev -- -f 6 --to 6
4. L1 스테이킹   
   npm run truffle:migrate:gwemix:dev -- --reset -f 7 --to 7
5. L2 자산이동(lock)   
   npm run truffle:migrate:dev:gmet -- -f 8 --to 8
6. L1 RootChainManager Test   
   npm run truffle:migrate:gwemix:dev  -- —reset -f 9 --to 9

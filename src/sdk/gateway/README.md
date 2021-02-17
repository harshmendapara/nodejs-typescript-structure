# Demonstrates the use of classes in the fabric-network module

1. Wallet interfaces + Classes
2. Gateway
3. Network
4. Contract
5. Transaction

# wallet.js

===========
Usage: node ./wallet.js <action default=list> [org] [user]

To clean: Delete the sub folder user-wallet

- List identities
  node ./wallet.js list

- Add identity
  node ./wallet.js add org-name user-name

- Export identity
  node ./wallet.js export org-name user-name

# gateway.js

============

1. Start the dev env  
   dev-init.sh

2. Deploy the token/erc20 chaincode
   cd \$GOPATH/src/token/erc20
   ./deploy.sh

3. Usage: node ./gateway.js

# Exercise

Add the function submitTxnTransaction
Solution: Commented at the end of the gateway.js file

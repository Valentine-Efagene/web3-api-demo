# web3-api-demo
Basic Web3 api, but with mongoose and web token auth.

The project uses the singleton approach to node API development, as shown by Marcos Henrique da Silva [1], but adapted for javascript, and the web3 section heavily draws ideas from the example given by Zafar Saleem [2]. The truffle section is in its own folder named truffle, with its own package.json, to prevent ES conflicts, since the node api is written in module JS, while the truffle part is written in common JS.

### References
1. https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-1
2. https://blog.logrocket.com/interacting-smart-contracts-via-nodejs-api/

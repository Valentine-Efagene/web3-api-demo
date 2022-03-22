import Web3 from 'web3'

class Web3Service {
  constructor() {

  }

  getWeb3() {
    let web3

    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    return web3
  }
}

export default new Web3Service()
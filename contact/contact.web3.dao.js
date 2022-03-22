import debug from "debug";
import web3Service from "../common/service/web3.service.js";
import fs from 'fs'

let rawdata = fs.readFileSync('./truffle/build/contracts/Contacts.json');
let artifacts = JSON.parse(rawdata);
//import { CONTACT_ABI, CONTACT_ADDRESS } from '../config.js'

const log = debug('app:in-memory-contacts-web3-dao')

class ContactsWeb3Dao {
  constructor() {
    log('Created new instance of ContactsWeb3Dao');
  }

  async getContacts() {
    const web3 = web3Service.getWeb3()
    // const accounts = await web3.eth.getAccounts();
    const abi = artifacts.abi
    const address = artifacts.networks[5777].address
    const contactList = new web3.eth.Contract(abi, address);

    let cache = [];
    const COUNTER = await contactList.methods.count().call();

    for (let i = 1; i <= COUNTER; i++) {
      const contact = await contactList.methods.contacts(i).call();
      cache = [...cache, contact];
    }

    return cache
  }
}

export default new ContactsWeb3Dao();
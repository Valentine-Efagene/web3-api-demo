import fs from 'fs'

let rawdata = fs.readFileSync('./truffle/build/contracts/Contacts.json');
let artifacts = JSON.parse(rawdata);

console.log(artifacts.networks[5777].address)
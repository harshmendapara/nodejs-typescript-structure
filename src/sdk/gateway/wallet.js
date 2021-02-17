/* eslint-disable*/

const fs = require('fs');
const path = require('path');
const {Wallets} = require('fabric-network');

let CRYPTO_CONFIG;
let CRYPTO_CONFIG_PEER_ORGS;
let WALLET_FOLDER;
let wallet;
let action = 'list';
init();

async function init() {
  CRYPTO_CONFIG = path.join(__dirname, '../../../../yrbc_network_sai/yrbc_network/crypto-config');
  CRYPTO_CONFIG_PEER_ORGS = path.join(CRYPTO_CONFIG, 'peerOrganizations');
  WALLET_FOLDER = path.join(__dirname, 'user-wallet');
  wallet = await generateWallet();
  if (process.argv.length > 2) {
    action = process.argv[2];
  }

  if (action == 'list') {
    console.log('List of identities in wallet:');
    listIdentities();
  } else if (action == 'add' || action == 'export') {
    if (process.argv.length < 5) {
      console.log("For 'add' & 'export' - Org & User are needed!!!");
      process.exit(1);
    }
    if (action == 'add') {
      addToWallet(process.argv[3], process.argv[4]);
      console.log('Done adding/updating.');
    } else {
      exportIdentity(process.argv[3], process.argv[4]);
    }
  }
}

async function generateWallet() {
  return await Wallets.newFileSystemWallet(WALLET_FOLDER);
}

async function addToWallet(org, user) {
  try {
    var cert = readCertCryptogen(org, user);

    var key = readPrivateKeyCryptogen(org, user);
  } catch (e) {
    console.log('Error reading certificate or key!!! ' + org + '/' + user);
    process.exit(1);
  }

  let mspId = createMSPId(org);

  const identityLabel = createIdentityLabel(org, user);
  const identity = {
    credentials: {
      certificate: cert,
      privateKey: key
    },
    mspId,
    type: 'X.509'
  };

  await wallet.put(identityLabel, identity);
}

async function listIdentities() {
  console.log('Identities in Wallet:');

  let list = await wallet.list();

  for (var i = 0; i < list.length; i++) {
    console.log(i + 1 + '. ' + list[i].label);
  }
}

async function exportIdentity(org, user) {
  let label = createIdentityLabel(org, user);

  let identity = await wallet.get(label);

  if (identity == null) {
    console.log(`Identity ${user} for ${org} Org Not found!!!`);
  } else {
    console.log(identity);
  }
}

function readCertCryptogen(org, user) {
  //peerOrganizations/hotels.yennarascala.com/users/Admin@hotels.yennarascalals
  var certPath =
    CRYPTO_CONFIG_PEER_ORGS +
    '/' +
    org +
    '.com/users/' +
    user +
    '@' +
    org +
    '.com/msp/signcerts/' +
    user +
    '@' +
    org +
    '.com-cert.pem';
  const cert = fs.readFileSync(certPath).toString();
  return cert;
}

function readPrivateKeyCryptogen(org, user) {
  var pkFolder =
    CRYPTO_CONFIG_PEER_ORGS + '/' + org + '.com/users/' + user + '@' + org + '.com/msp/keystore';
  fs.readdirSync(pkFolder).forEach((file) => {
    pkfile = file;
    return;
  });

  return fs.readFileSync(pkFolder + '/' + pkfile).toString();
}

function createMSPId(org) {
  return org.split('.')[0] + 'MSP';
}

function createIdentityLabel(org, user) {
  console.log('Identity Lable', `${user}@${org}.com`);
  return `${user}@${org}.com`;
}

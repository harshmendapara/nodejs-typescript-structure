/**
 * Demonstrates the use of Channel class instance for querying the channel
 */
/* eslint-disable*/
const fs = require('fs');
const Client = require('fabric-client');

const asn = require('asn1.js');
var sha = require('js-sha256');

// Constants for profile, wallet & user
const CONNECTION_PROFILE_PATH = '../profiles/dev-connection.yaml';
// Client section configuration
const ACME_CLIENT_CONNECTION_PROFILE_PATH = '../profiles/acme-client.yaml';

// Org & User
const ORG_NAME = 'acme';
const USER_NAME = 'Admin'; // Non admin identity will lead to 'access denied' try User1
const PEER_NAME = 'acme-peer1.acme.com';
const CHANNEL_NAME = 'airlinechannel';

// Variable to hold the client
var client = {};
// Variable to hold the channel
var channel = {};

// Call the main function
main();

async function main() {
  // Setup the client instance
  client = await setupClient();

  // Setup the channel instance
  channel = await setupChannel();

  // Print the info for the chain
  await getChannelInfo();

  // Print the chaincode info
  await getChaincodeInfo();
}

/**
 * Gathers info for the channel
 * Prints the information for the 2 latest blocks
 */
async function getChannelInfo() {
  // Gets the info on the blockchain
  let info = await channel.queryInfo();

  const blockHeight = parseInt(info.height.low);
  console.log(`Current Chain Height: ${blockHeight}\n`);

  // Lets make sure there are enough blocks in chai
  if (blockHeight < 3) {
    console.log('Not enough height!! - please invoke chaincode!!');
    return;
  }

  // Get the latest block
  let block = await channel.queryBlock(blockHeight - 1);
  printBlockInfo(block);

  // Get the previous block with hash from latest block
  block = await channel.queryBlock(blockHeight - 2);
  printBlockInfo(block);
}

/**
 * Get the information on instantiated chaincode
 */
async function getChaincodeInfo() {
  let chaincodes = await channel.queryInstantiatedChaincodes();
  console.log('Chaincode instantiated:');
  for (var i = 0; i < chaincodes.chaincodes.length; i++) {
    console.log(
      `\t${i + 1}. name=${chaincodes.chaincodes[i].name} version=${
        chaincodes.chaincodes[i].version
      }`
    );
  }
}

/**
 * Demonstrates the use of query by chaincode
 */
async function queryERC20() {
  // Execute the query
  chaincodes = await channel.queryByChaincode({
    chaincodeId: 'erc20',
    fcn: 'balanceOf',
    args: ['sam']
  });

  console.log(chaincodes[0].toString('utf8'));
}

/**
 * Creates an instance of the Channel class
 */
async function setupChannel() {
  try {
    // Get the Channel class instance from client
    channel = await client.getChannel(CHANNEL_NAME, true);
  } catch (e) {
    console.log('Could NOT create channel: ', CHANNEL_NAME);
    process.exit(1);
  }
  console.log('Created channel object.');

  return channel;
}

/**
 * Initialize the file system credentials store
 * 1. Creates the instance of client using <static> loadFromConfig
 * 2. Loads the client connection profile based on org name
 * 3. Initializes the credential store
 * 4. Loads the user from credential store
 * 5. Sets the user on client instance and returns it
 */
async function setupClient() {
  // setup the instance
  const client = Client.loadFromConfig(CONNECTION_PROFILE_PATH);

  // setup the client part
  if (ORG_NAME == 'acme') {
    client.loadFromConfig(ACME_CLIENT_CONNECTION_PROFILE_PATH);
  } else if (ORG_NAME == 'budget') {
    client.loadFromConfig(BUDGET_CLIENT_CONNECTION_PROFILE_PATH);
  } else {
    console.log('Invalid Org: ', ORG_NAME);
    process.exit(1);
  }

  // Call the function for initializing the credentials store on file system
  await client.initCredentialStores().then((done) => {
    console.log('initCredentialStore(): ', done);
  });

  let userContext = await client.loadUserFromStateStore(USER_NAME);
  if (userContext == null) {
    console.log('User NOT found in credstore: ', USER_NAME);
    process.exit(1);
  }

  // set the user context on client
  client.setUserContext(userContext, true);

  return client;
}

/**
 * Prints information in the block
 * @param {*} block
 */
function printBlockInfo(block) {
  console.log('Block Number: ' + block.header.number);
  console.log('Block Hash: ' + calculateBlockHash(block.header));
  console.log('\tPrevious Hash: ' + block.header.previous_hash);
  console.log('\tData Hash: ' + block.header.data_hash);
  console.log('\tTransactions Count: ' + block.data.data.length);

  block.data.data.forEach((transaction) => {
    console.log('\t\tTransaction ID: ' + transaction.payload.header.channel_header.tx_id);
    console.log('\t\tCreator ID: ' + transaction.payload.header.signature_header.creator.Mspid);
    // Following lines if uncommented will dump too much info :)
    //   console.log('Data: ');
    //   console.log(JSON.stringify(transaction.payload.data));
  });
}

/**
 * Used for calculating hash for block received with channel.queryBlock
 * @param {*} header
 */
function calculateBlockHash(header) {
  let headerAsn = asn.define('headerAsn', function () {
    this.seq().obj(
      this.key('Number').int(),
      this.key('PreviousHash').octstr(),
      this.key('DataHash').octstr()
    );
  });

  let output = headerAsn.encode(
    {
      Number: parseInt(header.number),
      PreviousHash: Buffer.from(header.previous_hash, 'hex'),
      DataHash: Buffer.from(header.data_hash, 'hex')
    },
    'der'
  );

  let hash = sha.sha256(output);
  return hash;
}

/**
 * Exercise Solution:
 */
async function getGenesis() {
  let genesis = await channel.getGenesisBlock();
  console.log(genesis.header.data_hash);
  // Cannot use the  printBlockInfo(genesis)
}

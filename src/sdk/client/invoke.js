/**
 * Solution to challenge exercise
 * ==============================
 * This code demonstrates how to invoke chaincode using client & channel
 *
 * The code is "Highly Simplified" to make it easy to read - no promises used deliberately :)
 *
 * THIS IS NOT PRODUCTION READY CODE
 *
 * + As there is NO error checks
 * + As the timeout not implemented i.e., indefinite wait if commit event not received
 */
/* eslint-disable*/
'use strict';
const fs = require('fs');
const Client = require('fabric-client');

// Constants for profile
const CONNECTION_PROFILE_PATH = '../profiles/dev-connection.yaml';
// Client section configuration
const ACME_CLIENT_CONNECTION_PROFILE_PATH = '../profiles/acme-client.yaml';

// Org & User
const ORG_NAME = 'acme';
const USER_NAME = 'Admin';
const PEER_NAME = 'acme-peer1.acme.com';
const CHANNEL_NAME = 'airlinechannel';

const CHAINCODE_ID = 'erc20';
const CHAINCODE_EVENT = 'transfer';

// Variable to hold the client
var client = {};
// Variable to hold the channel
var channel = {};

main();

async function main() {
  // setup client
  client = await setupClient();
  // Setup the channel instance
  channel = await setupChannel();

  // Invoke the chaincode with commit listener
  await invokeChaincode();
}

async function invokeChaincode() {
  // Get the peer for channel.
  let peerName = channel.getChannelPeer(PEER_NAME);

  // Create a transaction ID
  var tx_id = client.newTransactionID();
  let tx_id_string = tx_id.getTransactionID();

  // Create the ChaincodeInvokeRequest - used as arg for sending proposal to endorser(s)
  // https://fabric-sdk-node.github.io/release-1.4/global.html#ChaincodeInvokeRequest
  var request = {
    targets: peerName,
    chaincodeId: CHAINCODE_ID,
    fcn: 'transfer',
    args: ['john', 'sam', '1'],
    chainId: CHANNEL_NAME,
    txId: tx_id
  };

  // PHASE-1 of Transaction Flow
  // 1. Send the transaction proposal
  // https://fabric-sdk-node.github.io/release-1.4/Channel.html#sendTransactionProposal__anchor
  // Response // https://fabric-sdk-node.github.io/release-1.4/global.html#ChaincodeInvokeRequest

  // #1  Send the txn proposal
  console.log('#1 channel.sendTransactionProposal     Done.');
  let results = await channel.sendTransactionProposal(request);

  // Array of proposal responses *or* error @ index=0
  var proposalResponses = results[0];
  // Original proposal @ index = 1
  var proposal = results[1];

  // #2 Loop through responses to check if they are good
  var all_good = true;
  for (var i in proposalResponses) {
    let good = false;
    if (
      proposalResponses &&
      proposalResponses[i].response &&
      proposalResponses[i].response.status === 200
    ) {
      good = true;
      console.log(`\tinvoke chaincode EP response #${i} was good`);
    } else {
      console.log(`\tinvoke chaincode EP response #${i} was bad!!!`);
    }
    all_good = all_good & good;
  }

  console.log('#2 Looped through the EP results  all_good=', all_good);

  // #3 Setup the TX listener
  await setupTxListener(tx_id_string);
  console.log('#3 Registered the Tx Listener');

  // Broadcast request
  var orderer_request = {
    txId: tx_id,
    proposalResponses: proposalResponses,
    proposal: proposal
  };

  // PHASE-2 of Transaction Flow
  // 4. Send the transaction to orderer for delivery
  // https://fabric-sdk-node.github.io/release-1.4/Channel.html#sendTransaction__anchor

  // #4 Request orderer to broadcast the txn
  await channel.sendTransaction(orderer_request);
  console.log('#4 channel.sendTransaction - waiting for Tx Event');
}

/**
 * Setup the transaction listener
 *
 * #5. Print message in call back of event listener
 */
function setupTxListener(tx_id_string) {
  // 1. Get the event hub for the named peer
  let event_hub = channel.getChannelEventHub(PEER_NAME);

  // PHASE-3 of Transaction Flow
  // 2. Register the TX Listener
  event_hub.registerTxEvent(
    tx_id_string,
    (tx, code, block_num) => {
      console.log('#5 Received Tx Event');
      console.log(
        '\tThe chaincode invoke chaincode transaction has been committed on peer %s',
        event_hub.getPeerAddr()
      );
      console.log('\tTransaction %s is in block %s', tx, block_num);

      // Check for the Validity of transaction
      // Note: All transactions are logged to ledger irrespective of the status
      if (code !== 'VALID') {
        let message = util.format('\tThe invoke chaincode transaction was invalid, code:%s', code);
        console.log(message);
      } else {
        console.log('\tThe invoke chaincode transaction was VALID.');
      }
    },
    // 3. Callback for errors
    (err) => {
      console.log(err);
    },
    // the default for 'unregister' is true for transaction listeners
    // so no real need to set here, however for 'disconnect'
    // the default is false as most event hubs are long running
    // in this use case we are using it only once
    {unregister: true, disconnect: true}
  );

  // 4. Connect to the hub
  event_hub.connect();
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
    //console.log("initCredentialStore(): ", done)
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
  // console.log("Created channel object.")

  return channel;
}

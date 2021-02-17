import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import config from '../../config/config';
import { Gateway, GatewayOptions, Wallets } from 'fabric-network';

export async function initGateway(userId: string, networkName: string, contractId: string) {
	const gateway = new Gateway();
	const { connectionProfile, connectionOptions } = await setupGateway(userId);
	await gateway.connect(connectionProfile, connectionOptions);
	try {
		let network = await gateway.getNetwork(networkName);
		const contract = await network.getContract(contractId);
		return contract;
	} catch (err) {
		throw err;
	} finally {
		gateway.disconnect();
	}
}

async function setupGateway(userId: string) {
	const CONNECTION_PROFILE: string = path.join(__dirname, '../../', config.profilePath as string);

	const WALLET_PATH: string = path.join(__dirname, config.userWalletFolder as string);

	let connectionProfile = yaml.safeLoad(fs.readFileSync(CONNECTION_PROFILE, 'utf-8'));

	let wallet = await Wallets.newFileSystemWallet(WALLET_PATH);

	let connectionOptions: GatewayOptions = {
		identity: userId,
		wallet,
		discovery: { enabled: false }
	};

	return { connectionProfile, connectionOptions };
}

export async function queryContract(contract, data: string | null, functionName: string) {
	try {
		if (data === null) {
			let response = await contract.evaluateTransaction(functionName);
			console.log(`Query Response 1=${response}`);
			return response;
		}
		// Query the chaincode
		let response = await contract.evaluateTransaction(functionName, data);
		console.log(`Query Response 2=${response}`);
		return response;
	} catch (e) {
		console.log(e);
	}
}

export async function submitTxnContract(contract, data, functionName) {
	const values = Object.values(data);
	try {
		let response = await contract.submitTransaction(functionName, ...values);
		console.log('RESPONSE \n', response);
		return response;
	} catch (err) {
		throw err;
	}
}

export async function submitTxnTransaction(contract, data, functionName) {
	try {
		let response = await contract.submitTransaction(functionName, data.id, data.approvalStatus);
		console.log('transaction.submit()=', response);
		return response;
	} catch (e) {
		console.log(e);
		throw e;
	}
}

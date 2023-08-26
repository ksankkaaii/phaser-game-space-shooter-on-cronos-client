import { ethers } from "ethers"
import { DeFiWeb3Connector } from "deficonnect"; // npm install deficonnect
import * as config from "./config/env"

export const connect = async () => {
  try {
    console.log(`start defi wallet`);

    const connector = new DeFiWeb3Connector({
      supportedChainIds: [config.configVars.mainnet.chainId],
      rpc: {
        [config.configVars.mainnet.chainId]: config.configVars.mainnet.rpcUrl,
      },
      pollingInterval: 15000,
    });
    console.log(`define connector`);
    try {
      await connector.activate();
    }
    catch(err) {
      console.log(`connector is err: `, err);
    }

    console.log(`connector activated`);
    const provider = await connector.getProvider();
    console.log(`get provider`);
    const web3Provider = new ethers.providers.Web3Provider(provider);
    console.log(`get web3Provider`);
    console.log(`provider.chainId is `, provider.chainId, parseInt(provider.chainId));
    if (!(parseInt(provider.chainId) === config.configVars.mainnet.chainId)) {
      return null
    }

    connector.on("session_update", () => { window.location.reload()})
    connector.on("Web3ReactDeactivate", () => {  window.location.reload()})
    connector.on("Web3ReactUpdate", () => {  window.location.reload()})
    console.log(`defi chain ID`, provider.chainId);
    return {
      walletProviderName: "defiwallet",
      address: (await web3Provider.listAccounts())[0],
      browserWeb3Provider: web3Provider,
      serverWeb3Provider: new ethers.providers.JsonRpcProvider(
        config.configVars.mainnet.rpcUrl
      ),
      wcProvider: provider,
      wcConnector: connector,
      connected: true,
      chainId: typeof provider.chainId == `string` ? parseInt(provider.chainId, 16) : provider.chainId,
    }
  } catch (e) {
    console.log(`wallet-connect error`, e);
    return null
  }
}

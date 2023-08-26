import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

import * as config from "./config/env";

export const connect = async () => {
  try {
    localStorage.clear()
    const provider = new WalletConnectProvider({
      rpc: {
        [config.configVars.mainnet.chainId]:
          config.configVars.mainnet.rpcUrl,
      },
      chainId: config.configVars.mainnet.chainId,
    });
    console.log(`wc chain ID`, provider.chainId);
    await provider.enable()
    const ethersProvider = new ethers.providers.Web3Provider(provider)
    if (!(provider.chainId === config.configVars.mainnet.chainId)) {
      return null
    }

    provider.on("chainChanged", () => {  window.location.reload()}); // window.location.reload()})
    provider.on("accountsChanged", () => {  window.location.reload()}); // window.location.reload()})
    provider.on("disconnect", () => {  window.location.reload()}); // window.location.reload()})

    return {
      walletProviderName: "walletconnect",
      address: (await ethersProvider.listAccounts())[0],
      browserWeb3Provider: ethersProvider,
      serverWeb3Provider: new ethers.providers.JsonRpcProvider(
        config.configVars.mainnet.rpcUrl
      ),
      wcProvider: provider,
      wcConnector: null,
      connected: true,
      chainId: provider.chainId,
    }
  } catch (e) {
    console.log(`wallet-connect error`, e);
    return null
  }
}

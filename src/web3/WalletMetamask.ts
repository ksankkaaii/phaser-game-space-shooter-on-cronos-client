import { ethers } from "ethers";
import * as config from "./config/env"

const hexToInt = (s) => {
  const bn = ethers.BigNumber.from(s)
  return parseInt(bn.toString())
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));


export const switchNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: config.configVars.mainnet.chainIdHex }],
    })
  } catch (e) {
    console.log('error in switchNetwork', e)
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: config.configVars.mainnet.chainIdHex,
          chainName: config.configVars.mainnet.chainName,
          rpcUrls: [config.configVars.mainnet.rpcUrl],
          nativeCurrency: config.configVars.mainnet.nativeCurrency,
          blockExplorerUrls: [config.configVars.mainnet.blockExplorerUrl],
        },
      ],
    })
  }
}

export const connect = async () => {
  try {
    let chainId = await window.ethereum.request({ method: "eth_chainId" })
    if (!(chainId === config.configVars.mainnet.chainIdHex)) {
      await switchNetwork()
      await delay(2000)
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    window.ethereum.on("chainChanged", () => {  window.location.reload()}); // window.location.reload()})
    window.ethereum.on("accountsChanged", () => {  window.location.reload()}); // window.location.reload()})
    window.ethereum.on("disconnect", () => {  window.location.reload()}); // window.location.reload()})
    console.log(`metamask chain ID`, hexToInt(
      await window.ethereum.request({ method: "eth_chainId" })
    ),);
    return {
      walletProviderName: "metamask",
      address: accounts[0],
      browserWeb3Provider: new ethers.providers.Web3Provider(window.ethereum as any),
      serverWeb3Provider: new ethers.providers.JsonRpcProvider(
        config.configVars.mainnet.rpcUrl
      ),
      wcProvider: null,
      wcConnector: null,
      connected: true,
      chainId: hexToInt(
        await window.ethereum.request({ method: "eth_chainId" })
      ),
    }
  } catch (e) {
    console.log("error in connect metamask", e)
    return null
  }
}

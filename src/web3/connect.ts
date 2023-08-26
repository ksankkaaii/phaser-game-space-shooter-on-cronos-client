import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import store from 'stores'
import { setWalletConnecting } from 'stores/WalletStore'

import * as config from "./config/env";

const hexToInt = (s) => {
  const bn = ethers.BigNumber.from(s)
  return parseInt(bn.toString())
}

export const connectAccount = async (firstRun = false, type = "") => {
    const providerOptions = {
      injected: {
        display: {
          logo: "https://github.com/MetaMask/brand-resources/raw/master/SVG/metamask-fox.svg",
          name: "MetaMask",
          description: "Connect with MetaMask in your browser",
        },
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          chainId: config.configVars.mainnet.chainId,
          rpc: {
            [config.configVars.mainnet.chainId]: config.configVars.mainnet.rpcUrl,
          },
          network: "cronos",
          metadata: {
            icons: ["https://ebisusbay.com/vector%20-%20face.svg"],
          },
        }
      }
    };

    const web3Modal = new Web3Modal({
      cacheProvider: false,
      disableInjectedProvider: false,
      providerOptions, // required
    });

    const web3provider = await web3Modal
      .connect()
      .then((web3provider) => web3provider)
      .catch((error) => {
        console.log("Could not get a wallet connection", error);
        return null;
      });

    if (!web3provider) {
      console.log(`web3provider`);
      walletDisconnect();
      return null;
    }

    try {
      store.dispatch(setWalletConnecting(true));
      const provider = new ethers.providers.Web3Provider(web3provider);
      const cid = await web3provider.request({
        method: "net_version",
      });

      if(cid != config.configVars.mainnet.chainId) {
        
      }

      const accounts = await web3provider.request({
        method: "eth_accounts",
        params: [{ chainId: cid }],
      });
      const address = accounts[0];

      web3provider.on("DeFiConnectorDeactivate", (error) => {
        console.log(`DeFiConnectorDeactivate`)
        walletDisconnect()
      });

      web3provider.on("disconnect", (error) => {
        console.log(`disconnect`)
        walletDisconnect()
      });

      web3provider.on("accountsChanged", (accounts) => {
        console.log(`accountsChanged`)
        walletDisconnect()
      });

      web3provider.on("DeFiConnectorUpdate", (accounts) => {
        console.log(`DeFiConnectorUpdate`)
        setLocalStorageWallet(false);
        window.location.reload();
      });

      web3provider.on("chainChanged", (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        console.log(`chainChanged`)
        setLocalStorageWallet(false);
        window.location.reload();
      });

      store.dispatch(setWalletConnecting(false));
      setLocalStorageWallet(true);
      localStorage.setItem('wallet-type', web3provider.isMetaMask ? `metamask` : `walletconnect`)
      return {
        address: address,           
        browserWeb3Provider: provider,
        chainId: web3provider.isMetaMask ? hexToInt( await window.ethereum.request({ method: "eth_chainId" }) ) : hexToInt(web3provider.chainId),
      }
    } catch (error) {
      console.log("Error connecting wallet!", error);
      walletDisconnect();
      return null;
    }
    
  };

export const walletDisconnect = () => {
  const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions: {}, // required
  });
  web3Modal.clearCachedProvider();
  store.dispatch(setWalletConnecting(false));
  setLocalStorageWallet(false);
};

const setLocalStorageWallet = (connected: boolean) => {
  const now = new Date()
  const item = {
    walletConnected: connected ? `true` : `false`,
    expiry: connected ?now.getTime() + (1000 * 3600 * 1) : now.getTime()
  }
  localStorage.setItem('wallet-connected', JSON.stringify(item))
}

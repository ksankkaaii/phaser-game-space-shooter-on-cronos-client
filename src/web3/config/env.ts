export const NET = "cronos testnet"
export const CHAIN_ID = 338
export const CHAIN_ID_HEX = '0x152'
export const rpcUrl = 'https://evm-t3.cronos.org'

// main net
export const craftContractAddr = "0xC6373d6F369A9FfE7D93B21F2A5b0E16291d996D"
export const shooterContractAddr = "0xA554482831bC8D5ae809B637f6932D4E608BE5E7"
export const tokenContractAddr = "0xe6C2F6Ab401F08EB7B073Eac710D7DB2FBc2191C"
export const pilotContractAddr = "0x513087DfFa213E8680a4C59a039ADBFced192A11"

// test net
// export const craftContractAddr = "0x023c6f9917307A978a04698e468931dA398f4Bd9"
// export const shooterContractAddr = "0x9dc08113c054Acb07C2579b0b8d8f6Dd85B0a1BC"
// export const tokenContractAddr = "0x3d8B61Ef6ad14B53aa2504217efbc5523Da8447b"
// export const pilotContractAddr = "0x513087DfFa213E8680a4C59a039ADBFced192A11"

export const configVars = {
  mode: "regular",
  testnet: {
    rpcUrl: "https://cronos-testnet-3.crypto.org:8545/",
    chainId: 338,
    chainIdHex: "0x152",
    chainName: "Cronos Testnet",
    chainType: "mainnet",
    nativeCurrency: {
      name: "CRO",
      symbol: "CRO",
      decimals: 18,
    },
    blockExplorerUrl: "https://cronos.crypto.org/explorer/testnet3/",
  },
  mainnet: {
    rpcUrl: "https://mainnet.cronoslabs.com/v1/55e37d8975113ae7a44603ef8ce460aa",
    chainId: 25,
    chainIdHex: "0x19",
    chainName: "Cronos Mainnet Beta",
    chainType: "mainnet",
    nativeCurrency: {
      name: "CRO",
      symbol: "CRO",
      decimals: 18,
    },
    blockExplorerUrl: "https://cronos.crypto.org/explorer/",
  }
};
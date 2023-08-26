import { clearWalletProvider, connectToWallet, web3ModalProvider } from "./Web3Modal"

import { craftContractAddr } from "./config/env"
import { craftAbi } from './config/abi'

export let account = undefined
let web3Modal = undefined
export let craftContract = null

async function updateAccount() {
  const accounts = await web3Modal.eth.getAccounts()
  updateAccountAddress(accounts)

  if (web3ModalProvider !== undefined && web3ModalProvider !== null) {
    web3ModalProvider.on("accountsChanged", (accounts) => {
      window.location.reload()
    })
    // web3ModalProvider.on("chainChanged", (id: number) => {
    //   window.location.reload()
    // })
  }
}

export async function initWallet() {
  try {
    web3Modal = await connectToWallet()
    craftContract = new web3Modal.eth.Contract(craftAbi, craftContractAddr)
    await updateAccount()
  } catch (e) {
    console.log("wallet connect error, reconnecting", e)
  }
}

export function updateAccountAddress(accounts) {
  if (accounts !== undefined && accounts.length > 0) {
    account = accounts[0]
  } else if (account !== undefined) {
    clearWalletProvider()
    account = undefined
  }

  // const dispatch = useAppDispatch()
  // dispatch(setAccount(account))
}

export function closeWalletProvider() {
  clearWalletProvider()
}
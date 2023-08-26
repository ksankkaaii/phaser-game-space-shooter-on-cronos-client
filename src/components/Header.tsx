import { useState } from 'react'
import { Link } from 'react-router-dom';

import { useAppSelector } from 'hooks'

import store from 'stores';
import { setWalletConnecting } from 'stores/WalletStore';

import WalletConnect from './WalletConnect';
import * as walletMetamask from "../web3/WalletMetamask"

import {
  Wrapper,
  ButtonWallet
} from '../styles/Header';

const Header = ({ walletProviderName, wcConnector, wcProvider, account, setWallet, setBg }) => {

  const [openWallet, setOpenWallet] = useState(false);

  const walletConnecting = useAppSelector((state) => state.wallet.walletConnecting);

  const filterAddress = (account: string) => {
    return account.slice(0, 7) + '...' + account.slice(38, 42)
  }

  const connectWallet = async () => {
    if(walletConnecting) {
      return;
    }

    if(window.ethereum && window.innerWidth < 1024) {
      store.dispatch(setWalletConnecting(true));
      const wallet = await walletMetamask.connect()
      localStorage.setItem('wallet-type', 'metamask');

      if (wallet !== null) {
        setWallet(wallet)
        const now = new Date()
        const item = {
          walletConnected: 'true',
          expiry: now.getTime() + (1000 * 3600 * 1)
        }
        localStorage.setItem('wallet-connected', JSON.stringify(item))
      }
      store.dispatch(setWalletConnecting(false));

      return;
    }

    !account && setOpenWallet(true);

    console.log(`account and walletConnecting`, account, walletConnecting);

    if(account && !walletConnecting) {
      disconnectWallet();
      window.location.reload();
    }
  }

  const disconnectWallet = async () => {
    if(walletProviderName == `defiwallet`) {
      wcConnector?.deactivate();
    }

    localStorage.clear();
    
  };

  return (
    <>
      <Wrapper>
        <Link to="/" onClick={() => setBg('bg_main')}>
          <img className='logo' src='assets/images/logo_yellow.png' alt="logo" />
        </Link>

        <ButtonWallet onClick={connectWallet} >
          {account ? filterAddress(account) : (walletConnecting ? 'CONNECTING...' : 'CONNECT YOUR WALLET')}
        </ButtonWallet>
      </Wrapper>

      <WalletConnect
        open={openWallet}
        setOpen={setOpenWallet}
        setWallet={setWallet}
      />
    </>
  )
}

export default Header
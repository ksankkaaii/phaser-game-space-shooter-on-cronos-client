import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import styled from 'styled-components'
import LinearProgress from '@mui/material/LinearProgress'

import { useAppSelector } from './hooks'

import Header from "./components/Header"
import MainUI from "./pages/MainUI"

import { Wrapper, ProgressBarWrapper, Subtitle } from './styles/App';

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

const App = () => {
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  //@ts-ignore
  const [{ walletProviderName, address, browserWeb3Provider, serverWeb3Provider, connected, wcProvider, wcConnector, chainId }, setWallet] = useState({})
  const [bg, setBg] = useState('bg_main')
  const [isGamePlaying, setIsGamePlaying] = useState(false)

  // useEffect(() => {
  //   const allImages = [...CONFIG.IMAGES_ON_LEADER, ...CONFIG.IMAGES_ON_DIFFICULTY, ...CONFIG.IMAGES_ON_SETTING]
  //   allImages.forEach(image => {
  //     const img = new Image();
  //     img.src = image;
  //   });
  // }, []);

  return (
    <>
    <Wrapper bg={bg}>
      <BrowserRouter>
        {!isGamePlaying && <Header
          account={address}
          setWallet={setWallet}
          setBg={setBg}
          walletProviderName={walletProviderName}
          wcConnector={wcConnector}
          wcProvider={wcProvider}
        />}
        <Routes>
          <Route path="/" element={<Navigate to="/shooter" replace />} />
          <Route path="shooter"
            element={<MainUI
              account={address}
              web3Provider={browserWeb3Provider}
              chainId={chainId}
              setBg={setBg}
              setIsGamePlaying={setIsGamePlaying}
            />}
          />
        </Routes>
      </BrowserRouter>
      {!lobbyJoined && (
        <ProgressBarWrapper>
          <Subtitle> Connecting to server...</Subtitle>
          <ProgressBar color='inherit' sx={{ mt: 1 }} />
        </ProgressBarWrapper>
      )}
    </Wrapper>
    </>
  )
}

export default App

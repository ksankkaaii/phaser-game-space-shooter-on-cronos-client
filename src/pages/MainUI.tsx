import { useEffect, useState, lazy  } from "react"

import { useNavigate } from "react-router-dom"
import { ethers } from 'ethers'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import store from "../stores"
import { useAppSelector } from '../hooks'
import { setCanPlayAgain, setGameOver,setJoinLobbyRoom } from "../stores/UserStore"
import api from '../api'

import Wallet from '../components/Wallet'
import GameUI from "../components/GameUI"
import Leaderboard from '../components/Leaderboard'
import Setting from "../components/Setting"
import Difficulty from "../components/Difficulty"
import Confirm from "../components/Confirm"
import Notice from '../components/Notice'

import { craftAbi, shooterAbi, tokenAbi } from '../web3/config/abi'
import { craftContractAddr, shooterContractAddr, tokenContractAddr, configVars } from '../web3/config/env'
import CONFIG from '../types/config/config'
import {
  Wrapper,
  ShooterWrapper,
  MenuWrapper,
  Title,
  Buttons,
  SettingDiv
} from "../styles/Shooter"

import { phaserEvents, Event } from '../events/EventCenter'
import ChooseRoom from '../components/ChooseRoom';
import CreateRoom from "components/CreateRoom";
import MobileVirtualJoystick from "components/MobileVirtualJoystick"
import FireButton from "components/FireButton"
import AtomicButton from "components/AtomicButton";

import PhaserGame from "./../phaser/PhaserGame";

const delayTime = (ms) => new Promise((res) => setTimeout(res, ms));

enum MultiMode {
  Create = `create`,
  Join = `join`,
  Quick = `quick`
}

const MainUI = ({ account, web3Provider, chainId, setBg, setIsGamePlaying }) => {

  const navigate = useNavigate()
  const roomJoined = useAppSelector((state) => (state.room.roomJoined))
  const paid = useAppSelector((state) => (state.user.paid))
  const isGameOver = useAppSelector((state) => (state.user.gameOver))
  const isGameOverScene = useAppSelector((state) => (state.user.isGameOverScene))
  const canPlayAgain = useAppSelector((state) => (state.user.canPlayAgain))
  const joinLobbyRoom=useAppSelector((state) => (state.user.joinLobbyRoom))
  const tokenId = useAppSelector((state) => (state.user.tokenId))
  const hasAtomic = useAppSelector((state) => (state.phaser.hasAtomic))

  const [craftInstance, setCraftInstance] = useState(null)
  const [shooterInstance, setShooterInstance] = useState(null)
  const [tokenInstance, setTokenInstance] = useState(null)
  const [pilotInstance, setPilotInstance] = useState(null)

  const [calculating, setCalculating] = useState(false)
  const [isPlayEndless, setIsPlayEndless] = useState(false)
  const [isMultiplayer, setIsMultiplayer] = useState(false)
  const [isSetting, setIsSetting] = useState(false)
  const [isLeaderboard, setIsLeaderboard] = useState(false)
  const [isDifficulty, setIsDifficulty] = useState(false)
  const isExitGame = useAppSelector((state) => (state.phaser.isExist))

  const [isViewMulti, setIsViewMulti] = useState<boolean>(false);
  const [viewMultiMode, setViewMultiMode] = useState<MultiMode | undefined>(undefined);
  const [showMultiJoin, setShowMultiJoin] = useState<boolean>(false);

  const [scores, setScores] = useState(undefined)
  const [keyboard, setKeboard] = useState({
    forward: "W",
    left: "A",
    right: "D",
    brake: "S",
    fire: "SPACE",
    special: "Q",
    music: "Y",
    sounds: "U",
    exit: "ESC"
  })
  const [difficulty, setDifficulty] = useState('easy')
  const [period, setPeriod] = useState('monthly')
  const [league, setLeague] = useState(0)

  const [noticeMsg, setNoticeMsg] = useState('')
  const [showNotice, setShowNotice] = useState(false)
  const [severity, setSeverity] = useState('')

  useEffect(() => {
    if (account !== undefined && chainId === configVars.mainnet.chainId) {
      const craftContract = new ethers.Contract(craftContractAddr, craftAbi, web3Provider)
      const shooterContract = new ethers.Contract(shooterContractAddr, shooterAbi, web3Provider)
      const tokenContract = new ethers.Contract(tokenContractAddr, tokenAbi, web3Provider)
      // const pilotContract = new ethers.Contract(pilotContractAddr, pilotAbi, web3Provider)
      setCraftInstance(craftContract.connect(web3Provider.getSigner()))
      setShooterInstance(shooterContract.connect(web3Provider.getSigner()))
      setTokenInstance(tokenContract.connect(web3Provider.getSigner()))
      // setPilotInstance(pilotContract.connect(web3Provider.getSigner()))
    }
  }, [account, chainId])

  useEffect(() => {
    const init = async () => {
      setCalculating(true)
      try {
        if(paid) {
          const tx = await shooterInstance["enterGame"]({ from: account, value: '1000000000000000000' });
          const rc = await tx.wait()
          const event = rc.events
        }
        setCalculating(false)
        phaserEvents.emit(Event.PLAY_AGAIN)
      } catch (e) {
        setSeverity('error')
        setNoticeMsg(`You need 1 CRO to play game`)
        setShowNotice(true)
        store.dispatch(setCanPlayAgain(false))
        setCalculating(false)
        return;
      }
    }
    if (canPlayAgain) {
      init()
    }
  }, [canPlayAgain])

  useEffect(() => {
    const initMulti = async () => {
      playMultiplayer();
    }
    if (joinLobbyRoom) {
      initMulti()
    }
  }, [joinLobbyRoom])

  useEffect(() => {
    console.log(`isGameOver`, isGameOver);

    const init = async () => {
      store.dispatch(setGameOver(false))
      const craftStatus = await shooterInstance["getCraftStatus"](tokenId)
      const damagedLevel = craftStatus[2];

      console.log(`damagedLevel`, damagedLevel);
      
      phaserEvents.emit(Event.TOKEN_REWARDED)
      await delayTime(2000);
      if (damagedLevel < 5) phaserEvents.emit(Event.CAN_PLAY)
      else phaserEvents.emit(Event.SHIP_DAMAGED)
    }
    if (isGameOver) {
      init()
    }
  }, [isGameOver])

  useEffect(() => {
    const init = async () => {
      const scoreRes = await api.score.getScores(period, league)
      setScores(scoreRes.data)
    }
    init()
  }, [period, league])


  useEffect(() => {
    const forward = localStorage.getItem('forward')
    const left = localStorage.getItem('left')
    const right = localStorage.getItem('right')
    const brake = localStorage.getItem('brake')
    const fire = localStorage.getItem('fire')
    const special = localStorage.getItem('special')
    const music = localStorage.getItem('music')
    const sounds = localStorage.getItem('sounds')
    const exit = localStorage.getItem('exit')

    if (forward !== null && forward !== 'null' && forward !== undefined && forward !== 'undefined')
      setKeboard({
        forward: forward,
        left: left,
        right: right,
        brake: brake,
        fire: fire,
        special: special,
        music: music,
        sounds: sounds,
        exit: exit
      })

    const difficulty = localStorage.getItem('difficulty')
    if (difficulty !== null && difficulty !== 'null' && difficulty !== undefined && difficulty !== 'undefined')
      setDifficulty(difficulty)
  }, [])

  useEffect(() => {
    localStorage.setItem('forward', keyboard?.forward)
    localStorage.setItem('left', keyboard?.left)
    localStorage.setItem('right', keyboard?.right)
    localStorage.setItem('brake', keyboard?.brake)
    localStorage.setItem('fire', keyboard?.fire)
    localStorage.setItem('special', keyboard?.special)
    localStorage.setItem('music', keyboard?.music)
    localStorage.setItem('sounds', keyboard?.sounds)
    localStorage.setItem('exit', keyboard?.exit)
  }, [keyboard])

  useEffect(() => {
    localStorage.setItem('difficulty', difficulty ? difficulty : undefined)
  }, [difficulty])

  phaserEvents.on(Event.GOTO_MAINMENU, () => {
    setIsGamePlaying(false)
    setBg('bg_shooter')
    navigate('/')
  })

  let ui: JSX.Element

  const playEndless = () => {
    if(CONFIG.USE_WALLET)
    {
      if (account) {
        setIsPlayEndless(true)
        setBg('bg_shooter')
      }
      else {
        setSeverity('error')
        setNoticeMsg('Please connect your wallet first.')
        setShowNotice(true)
      }
    }
    else{
        setIsPlayEndless(true)
        setBg('bg_shooter')
    }
    
  }
  const playMultiplayer = () => {
    if (account) {
      setIsMultiplayer(true)
      setBg('bg_shooter')
      //go to chooseRoom
      store.dispatch(setJoinLobbyRoom(true))
    }
    else {
      setSeverity('error')
      setNoticeMsg('Please connect your wallet first.')
      setShowNotice(true)
    }
  }

  const viewMultiplay = () => {
    if(account) {
      setIsViewMulti(true);
    }
    else {
      setSeverity('error')
      setNoticeMsg('Please connect your wallet first.')
      setShowNotice(true)
    }
  }

  const quickMulti = () => {
    setViewMultiMode(MultiMode.Quick);
    setIsMultiplayer(true);
  }
  const joinMulti = () => {
    setViewMultiMode(MultiMode.Join);
    setShowMultiJoin(true);
  }
  const createMulti = () => {
    setViewMultiMode(MultiMode.Create);
  }

  if (!isPlayEndless && !isViewMulti && !isMultiplayer) {
    ui = <MenuWrapper>
      <Title>
        <img src="assets/images/title.png" alt="title" />
      </Title>
      <Buttons>
        <img className="play" src="assets/images/btn_playendless.png" alt="play endless" onClick={() => playEndless()} />
        {/* <img className="play" src="assets/images/btn_playmultiplayer.png" alt="Multiplayer Mode" onClick={() => viewMultiplay()} />  */}
        <img className="play" src="assets/images/btn_crosmostation.png" alt="enter crosmostation" />
        <img className="setting" src="assets/images/btn_difficulty.png" alt="difficulty" onClick={() => setIsDifficulty(true)} />
        <img className="setting" src="assets/images/btn_highscores.png" alt="high scores" onClick={() => setIsLeaderboard(true)} />
      </Buttons>
      <SettingDiv>
        <img src="assets/images/btn_setting.png" alt="setting" onClick={() => setIsSetting(true)} />
      </SettingDiv>
      <Notice noticeMsg={noticeMsg}
        showNotice={showNotice}
        setShowNotice={setShowNotice}
        severity={severity}
      />
    </MenuWrapper>
  } else if(isViewMulti && !isPlayEndless && (!viewMultiMode || viewMultiMode == MultiMode.Join) && !isMultiplayer) {
    ui = <MenuWrapper>
      <Title>
        <img src="assets/images/title.png" alt="title" />
      </Title>
      <Buttons>
        <img className="playmulti" src="assets/images/join.png" alt="play endless" onClick={() => joinMulti()} />
        <img className="playmulti" src="assets/images/create.png" alt="play endless" onClick={() => createMulti()} />
      </Buttons>
      <SettingDiv>
        <img src="assets/images/btn_setting.png" alt="setting" onClick={() => setIsSetting(true)} />
      </SettingDiv>
      <Notice noticeMsg={noticeMsg}
        showNotice={showNotice}
        setShowNotice={setShowNotice}
        severity={severity}
      />
    </MenuWrapper>    
  } else if(isViewMulti && !isPlayEndless && viewMultiMode == MultiMode.Create && !isMultiplayer) {
    ui = <ShooterWrapper>
          <CreateRoom setIsViewMulti={setIsViewMulti} playMultiplayer={playMultiplayer} PhaserGame={PhaserGame}/>
        </ShooterWrapper>
  } else if (!roomJoined) {
    ui = <ShooterWrapper>
          <Wallet
            craftInstance={craftInstance}
            shooterInstance={shooterInstance}
            tokenInstance={tokenInstance}
            pilotInstance={pilotInstance}
            account={account}
            setBg={setBg}
            setIsGamePlaying={setIsGamePlaying}
            keyboard={keyboard}
            isPlayEndless={isPlayEndless}
            isMultiplayer={isMultiplayer}
            viewMultiMode={viewMultiMode}
            difficulty={difficulty}
            setCalculating={setCalculating}
            PhaserGame={PhaserGame}
          />
        </ShooterWrapper>
  } else ui = <>
                {!isGameOverScene && <GameUI specialKey={keyboard.special}/>}
                {
                  !isGameOverScene && <MobileVirtualJoystick isMultiplayer={isMultiplayer} PhaserGame={PhaserGame}/>
                }
                {
                  !isGameOverScene && <FireButton isMultiplayer={isMultiplayer} PhaserGame={PhaserGame}/>
                }
                {!isGameOverScene&& hasAtomic && <AtomicButton isMultiplayer={isMultiplayer} PhaserGame={PhaserGame}/>}
              </>

  return (<Wrapper isPlayEndless={isPlayEndless} isMultiplayer={ isMultiplayer}>
    {ui}
    {isExitGame && <Confirm />}
    {isSetting && <Setting
      setIsSetting={setIsSetting}
      keyboard={keyboard}
      setKeboard={setKeboard}
    />}
    {isLeaderboard && <Leaderboard
      scores={scores}
      setIsLeaderboard={setIsLeaderboard}
      league={league}
      setLeague={setLeague}
      period={period}
      setPeriod={setPeriod}
    />}
    {(isViewMulti && showMultiJoin) && <ChooseRoom
      setShowMultiJoin={setShowMultiJoin}
      setIsViewMulti={setIsViewMulti}
      playMultiplayer={playMultiplayer}
      PhaserGame={PhaserGame}
    />}
    {isDifficulty && <Difficulty
      setIsDifficulty={setIsDifficulty}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
    />}
    {calculating && <Box sx={{
      position: 'fixed',
      width: '100%',
      background: 'rgba(0, 0, 0, .5)',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      pointerEvents: 'stroke',
      zIndex: 999
    }}>
      <Box sx={{
        position: 'absolute',
        display: 'flex',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white'
      }}>
        <CircularProgress sx={{ color: 'inherit' }} />
      </Box>
    </Box>}
  </Wrapper>
  )
}

export default MainUI

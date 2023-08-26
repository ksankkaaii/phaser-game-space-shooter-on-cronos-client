import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BigNumber } from 'bignumber.js'

import styled from 'styled-components'
import LinearProgress from '@mui/material/LinearProgress'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox';

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/swiper.min.css'
import 'swiper/components/navigation/navigation.min.css'

import store from '../stores'
import { useAppSelector } from '../hooks'
import { setTokenId, setShipName, setTier, setPaid, setTeam, setSpaceShip } from '../stores/UserStore'
import api from '../api'

import { LEAGUE_NAME, LEAGUE_PRICE } from './../types/config/helper'
import Notice from './Notice'
import Config from './../types/config/config'

import {
  Wrapper,
  AvatarWrapper,
  Container,
  Content,
  SwiperWrapper,
  Arrow,
  Title,
  SubTitle,
  Left,
  Right,
  Reward,
  UpdateLevel,
  Join
} from '../styles/Wallet';

import { ProgressBarWrapper } from './../styles/App';

import Boot from '../phaser/scenes/BootScene'
import Multiplayer from 'phaser/scenes/MultiplayerScene';

import { shooterContractAddr} from '../web3/config/env'

SwiperCore.use([Navigation]);

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

enum MultiMode {
  Create = `create`,
  Join = `join`,
  Quick = `quick`
}

const getAttrValue = (attrArr: {trait_type: string, value: string}[], attrName: string) => {
  try {
    const matched = attrArr.find((attr: {trait_type: string, value: string}) => {
      return attr.trait_type === attrName;
    });

    if(matched) {
      return matched.value;
    }
  }
  catch (err) {
    console.log(`Getting token attribute value with attribute name failed: ${err}`);
  }

  return null;
}

const Wallet = (props) => {

  const { craftInstance, shooterInstance, tokenInstance, pilotInstance, account, setBg, setIsGamePlaying, keyboard,  isPlayEndless, isMultiplayer, difficulty, setCalculating, viewMultiMode } = props

  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined);
  const resourcesLoaded = useAppSelector((state) => state.room.resourcesLoaded);
  const playerList = useAppSelector((state) => state.room.playerList);
  const curPlayer = useAppSelector((state) => state.room.curPlayer);
  const curRoom = useAppSelector((state) => state.room.curRoom);
  const navigate = useNavigate()

  const [noticeMsg, setNoticeMsg] = useState('')
  const [showNotice, setShowNotice] = useState(false)
  const [severity, setSeverity] = useState('')
  const [step, setStep] = useState('')
  const [crafts, setCrafts] = useState([])
  const [hasCombat, setHasCombat] = useState(false)
  const [hasTrader, setHasTrader] = useState(false)
  const [rewardBalance, setRewardBalance] = useState(0)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [playerTeam, setPlayerTeam] = useState<number>(0);
  const [bossmode, setBossmode] = useState<boolean>(false);
  const boot = props.PhaserGame.scene.keys.boot as Boot;
  const multi = props.PhaserGame.scene.keys.multiplay as Multiplayer;

  const [axiable, setAxiable] = useState<boolean>(true);
  const [alliedable, setAlliedable] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      await getAvatar();
    }
    (isPlayEndless || isMultiplayer) && init()
  }, [isPlayEndless, isMultiplayer])

  useEffect(() => {
    setAlliedable(false);
    setAxiable(false);
    const me = playerList.find((p: any) => p?.id == curPlayer);
    const oThers = playerList.filter((p: any) => p?.id != curPlayer);
    let allied = oThers.filter((p: any) => p?.val?.team == 1).length;
    let axis = oThers.filter((p: any) => p?.val?.team == 2).length;

    if (curRoom > allied || curRoom == 0) {
      setAlliedable(true);
    }
    else {
      setAlliedable(false);
    }

    if (curRoom > axis || curRoom == 0) {
      setAxiable(true);
    }
    else {
      setAxiable(false);
    }

  }, [playerList, curPlayer, curRoom])

  const getAvatar = async () => {
    setStep('fetching');
    let user_account = account;
    if (!Config.USE_WALLET) {
      user_account = Config.TEST_WALLET;
    }
    try {
      const resReward = await shooterInstance["getRewardBalance"](user_account);
      setRewardBalance(Number(resReward) / Math.pow(10, 6))

      const resToken = await tokenInstance["balanceOf"](user_account);
      setTokenBalance(Number(resToken) / Math.pow(10, 6))
    }
    catch (err) {
      console.log(`shooter err`, err);
      setRewardBalance(0);
      setTokenBalance(0);
    }

    let tokenIDs: any;
    if (process.env.NODE_ENV == "development") {
      tokenIDs = [2162];
    }
    else {
      try {
        tokenIDs = await craftInstance["walletOfOwner"](user_account);
      }
      catch (err) {
        console.log(`craft contract err`, err);
        tokenIDs = [];
      }
    }

    if (Array.isArray(tokenIDs) && tokenIDs.length) {
      const baseURI = "https://ipfs.filebase.io/ipfs/QmVPpQFBgmE4tHYfXVrs6vCDjuHXc1tRXyVxjZ9ZUqLf4s"
      const tokenDatas = await Promise.all(
        tokenIDs.map(id => (axios.get(`${baseURI}/${id}.json`)))
      ).catch(function (err) {
        console.log("Getting Token Meta Datas is failed" + err.message)
        setSeverity('error')
        setNoticeMsg("Getting Token Meta Datas is failed!")
        setShowNotice(true)
        setTimeout(() => navigate('/'), 7000)
      });

      console.log(`tokenDatas`, tokenDatas);

      const craftStatuses = await Promise.all(
        tokenIDs.map(id => shooterInstance["getCraftStatus"](Number(id)))
      ).catch(function (err) {
        console.log("Getting Craft Status is failed: " + err.message)
        setSeverity('error')
        setNoticeMsg("Game Contract is not respond!")
        setShowNotice(true)
        setTimeout(() => navigate('/'), 7000)
      });

      if (Array.isArray(tokenDatas) && tokenDatas.length && Array.isArray(craftStatuses) && craftStatuses.length) {
        const craftDatas = tokenIDs.map((id, idx) => ({
          name: tokenDatas[idx].data.name,
          tokenId: Number(id),
          background: getAttrValue(tokenDatas[idx].data.attributes, `Background`),
          on_background: getAttrValue(tokenDatas[idx].data.attributes, `On Background`),
          weapon: getAttrValue(tokenDatas[idx].data.attributes, `Weapon System`),
          booster: getAttrValue(tokenDatas[idx].data.attributes, `Booster`),
          spaceship: getAttrValue(tokenDatas[idx].data.attributes, `Spaceship`),
          banner: getAttrValue(tokenDatas[idx].data.attributes, `Banner`),
          damaged: getAttrValue(tokenDatas[idx].data.attributes, `Damaged`),
          crosmonaut: getAttrValue(tokenDatas[idx].data.attributes, `Crosmonaut`),
          shield: getAttrValue(tokenDatas[idx].data.attributes, `Force Shield`),
          class: getAttrValue(tokenDatas[idx].data.attributes, `Class`),
          tier: craftStatuses[idx][1],
          damagedLevel: craftStatuses[idx][2]
        }));
        if (craftDatas.length > 0) {
          setCrafts(craftDatas)
          setStep('fetched')
        }
      }

      return;
    }
    setSeverity('error')
    setNoticeMsg("You don't have a NFT. Please purchase one!")
    setShowNotice(true)
    setTimeout(() => navigate('/'), 7000)
  }

  const handleJoin = async () => {
    let user_account = account;
    if (!Config.USE_WALLET) {
      user_account = Config.TEST_WALLET;
    }

    if (isMultiplayer && playerTeam == 0) {
      setSeverity('warning');
      setNoticeMsg('Select your team!');
      setShowNotice(true);
      return;
    }

    setCalculating(true)
    if (isPaid) {
      try {
        const tx = await shooterInstance["enterGame"]({ from: user_account, value: '1000000000000000000' });

        const rc = await tx.wait()
        const event = rc.events
      } catch (e) {
        console.log('error in enterGame', e)
        setSeverity('error')
        setNoticeMsg(`You need 1 CRO to play game`)
        setShowNotice(true)
        setCalculating(false)
        return;
      }
    }

    const res = await api.auth.login(user_account)
    if (res.error) {
      setSeverity('error')
      setNoticeMsg(res.error)
      setShowNotice(true)
      setCalculating(false)
      return;
    }
    localStorage.setItem('jwt', JSON.stringify(res))

    store.dispatch(setTokenId(crafts[avatarIndex].tokenId))
    store.dispatch(setShipName(crafts[avatarIndex].name))
    store.dispatch(setPaid(isPaid))
    store.dispatch(setTeam(playerTeam))
    store.dispatch(setTier(crafts[avatarIndex].tier))
    const shipPros = { ...crafts[avatarIndex], account: user_account, paid: isPaid, team: playerTeam, wasted: 0, hits: 0 }
    store.dispatch(setSpaceShip(shipPros.spaceship))

    const gameProps = {
      hasCombat: hasCombat,
      difficulty: difficulty,
      keyboard: keyboard,
      bossMode: bossmode
    }

    if (shipPros.damagedLevel >= 5) {
      setSeverity('error')
      setNoticeMsg("Your craft is damaged.")
      setShowNotice(true);
    } else {
      if (isMultiplayer && viewMultiMode != MultiMode.Quick) {
        if (lobbyJoined) {
          setIsGamePlaying(true)
          setBg('');
          boot.startMultiGame(shipPros, gameProps)
        } else {
          setSeverity('error')
          setNoticeMsg('Trying to connect to server, please try again!')
          setShowNotice(true)
        }
      }
      else {
        if (lobbyJoined) {
          if(!resourcesLoaded) {
            setSeverity('warning');
            setNoticeMsg('Loading the images and audios for game! Please wait a little bit!');
            setShowNotice(true);
            setCalculating(false)
            return;
          }

          boot._network
            .joinOrCreatePublic()
            .then(() => {
              setIsGamePlaying(true)
              setBg('');
              boot.startGame(shipPros, gameProps)
            })
            .catch((error) => console.error('error in joinOrCreatePublic', error))
        } else {
          setSeverity('error')
          setNoticeMsg('Trying to connect to server, please try again!')
          setShowNotice(true);
        }
      }
    }

    setCalculating(false)
  }

  const updateLevel = async () => {
    setCalculating(true)
    try {
      const allowance = await tokenInstance["allowance"](account, shooterContractAddr)

      if (new BigNumber(allowance.toString()).eq(new BigNumber('0'))) {
        const tx = await tokenInstance["approve"](shooterContractAddr, "99999999999999999999999999999999999999999999999999999999999");
        const rc = await tx.wait()
        const event = rc.events
        const hash = event[0].transactionHash
      }
    } catch (e) {
      console.log('error in approve', e)
      setCalculating(false)
    }

    const tier = crafts[avatarIndex].tier
    if (tier < 5) {
      if (tokenBalance >= (LEAGUE_PRICE[tier + 1] * (hasTrader ? 0.95 : 1))) {
        try {
          const tx = await shooterInstance["upgradeCraft"](crafts[avatarIndex].tokenId)

          const rc = await tx.wait()
          const event = rc.events
          const hash = event[0].transactionHash

          if (hash) {
            const craftsTemp = crafts.map((craft, index) => {
              if (index === avatarIndex) {
                craft.name = LEAGUE_NAME[tier + 1]
                craft.tier = tier + 1
              }
              return craft
            })
            setCrafts([...craftsTemp])
            setTokenBalance(tokenBalance - (LEAGUE_PRICE[tier + 1] * (hasTrader ? 0.95 : 1)))
            setSeverity('success')
            setNoticeMsg(`Crosmocraft has been upgraded.`)
            setShowNotice(true)
          }
        } catch (e) {
          console.log('error in upgradeCraft', e)
          setSeverity("error")
          setNoticeMsg(`Error occurred in upgrading Crosmocraft.`)
          setShowNotice(true)
          setCalculating(false)
        }
      } else {
        setSeverity("error")
        setNoticeMsg(`You need ${(LEAGUE_PRICE[tier + 1] * (hasTrader ? 0.95 : 1))} $CROSMO for ${LEAGUE_NAME[tier + 1]} Level.`)
        setShowNotice(true)
      }
    } else {
      setSeverity('success')
      setNoticeMsg(`Your craft is the top level.`)
      setShowNotice(true)
    }
    setCalculating(false)
  }

  const claimReward = async () => {
    setCalculating(true)
    if (rewardBalance > 0) {
      try {
        const tx = await shooterInstance["claimReward"]()

        const rc = await tx.wait()
        const event = rc.events
        const hash = event[0].transactionHash

        if (hash) {
          setSeverity('success')
          setNoticeMsg(`${rewardBalance.toFixed(1)}$CROSMO has claimed.`)
          setShowNotice(true)
          setTokenBalance(tokenBalance + rewardBalance)
          setRewardBalance(0)
        }
      } catch (e) {
        console.log('error in claimReward', e)
        setSeverity('error')
        setNoticeMsg(`Error occurred in claiming reward.`)
        setShowNotice(true)
        setCalculating(false)
      }
    } else {
      setSeverity('error')
      setNoticeMsg(`You don't have any reward token.`)
      setShowNotice(true)
    }
    setCalculating(false)
  }

  const swiperRef = useRef(null);
  return (
    <>
      <Wrapper>
        <AvatarWrapper fetching={step === 'fetching'}>
          {(step === 'fetching') && <Box sx={{ display: 'block', textAlign: 'center' }}>
            <SubTitle>Fetching NFTs and Loading Resources...</SubTitle>
            <CircularProgress sx={{ mt: 2 }} />
          </Box>}
          {(step === 'fetched') && <Container>
            <Left>
              <Title>
                <img src="assets/images/avatar_title.png" alt="title" />
              </Title>
              <Content>
                <Arrow onClick={() => swiperRef.current.swiper.slidePrev()}>
                  <img src="assets/images/avatar_prev.png" alt="prev" />
                </Arrow>
                <SwiperWrapper>
                  <Swiper
                    //@ts-ignore
                    ref={swiperRef}
                    navigation
                    spaceBetween={0}
                    slidesPerView={1}
                    onSlideChange={(swiper) => {
                      setAvatarIndex(swiper.activeIndex)
                    }}
                  >
                    {crafts.map((avatar) => {
                      return <SwiperSlide key={avatar.tokenId}>
                          <img className='background' src={`assets/images/NFT/8 Background/${avatar.background}.png`} alt={avatar.name} />
                          <img className='on_background' src={`assets/images/NFT/7 On Background/${avatar.on_background}.png`} alt={avatar.name} />
                          <img className='booster' src={`assets/images/NFT/5 Booster/${avatar.booster}.png`} alt={avatar.name} />
                          <img className='weapon' src={`assets/images/NFT/6 Weapon System/${avatar.weapon}.png`} alt={avatar.name} />
                          <img className='ship' src={`assets/images/NFT/4 Spaceship/${avatar.spaceship}.png`} alt={avatar.name} />
                          <img className='banner' src={`assets/images/NFT/3 Banner/${avatar.banner}.png`} alt={avatar.name} />
                          {<img className='broken' src={`assets/images/NFT/3 Damaged/${avatar.damaged}.png`} alt={avatar.name} />}
                          {<img className='crosmonaut' src={`assets/images/NFT/2 Crosmonaut/${avatar.crosmonaut}.png`} alt={avatar.name} />}
                          {<img className='shipshield' src={`assets/images/NFT/1 Force Shield/${avatar.shield}.png`} alt={avatar.name} />}
                          {avatar.tier !== 0 && <p className='tier'>{LEAGUE_NAME[avatar.tier]}</p>}
                          <img className='tier' src={`assets/images/league_${avatar.tier}.png`} alt={avatar.name} />
                          <img className='avatarBg' src={`assets/images/avatar_modal_bg.png`} alt="avatar_bg" />
                          <p className='name'>{avatar.name}</p>
                      </SwiperSlide>
                    })}
                  </Swiper>
                </SwiperWrapper>
                <Arrow onClick={() => swiperRef.current.swiper.slideNext()}>
                  <img src="assets/images/avatar_next.png" alt="next" />
                </Arrow>
              </Content>
            </Left>
            <Right>
              <Reward>
                Claimable $CROSMO: {rewardBalance.toFixed(1)}
              </Reward>
              <UpdateLevel onClick={claimReward}>
                Claim Reward
              </UpdateLevel>
              <Reward>
                $CROSMO Balance: {tokenBalance.toFixed(1)}
              </Reward>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPlayerTeam(Number((event.target as HTMLInputElement).value) || null)
                }}
                sx={{
                  '& *': { color: `white`, borderColor: `white` }
                }}
              >
                {isMultiplayer &&
                  <FormControlLabel
                    value="1"
                    control={
                      <Radio />
                    }
                    disabled={!alliedable}
                    label="Allied"
                    sx={{
                      '& .Mui-disabled': {
                        color: `rgba(255,255,255, 0.5) !important`
                      }
                    }}
                  />
                }
                {
                  isMultiplayer &&
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    disabled={!axiable}
                    label="Axis"
                    sx={{
                      '& .Mui-disabled': {
                        color: `rgba(255,255,255, 0.5) !important`
                      }
                    }}
                  />
                }

              </RadioGroup>
              <UpdateLevel onClick={updateLevel}>
                {crafts !== undefined && (crafts[avatarIndex]?.tier !== 5 && <>
                  <img src="assets/images/upgrade.png" width={30} height={30} /> to {LEAGUE_NAME[crafts[avatarIndex]?.tier + 1]} : {LEAGUE_PRICE[crafts[avatarIndex]?.tier + 1] * (hasTrader ? 0.95 : 1)}
                </>)}
              </UpdateLevel>
              {
                !isMultiplayer && (
                  <Reward>
                    <span>Pay To Play?</span> <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28 }, '& *': { color: `white`, borderColor: `white` } }} checked={isPaid} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setIsPaid(event.target.checked);
                    }} />
                  </Reward>
                )
              }
              {
                !isMultiplayer && (
                  <Reward>
                    <span>Boss Mode?</span>
                    <Checkbox
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 28 },
                        '& *': { color: `white`, borderColor: `white` }
                      }}
                      checked={bossmode}
                      onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) => {
                          setBossmode(event.target.checked);
                        }
                      }
                    />
                  </Reward>
                )
              }
              <Join 
                dataLoading={!resourcesLoaded}
                onClick={
                  () => {
                    if(!resourcesLoaded) {
                      return;
                    }
                    handleJoin();
                  }
                }
              >
                PLAY
              </Join>
            </Right>
          </Container>}
        </AvatarWrapper>
      </Wrapper>
      <Notice noticeMsg={noticeMsg}
        showNotice={showNotice}
        setShowNotice={setShowNotice}
        severity={severity}
      />
      {!resourcesLoaded && step === 'fetched' && (
        <ProgressBarWrapper>
          <SubTitle> Loading Game Resources...</SubTitle>
          <ProgressBar color='inherit' sx={{ mt: 1 }} />
        </ProgressBarWrapper>
      )}
    </>
  )
}

export default Wallet
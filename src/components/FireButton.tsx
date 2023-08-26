import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Multiplayer from 'phaser/scenes/MultiplayerScene';
import Play from 'phaser/scenes/PlayScene';

const FireButtonWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  right: 20px;

  @media only screen and (max-width: 1024px) and (orientation:portrait) {
    bottom: 36px;
    left: 24px;
  }
`

const FireButtonObj = styled.img`
  border-radius: 50%;
  width: 46px;
  height: 46px;
`

export const minimumScreenWidthSize = 1024 //px

const useSmallScreen = (smallScreenSize: number) => {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width <= smallScreenSize
}

export default function FireButton({isMultiplayer, PhaserGame}) {
  const hasSmallScreen = useSmallScreen(minimumScreenWidthSize)
  const multiGame = PhaserGame.scene.keys.multiplay as Multiplayer;
  const singleGame = PhaserGame.scene.keys.play as Play;

  let pressTimer;

  const handleFire = () => {
    if (isMultiplayer) multiGame._myShip?._gunModule.setTriggerHeld(true)
    else singleGame._myShip?._gunModule.setTriggerHeld(true)
    pressTimer = setInterval(() => {
      if (isMultiplayer) multiGame._myShip?._gunModule.setTriggerHeld(true)
      else singleGame._myShip?._gunModule.setTriggerHeld(true)
    }, 50);
  }

  const endFire = () => {
    if (isMultiplayer) multiGame._myShip?._gunModule.setTriggerHeld(false)
    else singleGame._myShip?._gunModule.setTriggerHeld(false)
    clearInterval(pressTimer);
    if (isMultiplayer) multiGame._myShip?._gunModule.setTriggerHeld(false)
    else singleGame._myShip?._gunModule.setTriggerHeld(false)
  }

  return (
    <>
    {hasSmallScreen && (
      <FireButtonWrapper
        onTouchStart={() => handleFire()}
        onTouchEnd={() => endFire()}
      >
        <FireButtonObj src="assets/images/icon_DOUBLE_BULLET.png" alt="Fire Button">
        </FireButtonObj>
      </FireButtonWrapper>
    )}
    </>


  )
}

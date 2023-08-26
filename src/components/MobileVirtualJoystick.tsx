import { useEffect, useState } from 'react'
import styled from 'styled-components'
import JoystickItem from './Joystick'

import Multiplayer from 'phaser/scenes/MultiplayerScene';
import Play from 'phaser/scenes/PlayScene';

import { JoystickMovement } from './Joystick'

const Backdrop = styled.div`
  position: fixed;
  bottom: 32px;
  left: 16px;
  max-width: 100%;

  @media only screen and (max-width: 1024px) and (orientation:portrait) {
    top: 32px;
  }
`

const Wrapper = styled.div`
  position: relative;
  padding: 0;
  display: flex;
  flex-direction: column;
`

const JoystickWrapper = styled.div`
  margin-top: auto;
  align-self: flex-end;
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

export default function MobileVirtualJoystick({isMultiplayer, PhaserGame}) {
  const hasSmallScreen = useSmallScreen(minimumScreenWidthSize)
  const multiGame = PhaserGame.scene.keys.multiplay as Multiplayer;
  const singleGame = PhaserGame.scene.keys.play as Play;

  const handleMovement = (movement: JoystickMovement) => {
    if (isMultiplayer) multiGame._myShip?.handleJoystickMovement(movement)
    else singleGame._myShip?.handleJoystickMovement(movement)
  }

  return (
    <Backdrop>
      <Wrapper>
        {hasSmallScreen && (
          <JoystickWrapper>
            <JoystickItem onDirectionChange={handleMovement}></JoystickItem>
          </JoystickWrapper>
        )}
      </Wrapper>
    </Backdrop>
  )
}

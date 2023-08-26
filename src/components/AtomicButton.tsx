import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Multiplayer from 'phaser/scenes/MultiplayerScene';
import Play from 'phaser/scenes/PlayScene';

import store from 'stores';
import {setHasAtomic} from 'stores/PhaserStore';

const FireButtonWrapper = styled.div`
  position: fixed;
  right: 96px;
  bottom: 40px;
`

const FireButtonObj = styled.img`;
  width: 46px;
  height: 46px;
  border-radius: 50%;
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

export default function AtomicButton({isMultiplayer, PhaserGame}) {
  const hasSmallScreen = useSmallScreen(minimumScreenWidthSize)
  const multiGame = PhaserGame.scene.keys.multiplay as Multiplayer;
  const singleGame = PhaserGame.scene.keys.play as Play;

  const handleExplode = () => {
    if (isMultiplayer) {
      if(multiGame._myShip._hasAtomic) {
				multiGame._network.specialKeyIsDown(true);
				multiGame._myShip._hasAtomic = false;
        store.dispatch(setHasAtomic(false));
      }
    }
    else {
      if(singleGame._myShip._hasAtomic) {
        singleGame.spawnRegionBullet(singleGame._center.x, singleGame._center.y, singleGame, 'atomic')
        singleGame._myShip._hasAtomic = false;
        store.dispatch(setHasAtomic(false));
      }
    }
  }

  return (
    <>
    {hasSmallScreen && (
      <FireButtonWrapper 
        onTouchStart={() => handleExplode()}
        onTouchEnd={() => handleExplode()}
      >
        <FireButtonObj src="assets/images/icon_ATOMIC_BULLET.png" alt="Fire Button">
        </FireButtonObj>
      </FireButtonWrapper>
    )}
    </>


  )
}

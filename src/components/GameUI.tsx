import { useState, useEffect } from 'react'

import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { withStyles } from '@mui/styles';

import { useAppSelector } from '../hooks'

const BulletLinearProgress = withStyles(() => {
  return {
    root: {
      borderRadius: 5,
      height: 10,
      width: "100%",
      border: '2px solid #ffe2b8'
    },
    colorPrimary: {
      backgroundColor: '#39260b'
    },
    bar: {
      borderRadius: 5,
      backgroundColor: "#fff"
    }
  };
})(LinearProgress);

const ShieldLinearProgress = withStyles(() => {
  return {
    root: {
      borderRadius: 5,
      width: '100%',
      height: 10,
      border: '2px solid #2099e5'
    },
    colorPrimary: {
      backgroundColor: '#0b1939'
    },
    bar: {
      borderRadius: 5,
      backgroundColor: "#235aa5"
    }
  };
})(LinearProgress);

const GameUI = ({ specialKey }) => {

  const [bulletPercent, setBulletPercent] = useState(0)
  const [shieldPercent, setShieldPercent] = useState(0)
  const bulletName = useAppSelector((state) => state.phaser.bulletName)
  const bulletDuration = useAppSelector((state) => state.phaser.bulletDuration)
  const bulletChanged = useAppSelector((state) => state.phaser.bulletChanged)
  const shieldName = useAppSelector((state) => state.phaser.shieldName)
  const shieldDuration = useAppSelector((state) => state.phaser.shieldDuration)
  const shieldChanged = useAppSelector((state) => state.phaser.shieldChanged)
  const hasAtomic = useAppSelector((state) => (state.phaser.hasAtomic))

  const playerList = useAppSelector((state) => state.room.playerList);

  let bulletCount = bulletDuration - 0.15
  let shieldCount = shieldDuration - 0.15

  useEffect(() => {
    const timer = setInterval(() => {
      const bulletPercentVal = bulletCount / bulletDuration * 100
      setBulletPercent(bulletPercentVal);
      if (bulletCount <= 0) {
        setBulletPercent(0)
        clearInterval(timer)
      }
      bulletCount -= 0.25
    }, 250)
    return () => {
      clearInterval(timer);
    }
  }, [bulletName, bulletDuration, bulletChanged])

  useEffect(() => {
    const timer = setInterval(() => {
      const shieldPercent = shieldCount / shieldDuration * 100
      setShieldPercent(shieldPercent)
      if (shieldCount <= 0) {
        setShieldPercent(0)
        clearInterval(timer)
      }
      shieldCount -= 0.25
    }, 250)
    return () => {
      clearInterval(timer);
    }
  }, [shieldName, shieldDuration, shieldChanged])

  return (
    <>
      <Box className={`shield`} sx={{
        display: 'flex',
        position: `fixed`,
        justifyContent: 'flex-end',
        right: {
          xs: `-100px`,
          sm: `-100px`,
          md: `-220px`,
          lg: `-260px`,
          xl: `-340px`
        }
      }}>
        {shieldPercent != 0 && <Box sx={{
          textAlign: 'center'
        }}>
          <Box className={`shield-bar`} sx={{
            width: {
              xs: `320px`,
              sm: `460px`,
              md: `500px`,
              lg: `580px`,
              xl: `760px`
            },
            transform: 'rotate(-90deg)',
          }}
          >
            <ShieldLinearProgress variant="determinate" value={shieldPercent} />
          </Box>
          {/* <Typography sx={{
            fontSize: '18px',
            color: '#24c2bc',
            paddingTop: {
              xs: `128px`,
              sm: `128px`,
              md: `250px`,
              lg: `290px`,
              xl: `380px`
            }
          }}>
            SHIELD
          </Typography> */}
        </Box>}
      </Box>

      <Box className={`bullet`} sx={{
        display: 'flex',
        position: `fixed`,
        justifyContent: 'flex-end',
        right: {
          xs: shieldPercent == 0 ? `-100px` : `-60px`,
          sm: shieldPercent == 0 ? `-100px` : `-60px`,
          md: shieldPercent == 0 ? `-220px` : `-200px`,
          lg: shieldPercent == 0 ? `-260px` : `-230px`,
          xl: shieldPercent == 0 ? `-340px` : `-320px`
        }
      }}>
        {bulletPercent != 0 && <Box sx={{
          textAlign: 'center'
        }}>
          <Box className={`bullet-bar`} sx={{
            width: {
              xs: `320px`,
              sm: `460px`,
              md: `500px`,
              lg: `580px`,
              xl: `760px`
            },
            transform: 'rotate(-90deg)',
          }}>
            <BulletLinearProgress variant="determinate" value={bulletPercent} />
          </Box>
          {/* <Box 
            sx={{
              paddingTop: {
                xs: `128px`,
                sm: `128px`,
                md: `250px`,
                lg: `290px`,
                xl: `380px`
              }
            }}
          >
            <img src={`assets/images/icon_ATOMIC_BULLET.png`} alt="airdrop icon" />
          </Box> */}
        </Box>}
      </Box>

      {hasAtomic && <Typography className='has-atomic' sx={{
          color: 'white',
          position: 'absolute',
          bottom: {
            sm: `16px`
          },
          right: {
            sm: `20px`
          },
          fontSize: {
            xs: `16px`,
            sm: `20px`
          },
        }}
        >
        Press "{specialKey}" to use atomic bomb
        </Typography>
      }
    </>
  )
}

export default GameUI
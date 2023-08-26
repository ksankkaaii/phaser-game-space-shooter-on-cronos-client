import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { sanitizeId } from './../types/config/helper'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    sessionId: '',
    videoConnected: false,
    loggedIn: false,
    gameOver: false,
    canPlayAgain: false,
    joinLobbyRoom:false,
    tokenId: -1,
    shipName: '',
    tier: 0,
    paid: false,
    team: 0,
    spaceship: 'Black Spaceship type 3',
    wasted: 0,
    hits: 0,
    playerNameMap: new Map(),
    showJoystick: true, //window.innerWidth < 650
    isGameOverScene: false
  },
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload
    },
    setVideoConnected: (state, action: PayloadAction<boolean>) => {
      state.videoConnected = action.payload
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload
    },
    setGameOver: (state, action: PayloadAction<boolean>) => {
      state.gameOver = action.payload
    },
    setCanPlayAgain: (state, action: PayloadAction<boolean>) => {
      state.canPlayAgain = action.payload
    },
    setJoinLobbyRoom: (state, action: PayloadAction<boolean>) => {
      state.joinLobbyRoom = action.payload
    },
    setTokenId: (state, action: PayloadAction<number>) => {
      state.tokenId = action.payload
    },
    setShipName: (state, action: PayloadAction<string>) => {
      state.shipName = action.payload
    },
    setTier: (state, action: PayloadAction<number>) => {
      state.tier = action.payload
    },
    setPaid: (state, action: PayloadAction<boolean>) => {
      state.paid = action.payload
    },
    setTeam: (state, action: PayloadAction<number>) => {
      state.team = action.payload
    },
    setSpaceShip: (state, action: PayloadAction<string>) => {
      state.spaceship = action.payload
    },
    setWasted: (state, action: PayloadAction<number>) => {
      state.wasted = action.payload
    },
    setHits: (state, action: PayloadAction<number>) => {
      state.hits = action.payload
    },
    setPlayerNameMap: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.playerNameMap.set(sanitizeId(action.payload.id), action.payload.name)
    },
    removePlayerNameMap: (state, action: PayloadAction<string>) => {
      state.playerNameMap.delete(sanitizeId(action.payload))
    },
    setShowJoystick: (state, action: PayloadAction<boolean>) => {
      state.showJoystick = action.payload
    },
    setIsGameOVerScene: (state, action: PayloadAction<boolean>) => {
      state.isGameOverScene = action.payload
    }
  },
})

export const {
  setSessionId,
  setVideoConnected,
  setLoggedIn,
  setGameOver,
  setCanPlayAgain,
  setJoinLobbyRoom,
  setTokenId,
  setShipName,
  setPaid,
  setTeam,
  setWasted,
  setHits,
  setTier,
  setPlayerNameMap,
  removePlayerNameMap,
  setShowJoystick,
  setSpaceShip,
  setIsGameOVerScene
} = userSlice.actions

export default userSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const phaserSlice = createSlice({
  name: 'phaser',
  initialState: {
    bulletName: '',
    bulletDuration: 0,
    shieldName: '',
    shieldDuration: 0,
    bulletChanged: false,
    shieldChanged: false,
    hasAtomic: false,
    isExist: false,
  },
  reducers: {
    setBulletName: (state, action: PayloadAction<string>) => {
      state.bulletName = action.payload
      state.bulletChanged = !state.bulletChanged
    },
    setBulletDuration: (state, action: PayloadAction<number>) => {
      state.bulletDuration = action.payload
    },
    setShieldName: (state, action: PayloadAction<string>) => {
      state.shieldName = action.payload
      state.shieldChanged = !state.shieldChanged
    },
    setShieldDuration: (state, action: PayloadAction<number>) => {
      state.shieldDuration = action.payload
    },
    setHasAtomic: (state, action: PayloadAction<boolean>) => {
      state.hasAtomic = action.payload
    },
    setIsExist: (state, action: PayloadAction<boolean>) => {
      state.isExist = action.payload
    }
  },
})

export const {
  setBulletName,
  setBulletDuration,
  setShieldName,
  setShieldDuration,
  setHasAtomic,
  setIsExist,
} = phaserSlice.actions

export default phaserSlice.reducer
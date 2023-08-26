import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RoomAvailable } from 'colyseus.js'
import { RoomType } from './../types/Rooms';

interface RoomInterface extends RoomAvailable {
  name?: string
}

/**
 * Colyseus' real time room list always includes the lobby room so we have to remove it manually.
 */
const isCustomRoom = (room: RoomInterface) => {
  return room.name === RoomType.CUSTOM
}

export const roomSlice = createSlice({
  name: 'room',
  initialState: {
    lobbyJoined: false,
    roomJoined: false,
    resourcesLoaded: false,
    roomId: '',
    roomData: undefined,
    // roomName: '',
    // roomDescription: '',
    availableRooms: new Array<RoomAvailable>(),
    playerList: new Array(),
    curPlayer: ``,
    curRoom: 0
  },
  reducers: {
    setLobbyJoined: (state, action: PayloadAction<boolean>) => {
      state.lobbyJoined = action.payload
    },
    setRoomJoined: (state, action: PayloadAction<boolean>) => {
      state.roomJoined = action.payload
    },
    setResourcesLoaded: (state, action: PayloadAction<boolean>) => {
      state.resourcesLoaded = action.payload
    },
    setCurRoom: (state, action: PayloadAction<number>) => {
      state.curRoom = action.payload
    },
    setCurPlayer: (state, action: PayloadAction<string>) => {
      state.curPlayer = action.payload
    },
    setJoinedRoomData: (
      state,
      action: PayloadAction<{ id: string;  }>
    ) => {
      state.roomId = action.payload.id
      state.roomData = action.payload
      // state.roomName = action.payload.name
      // state.roomDescription = action.payload.description
    },
    setPlayerList: (state, action: PayloadAction<any[]>) => {
      state.playerList = action.payload.filter((room) => true)
    },
    setAvailableRooms: (state, action: PayloadAction<RoomAvailable[]>) => {
      state.availableRooms = action.payload.filter((room) => isCustomRoom(room))
    },
    addAvailableRooms: (state, action: PayloadAction<{ roomId: string; room: RoomAvailable }>) => {
      if (!isCustomRoom(action.payload.room)) return
      const roomIndex = state.availableRooms.findIndex(
        (room) => room.roomId === action.payload.roomId
      )
      if (roomIndex !== -1) {
        state.availableRooms[roomIndex] = action.payload.room
      } else {
        state.availableRooms.push(action.payload.room)
      }
    },
    removeAvailableRooms: (state, action: PayloadAction<string>) => {
      state.availableRooms = state.availableRooms.filter((room) => room.roomId !== action.payload)
    },
  },
})

export const {
  setLobbyJoined,
  setRoomJoined,
  setResourcesLoaded,
  setJoinedRoomData,
  setAvailableRooms,
  addAvailableRooms,
  removeAvailableRooms,
  setPlayerList,
  setCurPlayer,
  setCurRoom
} = roomSlice.actions

export default roomSlice.reducer

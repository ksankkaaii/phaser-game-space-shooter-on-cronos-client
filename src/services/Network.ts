import { Client, Room } from 'colyseus.js'

import { IRoomData, RoomType } from './../types/Rooms'
import  {Message} from './../types/Messages';
import { phaserEvents, Event } from '../events/EventCenter'
import store from '../stores'
import { setSessionId, setPlayerNameMap, removePlayerNameMap } from '../stores/UserStore'
import {
  setLobbyJoined,
  setJoinedRoomData,
  setAvailableRooms,
  addAvailableRooms,
  removeAvailableRooms,
  setPlayerList,
  setCurPlayer
} from '../stores/RoomStore'
import api from './../api';

import Asteroid from '../phaser/sprites/Asteroid'
import { setIsExist } from 'stores/PhaserStore';

export default class Network {

  private _client: Client
  private _room?: Room<any>
  private _lobby!: Room

  _asteroidsMap = new Map<string, Asteroid>()

  _mySessionId!: string
  _dtServer2Client:number
  constructor() {
    //const endpoint = `wss://crosmoshooter-backend-multi.onrender.com`
    //const protocol = window.location.protocol.replace('http', 'ws')
    //const endpoint =  `${protocol}//${window.location.hostname}:2083`
    // const endpoint='ws://3.224.34.61:2083'
    const endpoint = process.env.REACT_APP_SERVER_ENDPOINT;
    
    console.log("connect to ", endpoint, " at : ", new Date().getTime());
    this._client = new Client(endpoint)
    
    this.joinLobbyRoom().then(() => {
      console.log("success connect  at : ", new Date().getTime());
      store.dispatch(setLobbyJoined(true))
    })

    phaserEvents.on(Event.MY_PLAYER_NAME_CHANGE, this.updatePlayerName, this)
    phaserEvents.on(Event.MY_PLAYER_TEXTURE_CHANGE, this.updatePlayer, this)
  }

  /**
   * method to join Colyseus' built-in LobbyRoom, which automatically notifies
   * connected _clients whenever rooms with "realtime listing" have updates
   */
  async joinLobbyRoom() {
    this._lobby = await this._client.joinOrCreate(RoomType.LOBBY)
    this._lobby.onMessage('rooms', (rooms) => {
      store.dispatch(setAvailableRooms(rooms));
    })

    this._lobby.onMessage('+', ([roomId, room]) => {
      store.dispatch(addAvailableRooms({ roomId, room }))
    })

    this._lobby.onMessage('-', (roomId) => {
      store.dispatch(removeAvailableRooms(roomId))
    })
  }

  getRoomData () {
    return {a: this._lobby, b: this._room};
  }

  // method to join the public _lobby
  async joinOrCreatePublic() {
    this._room = await this._client.joinOrCreate(RoomType.PUBLIC)
    this.initialize()
  }

  // method to create a custom room
  async createCustom(roomData: IRoomData) {
    const { name, password, autoDispose, roomMode, mapMode, cost } = roomData
    this._room = await this._client.create(RoomType.CUSTOM, {
      name,
      password,
      autoDispose,
      roomMode,
      mapMode,
      cost
    })
    //console.log("roomMode", roomMode);
    // this._room.maxClients = 2;
    // if (roomMode === "2X2")
    //   this._room.maxClients = 4;
    // else if (roomMode === "3X3")
    //   this._room.maxClients = 6;
    this.initialize()
  }

  // method to join a custom room
  async joinCustomById(roomId: string, password: string | null) {
    this._room = await this._client.joinById(roomId, { password })
    this.initialize();
  }

  
  // set up all network listeners before the game starts
  initialize() {
    if (!this._room) return

    this._lobby.leave()
    this._mySessionId = this._room.sessionId
    store.dispatch(setSessionId(this._room.sessionId))
    
    // when the server sends room data
    this._room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedRoomData(content));
      //getting dt from server
      // this.setDtServer2Client(content.serverTime)
    })

    this._room.onMessage(Message.SEND_OTHER_DATA, (content) => {
      phaserEvents.emit(Event.PLAYER_JOINED, content.player, content.id)
    })
    this._room.onMessage(Message.SEND_GAME_TIMEOUT, (content) => {
      //phaserEvents.emit(Event.EXIST_GAME,content.IsMulti);
      phaserEvents.emit(Event.GAME_TIMEOUT,content.IsMulti);
      store.dispatch(setIsExist(false))
      //this._room.leave();
    })
    
    this._room.onMessage(Message.GET_PLAYERS, (content) => {
      store.dispatch(setPlayerList(Object.entries(content?.players).map(([key, val]) => ({id: key, val}))));
    })
    // new instance added to the players MapSchema
    if (this._room.state.players)
    this._room.state.players.onAdd = (player: any, key: string) => {
      if (key === this._mySessionId) return
      store.dispatch(setCurPlayer(this._mySessionId));
      // track changes on every child object inside the players MapSchema
      player.onChange = (changes) => {
        phaserEvents.emit(Event.PLAYER_UPDATED, changes, key)

        changes.forEach((change) => {
          const { field, value } = change
           if (key === this._mySessionId) {
          //   phaserEvents.emit(Event.MY_PLAYER_UPDATED, field, value, key)
           }
           else{
             phaserEvents.emit(Event.PLAYER_UPDATED, field, value, key)
            // when a new player finished setting up player name
            if (field === 'account' && value !== '') {
              phaserEvents.emit(Event.PLAYER_JOINED, player, key)
              store.dispatch(setPlayerNameMap({ id: key, name: value }))
            }
           }
        })
      }
    }

    // an instance removed from the players MapSchema
    this._room.state.players.onRemove = (player: any, key: string) => {
      phaserEvents.emit(Event.PLAYER_LEFT, key)
      store.dispatch(removePlayerNameMap(key))
    }

    // new instance added to the bullets MapSchema
    this._room.state.bullets.onAdd = (bullet: any, key: string) => {
      phaserEvents.emit(Event.BULLET_CREATED, bullet, key);
      // track changes on every child object inside the bullets MapSchema
      /*bullet.onChange = (changes) => {  
        phaserEvents.emit(Event.BULLET_UPDATED, changes, key)

        // changes.forEach((change) => {
        //   const { field, value } = change
        //   phaserEvents.emit(Event.BULLET_UPDATED, field, value, key)
        // })
      }*/
    }
    this._room.state.bullets.onRemove = (bullet: any, key: string) => {
      phaserEvents.emit(Event.BULLET_REMOVED, key)
    }
    //asteroid data
    this._room.state.asteroids.onAdd = (asteroid: any, key: string) => {
      this._asteroidsMap.set(key, asteroid)
      phaserEvents.emit(Event.ASTEROID_CREATED, asteroid, key);
      // track changes on every child object inside the player MapSchema
      asteroid.onChange = (changes) => {
          phaserEvents.emit(Event.ASTEROID_CHANGES_UPDATED, changes, key)
        changes.forEach((change) => {
          const { field, value } = change
           //phaserEvents.emit(Event.ASTEROID_UPDATED, field, value, key)
          if (field === 'curServerTime') {
            this.setDtServer2Client(value)
            }
          
        })
      }
    }
    this._room.state.asteroids.onRemove = (asteroid: any, key: string) => {
      phaserEvents.emit(Event.ASTEROID_REMOVED, key)
    }   
    this._room.state.airdrops.onAdd = (airdrop: any, key: string) => {
      phaserEvents.emit(Event.AIRDROP_CREATED, airdrop, key);
      // track changes on every child object inside the player MapSchema
      airdrop.onChange = (changes) => {

        changes.forEach((change) => {
          const { field, value } = change
          phaserEvents.emit(Event.AIRDROP_UPDATED, field, value, key)
        })
      }
    }
    this._room.state.airdrops.onRemove = (airdrop: any, key: string) => {
      phaserEvents.emit(Event.AIRDROP_REMOVED, key)
    }   
   
    this._room.onMessage(Message.COLLIDE_PLAYER_ASTEROID, (content:any) => {
      phaserEvents.emit(Event.COLLISION_PLAYER_ASTEROID,content)
    })
    this._room.onMessage(Message.COLLIDE_PLAYER_BULLET, (content:any) => {
      phaserEvents.emit(Event.COLLISION_PLAYER_BULLET,content)
    })
    this._room.onMessage(Message.COLLIDE_BULLET_ASTEROID, (content:any) => {
      phaserEvents.emit(Event.COLLISION_BULLET_ASTEROID,content)
    })
    this._room.onMessage(Message.COLLIDE_PLAYER_AIRDROP, (content:any) => {
      phaserEvents.emit(Event.COLLISION_PLAYER_AIRDROP,content)
    })
  }

  // method to register event listener and call back function when a player joined
  onPlayerJoined(callback: (Player: any, key: string) => void, context?: any) {
    phaserEvents.on(Event.PLAYER_JOINED, callback, context)
  }
  // method to register event listener and call back function when a player left
  onPlayerLeft(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.PLAYER_LEFT, callback, context)
  }

  // method to register event listener and call back function when myPlayer is ready to connect
  onMyPlayerReady(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.MY_PLAYER_READY, callback, context)
  }

  // method to register event listener and call back function when a player updated
  onPlayerUpdated( callback: (changes:any, key: string) => void,context?: any) {
    phaserEvents.on(Event.PLAYER_UPDATED, callback, context)
  }
  // onMyPlayerUpdated( callback: (field: string, value: number | string) => void,context?: any) {
  //   phaserEvents.on(Event.MY_PLAYER_UPDATED, callback, context)
  // }
  //bullet part
  onBulletCreated(callback: (bullet: any, id: string, key: string) => void, context?: any) {
    phaserEvents.on(Event.BULLET_CREATED, callback, context)
  }
  onBulletUpdated(callback: (changes:any, key: string) => void, context?: any) {
    phaserEvents.on(Event.BULLET_UPDATED, callback, context)
  }
  onBulletRemoved(callback: (id: string, key: string) => void, context?: any) {
    phaserEvents.on(Event.BULLET_REMOVED, callback, context)
  }
   //asteroid part
  onAsteroidCreated(callback: (asteroid: any, id: string, key: string) => void, context?: any) {
    phaserEvents.on(Event.ASTEROID_CREATED, callback, context)
  }
  onAsteroidUpdated(callback: (field: string, value: number | string, key: string) => void, context?: any) {
    phaserEvents.on(Event.ASTEROID_UPDATED, callback, context) 
  }
  onAsteroidRemoved(callback: (id: string, key: string) => void, context?: any) {
    phaserEvents.on(Event.ASTEROID_REMOVED, callback, context)
  }
  onAsteroidChangesUpdated(callback: (changes:any, key: string,) => void, context?: any) {
    phaserEvents.on(Event.ASTEROID_CHANGES_UPDATED, callback, context) 
  }
  //airdrop part
  onAirdropCreated(callback: (airdrop: any, id: string, key: string) => void, context?: any) {
    phaserEvents.on(Event.AIRDROP_CREATED, callback, context)
  }
  onAirdropUpdated(callback: (field: string, value: number | string, key: string) => void, context?: any) {
    phaserEvents.on(Event.AIRDROP_UPDATED, callback, context) 
  }
  onAirdropRemoved(callback: (id: string, key: string) => void, context?: any) {
    phaserEvents.on(Event.AIRDROP_REMOVED, callback, context)
  }

  //collision part server to client
  onCollisionPlayerWithBullet(callback: (content: any) => void, context?: any) {
    phaserEvents.on(Event.COLLISION_PLAYER_BULLET, callback, context)
  }
  onCollisionPlayerWithAsteroid(callback: (content: any) => void, context?: any) {
    phaserEvents.on(Event.COLLISION_PLAYER_ASTEROID, callback, context)
  }
  onCollisionBulletAsteroid(callback: (content: any) => void, context?: any) {
    phaserEvents.on(Event.COLLISION_BULLET_ASTEROID, callback, context)
  }
  onCollisionPlayerAirdrop(callback: (content: any) => void, context?: any) {
    phaserEvents.on(Event.COLLISION_PLAYER_AIRDROP, callback, context)
  }

  // method to send player updates to Colyseus server
  updatePlayer(
    currentX: number,
    currentY: number,
    rotation: number,
    speed_x: number,
    speed_y: number,
    angularVel:number,
    isForwarding: boolean,
    // isRightRotation: boolean,
    // isLeftRotation: boolean,
    // isBraking:boolean,
    hasShield: boolean,
    isFire: boolean,
    score: number,
    isExplode: boolean,
    lives:  number,

    account: string,
    shipName: string,
    tokenId: number,
    tier: number,
    paid: boolean,
    team: number,
    wasted: number,
    hits: number,
    spaceship:string
  ) {
    let clientTimeNow = this.clientTime();
    this._room?.send(Message.UPDATE_PLAYER,
      {
        x: currentX,
        y: currentY,
        rotation: rotation,
        speed_x: speed_x,
        speed_y: speed_y,
        angularVel:angularVel,
        isForwarding: isForwarding,
        // isRightRotation: isRightRotation,
        // isLeftRotation: isLeftRotation,
        // isBraking:isBraking,
        hasShield: hasShield,
        isFire: isFire,
        score: score,
        isExplode: isExplode,
        lives: lives,
        clientTime:clientTimeNow,

        account,
        shipName,
        tokenId,
        tier,
        paid,
        team,
        wasted,
        hits,
        spaceship
      })
  }
  updateBulletToServer(
    x: number,
    y: number,
    rotation: number,
    speed_x:number,
    speed_y:number,
   bulletType:string,
   teamflag:number
  ) {
    this._room?.send(Message.UPDATE_BULLET,
      {
        x: x,
        y: y,        
        rotation: rotation,
        speed_x:speed_x,
        speed_y: speed_y,
        bulletType:bulletType,
        teamflag:teamflag        
      })
  }

  createAirdropToServer(
    x: number,
    y: number,
    owner: any,
    kind: any
  ) {
    this._room?.send(Message.CS_ASTEROID_CREATE,
      {
        x: x,
        y: y,
        owner: owner,
        kind: kind
      })
  }
  removeAirdropToServer(
    index: any
  ) {
    this._room?.send(Message.CS_ASTEROID_REMOVE,
      {
        index: index
      })
  }

  clientTime() {
    return new Date().getTime();
  }
  setDtServer2Client(serverTime: number) {
    this._dtServer2Client = this.clientTime() - serverTime;
  }
  // method to send player name to Colyseus server
  updatePlayerName(currentName: string) {
    this._room?.send(Message.UPDATE_PLAYER_NAME, { name: currentName })
  }
  //method to send game start ready
  allPlayersReady(ready:boolean) {
    this._room?.send(Message.GAMEPLAY_READY,{ready:ready})
  }
  specialKeyIsDown(explode: boolean) {
    this._room?.send(Message.ATOMIC_EXPLODE, { explode: explode });
  }

  // method to send ready-to-connect signal to Colyseus server
  readyToConnect() {
    this._room?.send(Message.READY_TO_CONNECT, {clientTime:this.clientTime()})
    phaserEvents.emit(Event.MY_PLAYER_READY)
  }

  changeName(account: string) {
    phaserEvents.emit(Event.MY_PLAYER_NAME_CHANGE, account)
  }


  //method to record user score to the DB when score was changed
  async recordScore (account: string = ``, tokenId: number = 0, shipName: string = ``, tier: number = 0,  score: number = 0) {
    try{
      const res = await api.score.saveScoreLog(account, tokenId.toString(), shipName, tier, score);
    }
    catch(e) {
      console.log(`record failed! `, e)
    }
  }

}

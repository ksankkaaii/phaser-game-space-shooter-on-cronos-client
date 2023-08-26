import Ship from "./Ship"
import Config from "./../../types/config/config"
import { BONUS_LIFE } from './../../types/config/helper'

class OtherShip extends Ship {

  _shipBody: any
  _engineSound:any
  _targetPosition: { x: number, y: number }
  _rotation: number
  _isForwarding: boolean
  _isBraking: boolean
  _angVel:number
  _hasShield: boolean
  _isFire: boolean
  _lastUpdateTimestamp?: number
  _connected = false
  _isExplode: boolean
  _explodeDone = false;
  _isEnableSoundEffect = false;

  _shipId:  number
  _timetemp = 0;
  constructor({ sargs, team, id, shipPros, tier }) {
    super(sargs, id, tier, false)

    let startingLives = shipPros.isBroken ? (Config.shipPros.startingLives - 1) : Config.shipPros.startingLives
    this.Lives = startingLives + BONUS_LIFE[shipPros.tier]
    console.log("this.Lives",startingLives,BONUS_LIFE, shipPros.tier)
    
    this._team = team;
    this._shipId = id;
    this._targetPosition = { x: sargs.x, y: sargs.y }
    this._shipBody = this.body;
    this._angVel = 180;
    // this._playerName.setText(name)
  }

  updateOtherPlayer(field: string, value: number | string | boolean, deltaTime: number) {
    switch (field) {
      case 'name':
        if (typeof value === 'string') {
          this._playerName.setText(value)
        }
        break

      case 'x':
        if (typeof value === 'number') {
          this._targetPosition.x = value;// + this._shipBody.velocity.x * deltaTime;
        }
        break

      case 'y':
        if (typeof value === 'number') {
          this._targetPosition.y = value;// + this._shipBody.velocity.y * deltaTime;
        }
        break
        case 'angularVel':
        //if (typeof value === 'number') {
        //  if (value > 0) this._rotation += Math.PI / 2.0 * deltaTime;
        //  else this._rotation -= Math.PI / 2.0 * deltaTime;
        //}
        break
      case 'rotation':
        if (typeof value === 'number') {
          this._rotation = value
        }
        break
      case 'speed_x':
        if (typeof value === 'number') {
          this._shipBody.velocity.x = value
        }
        break
     case 'speed_y':
        if (typeof value === 'number') {
          this._shipBody.velocity.y = value
        }
        break
      case 'isForwarding':
        if (typeof value === 'boolean') {
          this._isForwarding = value
          //this.setMaxVelocity(200)
        }

        break
      case 'isFire':
        if (typeof value === 'boolean') {
          this._isFire = value
        }
        break

      case 'hasShield':
        if (typeof value === 'boolean') {
          this._hasShield = value
        }
        break
      
      case 'isExplode':
        if (typeof value === 'boolean') {
          this._isExplode = value
        }
        break

      case 'readyToConnect':
        if (typeof value === 'boolean') {
          this._readyToConnect = value
        }
        break

      case 'team':
          if (typeof value === 'number') {
            this._team = value
          }
          break
      case 'spaceship':
        if (typeof value === 'string') {
          console.log("spaceship",value)
          this.setTexture(value) ;
        }
        break
        case 'lives':
          if (typeof value === 'number') {
            this._lives = value
          }
          break      
      }
  }
  updateOtherPlayerChanges(changes: any,deltaTimeFromServer:any) {
    const curTime = Date.now();    
    const serverTimeChange = changes.find((change: { field: string }) => change.field === 'curServerTime')
    const serverTime = serverTimeChange?.value
    if (serverTime < this._timetemp) return;
    const dt = (curTime - serverTime-deltaTimeFromServer)/1000.0;
    changes.map((change: { field: string; value: string | number | boolean }) => {
      //console.log("changes", change.field, change.value,);
      this.updateOtherPlayer(change.field, change.value, dt)
    })
    this._timetemp = serverTime;
  }

  /** preUpdate is called every frame for every game object. */

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt)
    this._gunModule.update(t, dt)
    this.x += ((this._targetPosition.x || this.x) - this.x) * 0.5;
    this.y += ((this._targetPosition.y || this.y) - this.y) * 0.5;
    // Intepolate angle while avoiding the positive/negative issue 
    let angle = this._rotation || this.rotation;
    let dir = (angle - this.rotation) / (Math.PI * 2);
    dir -= Math.round(dir);
    dir = dir * Math.PI * 2;
    this.rotation += dir;
    this._lastUpdateTimestamp = t
    // change player.depth based on player.y
    this.setDepth(this.y) 

    //if the player is forwarding, make the engine trail
    if (this._isForwarding) {
      this._engine.setAngle(this.angleBack)
      this._engine.setSpeed({ min: this.body.velocity.length() - 150, max: this.body.velocity.length() - 100 })
      this._engine.followOffset.setToPolar(this.rotBack, 25)
      this._isEnableSoundEffect = true;

      this._engine.start()
    } else {
      this._engine.stop()
      this._isEnableSoundEffect = false;
    }

    //if the player has shield, make the shield
    this._shield.setVisible(this._hasShield)
    this._shield.setPosition(this.x, this.y)
    if (this._isExplode) {
        this.kill();
    }
    
  }
  /**
     * Kills the ship.
     * This subtracts a life and makes the ship inactive and invisible.
     * Use respawn to restore ship.
     */
  kill() {
    this._engine.stop();
    
    if(this._explodeDone)
      return;
    this.emit("ship_death")
    this.setActive(false).setVisible(false)
    this._explodeDone = true;
  }
  /**
     * Makes the ship invulnerable for the specified duration. 
     * Whilst invulnerable the ship blinks.
     */
   makeTempInvulnerable(seconds: number) {
    let blinkEvent = this.scene.time.addEvent({
      delay: 200,
      callback: () => { this.setVisible(!this.visible) },
      callbackScope: this,
      repeat: -1
    })
    this.scene.time.delayedCall(seconds * 1000, // delay is given in milliseconds
      () => {
        blinkEvent.remove()
        this.setVisible(true)
      }, null, this)
  }

  /**
   * Respawns the ship and the coordinates provided and makes it invulnerable for 3 seconds.
   */
  respawn(x: number, y: number) {
    if(this._lives < 1 )
    {
      return
    }
      
    this.setActive(true).setVisible(true)
    this.setRotation(0)
    this.setRotation(this.rotLeft)
    this.setPosition(x, y)
    this._shipBody.setVelocity(0)
    this.makeTempInvulnerable(3) 
    this._explodeDone = false;
    if(this._lives ===1 )
    {
      this._lives =0
    }
  }
  get Lives() {
    return this._lives
  }

  set Lives(value: number) {
    if (value > Config.shipPros.startingLives + BONUS_LIFE[this._tier]) return
    this._lives = value
    this.scene.registry.set('playerLives', this._lives)
  }
}

export default OtherShip
/*jshint esversion: 6 */
import Entity from "./Entity"
import { EnemyGun } from "./GunModule"
import { randRange, ENEMY_TYPE } from "./../../types/config/helper"
import Config from "./../../types/config/config"

class Enemy extends Entity {

  _type: string
  _gunModule: any
  _group = 'enemy'
  _lives = 2
  // _bossLives = 10

  constructor({ sargs, type, lives }) {
    super(sargs)
    this._type = type
    this._lives = lives

    if (type === ENEMY_TYPE.BOSS_FIRST || type === ENEMY_TYPE.BOSS_SECOND || type === ENEMY_TYPE.BOSS_THIRD || type === ENEMY_TYPE.BOSS_FOURTH) this._group = 'boss'
    let owner = this
    let maxBullets = Config.enemyBulletPros.maxBullets
    let fireCooldown = (type === ENEMY_TYPE.NORMAL_FIRST || type === ENEMY_TYPE.NORMAL_SECOND)
      ? Config.enemyBulletPros.fireCooldown : Config.enemyBulletPros.bossFireCooldown
    let passiveRegenCooldown = Config.enemyBulletPros.passiveRegenCooldown
    let speed = (type === ENEMY_TYPE.NORMAL_FIRST || type === ENEMY_TYPE.NORMAL_SECOND)
      ? Config.enemyBulletPros.normalSpeed : Config.enemyBulletPros.bossSpeed
    this._gunModule = new EnemyGun(owner, maxBullets, fireCooldown, passiveRegenCooldown, speed)
  }

  launchEnemy(speed: number, direction: number, dirRandom = 0) {
    let angVelRange = Config.enemyPros.angVelRange
    let dirx = randRange(direction - dirRandom, direction + dirRandom)
    let diry = randRange(direction - dirRandom, direction + dirRandom)
    let vx = speed * Math.cos(dirx)
    let vy = speed * Math.sin(diry)
    this.setOrigin(0.5, 0.5)
    this.setVelocity(vx, vy)
    if (this._type === ENEMY_TYPE.NORMAL_FIRST || this._type === ENEMY_TYPE.NORMAL_SECOND) {
      this.setAngularVelocity(randRange(-angVelRange, angVelRange))
    } else {
      // this.setRotation(Math.atan2(-vy, vx) * Math.PI / 180)
      this.setRotation(direction)
    }

    if (this._type === ENEMY_TYPE.NORMAL_FIRST) this.setCircle(19)
    else if (this._type === ENEMY_TYPE.NORMAL_SECOND) this.setCircle(20)
    else this.setCircle(70)
  }

  update(t: number, dt: number) {
    this._gunModule.update(t, dt)

    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this._gunModule.setTriggerHeld(!this._gunModule._triggered)
      },
      repeat: -1
    })

  }

  /** Forward in relation to ship sprite */
  get rotForward() { return this.rotation }
  /** Left in relation to ship sprite */
  get rotLeft() { return this.rotation - Math.PI / 2 }
  /** Right in relation to ship sprite */
  get rotRight() { return this.rotation + Math.PI / 2 }
  /** Backwards in relation to ship sprite */
  get rotBack() { return this.rotation + Math.PI }

  /** Forward in relation to ship sprite */
  get angleForward() { return this.angle }
  /** Left in relation to ship sprite */
  get angleLeft() { return this.angle - 90 }
  /** Right in relation to ship sprite */
  get angleRight() { return this.angle + 90 }
  /** Back in relation to ship sprite */
  get angleBack() { return this.angle + 180 }
}

export default Enemy
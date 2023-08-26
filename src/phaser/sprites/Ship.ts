import Phaser from 'phaser'

import Entity from "./Entity"
import { StandardGun } from "./GunModule"
import Config from "./../../types/config/config"
import { BULLET_TYPE, BONUS_FIRECOOLDOWN, BONUS_MAXBULLET } from './../../types/config/helper'

class Ship extends Entity {

  _playerTexture: string
  _playerName: Phaser.GameObjects.Text
  _engine: any
  _lazerEffectParticle: any
  _lazerEffect: any
  _particles: any
  _shield: any
  _gunModule: any
  _lives: number

  _playerId: string
  _tier: number
  _hasCombat: boolean
  _readyToConnect = false
  _hasShield: boolean
  _bulletType: string
  _bulletTypeTimer: any
  _team: number
  _spaceship:string

  constructor(sargs: any, id: string, shipPros: any, hasCombat: boolean) {
    super(sargs)

    this._playerId = id
    this._tier = shipPros.tier | 0
    this._hasCombat = hasCombat
    this._playerTexture = sargs.texture


    // Physics settings
    this._shield = this.scene.add.sprite(this.x, this.y, Config.graphicAssets.shield.name)
    this._shield.setVisible(false)
    this._hasShield = false
    this._bulletType = BULLET_TYPE.NORMAL_BULLET
    this._team = shipPros?.team;
    
    let owner = this
    let maxBullets = Config.bulletPros.NORMAL_BULLET.maxBullets + BONUS_MAXBULLET[this._tier] + (hasCombat ? 1 : 0)
    let fireCooldown = Config.bulletPros.NORMAL_BULLET.fireCooldown * BONUS_FIRECOOLDOWN[this._tier] * (hasCombat ? 0.9 : 1)
    let passiveRegenCooldown = Config.bulletPros.NORMAL_BULLET.passiveRegenCooldown
    let speed = Config.bulletPros.NORMAL_BULLET.speed
    this._gunModule = new StandardGun(owner, maxBullets, fireCooldown, passiveRegenCooldown, speed)

    // Create particle system for engine trail
    this._particles = this.scene.add.particles(Config.graphicAssets.particles.name)
    this._engine = this._particles.createEmitter({
      frame: ["green"],
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.5, end: 0 },
      x: 0, y: 0,
      quantity: 3,
      lifespan: { min: 10, max: 100 },
      speed: { min: 10, max: 50 },
      blendMode: "ADD",
      follow: this,
    })
    //create lazer prepare motion.
    this._lazerEffectParticle = this.scene.add.particles(Config.graphicAssets.lazerEffectParticle.name)

    this._lazerEffect = this._lazerEffectParticle.createEmitter({
      frame: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
      scale: { start: 1, end: 0 },
      alpha: { start: 0.5, end: 0 },
      x: 0, y: 0,
      quantity: 3,
      lifespan: { min: 10, max: 10 },
      speed: { min: 10, max: 10 },
      blendMode: "ADD",
      follow: this,
    })

    // this._lazerEffect = this.scene.anims.create({
    //   key: Config.graphicAssets.lazerEffect.name,
    //   frames: this.scene.anims.generateFrameNames(Config.graphicAssets.lazerEffect.name, {
    //     start: 0, end: 83
    //   }),
    //   repeat: -1,
    //   frameRate: 100,
    // })
  }

  updateBulletProperty(value: string, seconds: number) {

    this._bulletType = value
    let maxBullets = (this._bulletType === BULLET_TYPE.UNLIMITED_BULLET) ? Config.bulletPros[value].maxBullets : Config.bulletPros[value].maxBullets + BONUS_MAXBULLET[this._tier] + (this._hasCombat ? 1 : 0)
    let fireCooldown = Config.bulletPros[value].fireCooldown * BONUS_FIRECOOLDOWN[this._tier] * (this._hasCombat ? 0.9 : 1)
    let passiveRegenCooldown = Config.bulletPros[value].passiveRegenCooldown
    let speed = Config.bulletPros[value].speed

    this._gunModule.updateBullet(maxBullets, fireCooldown, passiveRegenCooldown, speed)

    this.restoreBulletProperty(seconds)
  }

  restoreBulletProperty(seconds: number) {
    this._bulletTypeTimer?.remove()
    this._bulletTypeTimer = this.scene.time.delayedCall(seconds * 1000, // delay is given in milliseconds
      () => {
        this._bulletType = BULLET_TYPE.NORMAL_BULLET
        let maxBullets = Config.bulletPros.NORMAL_BULLET.maxBullets + BONUS_MAXBULLET[this._tier] + (this._hasCombat ? 1 : 0)
        let fireCooldown = Config.bulletPros.NORMAL_BULLET.fireCooldown * BONUS_FIRECOOLDOWN[this._tier] * (this._hasCombat ? 0.9 : 1)
        let passiveRegenCooldown = Config.bulletPros.NORMAL_BULLET.passiveRegenCooldown
        let speed = Config.bulletPros.NORMAL_BULLET.speed
        this._gunModule.updateBullet(maxBullets, fireCooldown, passiveRegenCooldown, speed)
      }, null, this)
  }

  /**
   * Reloads the gun on this ship.
   */
  reload() {
    this._gunModule.reload()
  }

  get rotForward() { return this.rotation }
  get rotLeft() { return this.rotation - Math.PI / 2 }
  get rotRight() { return this.rotation + Math.PI / 2 }
  get rotBack() { return this.rotation + Math.PI }

  get angleForward() { return this.angle }
  get angleLeft() { return this.angle - 90 }
  get angleRight() { return this.angle + 90 }
  get angleBack() { return this.angle + 180 }
}

export default Ship
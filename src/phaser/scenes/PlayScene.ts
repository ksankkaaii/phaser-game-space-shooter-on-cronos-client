//#region import
import Phaser from 'phaser';

import Network from '../../services/Network'
import Config from "./../../types/config/config"
import store from '../../stores'
import { setBulletName, setBulletDuration, setShieldName, setShieldDuration, setHasAtomic, setIsExist } from '../../stores/PhaserStore'

import {
	randRange,
	checkRoulette,
	QUARTRAD,
	ASTEROID_NAME,
	ASTEROID_SIZE,
	ASTEROID_TYPE,
	AIRDROP_NAME,
	AIRDROP_TYPE,
	BULLET_TYPE,
	BULLET_NAME,
	ENEMY_NAME,
	ENEMY_TYPE,
	BONUS_AIRDROP_DURATION,
	BONUS_LIFE,
	DIFFICULTY
} from "./../../types/config/helper"

import MyShip from '../sprites/MyShip'
import OtherShip from '../sprites/OtherShip'
import Bullet from '../sprites/Bullet'
import Asteroid from '../sprites/Asteroid'
import Airdrop from '../sprites/Airdrop'
import Enemy from '../sprites/Enemy'
import EnemyBullet from '../sprites/EnemyBullet'
import { Event, phaserEvents } from '../../events/EventCenter'
import isPortrait from 'events/detectOrientation'
//#endregion

// This is where all the game play code goes.
class PlayScene extends Phaser.Scene {

	constructor() {
		super('play')
	}

	private backgroundImg: Phaser.GameObjects.Image

	//#region local variables
	_network!: Network
	_myShip: any
	_myBullet:any
	_account: string
	_tokenId: string
	_shipName: string
	_paid: boolean
	_team: number
	_wasted: number
	_hits: number

	//sprite variables
	_ships: Phaser.Physics.Arcade.Group
	_otherShips: Phaser.Physics.Arcade.Group
	_otherShipMap = new Map<string, OtherShip>()
	_bullets: Phaser.Physics.Arcade.Group
	_enemyBullets: Phaser.Physics.Arcade.Group
	_regionBullets: Phaser.Physics.Arcade.Group
	_enemies: Phaser.Physics.Arcade.Group
	_airdrops: Phaser.Physics.Arcade.Group
	_worldBounds: any

	//assets variables
	_backgroundSprite: Phaser.GameObjects.Sprite
	fadeCamera: any
	_particles: any
	_destroyedSound: any
	_fireSound: any
	_bulletSound: any
	_bgSound: any

	//airdrop variables
	_airdropPercentAsteroid: number
	_airdropPercentEnemy: number
	_airdropPercentBoss: number
	_airdropDuration: number
	_airdropTimer: any

	//asteroid variables
	_startingAsteroids: number
	_maxAsteroids: number
	_incrementAsteroids: number
	_minAsteroidSpeed: number
	_maxAsteroidSpeed: number

	//enemy variables
	_minEnemySpeed: number
	_maxEnemySpeed: number
	_startingEnemies: number
	_increaseEnemies: number
	_enemyLives: number

	//boss variables
	_startingBoss: number
	_bossLives: number
	_increaseBoss: number
	_enemyBulletVelocity: { x: number, y: number }
	_bossSpeed: number

	//config variables
	_width: number
	_height: number
	_center: { x: number, y: number }
	_level: number
	_levelBoss: number
	_levelTimer: any
	_randomTimer: any
	_nextLevelTimer: any
	_readyNewLevel: boolean
	_passedIntro: boolean
	_specialKey: string
	_isEnableSoundEffect: boolean
	_isEnableBgSound: boolean
	//#endregion

	_shot: boolean
	_waitingText: any
	_gameStarted: boolean
	_shipPros: any

	_backImg: string
	_backBg: string

	_bossMode: boolean

	_firstBackImgRandom: number
	_firstBgRandom: number

	_updateSceneOrientation(orientation){
		let oppositeOrientation;
		var mql = window.matchMedia("(orientation: portrait)");
		if(mql.matches) {  
    		oppositeOrientation = true;
		} else {  
    		oppositeOrientation = false;
		}

		Config.gamePros.screenWidth = oppositeOrientation ?  window.innerWidth  / (window.innerHeight / 1920):1920;
		Config.gamePros.screenHeight = oppositeOrientation ? 1920:1080;
		this._width = Config.gamePros.screenWidth
		this._height = Config.gamePros.screenHeight
		this._center = { x: this._width / 2, y: this._height / 2 }
		this.scale.setGameSize(this._width, this._height);
		//sets up background
		this._backgroundSprite.displayWidth = oppositeOrientation ?  window.innerWidth  / (window.innerHeight / 1920):1920;
		this._backgroundSprite.displayHeight = oppositeOrientation ? 1920:1080;

		this._backgroundSprite.setScale(oppositeOrientation ?  1920 /window.innerHeight :1, oppositeOrientation ?  1920 /window.innerHeight :1);
		let rect_width = 5
		let offsetX = this._width / 2 + 100
		let offsetY = this._height / 2 + 100
		let left = this._center.x - offsetX
		let right = this._center.x + (offsetX - rect_width)
		let top = this._center.y - offsetY
		let bottom = this._center.y + (offsetY - rect_width)
		let wx = right - left
		let wy = bottom - top

		let middle_y = top + wy / 2
		let middle_x = left + wx / 2;

		this._worldBounds.clear(true, true);

		this._worldBounds.add(new Phaser.GameObjects.Rectangle(this, middle_x, top, wx, rect_width)) // Top
		this._worldBounds.add(new Phaser.GameObjects.Rectangle(this, left, middle_y, rect_width, wy))// Left

		this._worldBounds.add(new Phaser.GameObjects.Rectangle(this, middle_x, bottom, wx, rect_width, 1)) // Bottom
		this._worldBounds.add(new Phaser.GameObjects.Rectangle(this, right, middle_y, rect_width, wy, 0)) // Right

		this.physics.world.setBounds(0,0,this._width, this._height);
	}
	//#region init	
	init() {
		let scene_obj = this;
		let oppositeOrientation = isPortrait();
		
        try {
            this.scale.on('orientationchange', function(orientation) {
                scene_obj._updateSceneOrientation(orientation)
            });
        }
        catch(err){
            console.log(`This deveice does not support orientation.`)
        }

		// set game config variable data
		Config.gamePros.screenWidth = oppositeOrientation ?  window.innerWidth  / (window.innerHeight / 1920):1920;
		Config.gamePros.screenHeight = oppositeOrientation ? 1920:1080;
		this._width = Config.gamePros.screenWidth
		this._height = Config.gamePros.screenHeight
		this._center = { x: this._width / 2, y: this._height / 2 }
		this.scale.setGameSize(this._width, this._height);

		this._level = 0
		this._levelBoss = 1
		this._readyNewLevel = false
		this._passedIntro = false
		this._isEnableSoundEffect = true
		this._isEnableBgSound = true

		this._firstBackImgRandom = 	Math.round(Math.random() * (Config.graphicAssets.background.length - 1));
		this._firstBgRandom  = Math.round(Math.random() * (Config.soundAssets.bg.length - 1));

		this._startingAsteroids = Config.asteroidPros.startingAsteroids
		this._maxAsteroids = Config.asteroidPros.maxAsteroids
		this._incrementAsteroids = Config.asteroidPros.incrementAsteroids
		this._minAsteroidSpeed = Config.asteroidPros.minSpeed
		this._maxAsteroidSpeed = Config.asteroidPros.maxSpeed

		this._minEnemySpeed = Config.enemyPros.minSpeed
		this._maxEnemySpeed = Config.enemyPros.maxSpeed
		this._startingEnemies = Config.enemyPros.startingEnemies
		this._increaseEnemies = Config.enemyPros.incrementEnemies
		this._enemyBulletVelocity = Config.enemyBulletPros.velocity
		this._enemyLives = Config.enemyBulletPros.lives

		this._startingBoss = Config.enemyPros.startingBoss
		this._increaseBoss = Config.enemyPros.incrementBoss
		this._bossLives = Config.enemyPros.bossLives
		this._bossSpeed = Config.enemyBulletPros.bossSpeed

		this._airdropPercentAsteroid = Config.airdropPros.percentAsteroid
		this._airdropPercentEnemy = Config.airdropPros.percentEnemy
		this._airdropPercentBoss = Config.airdropPros.percentBoss
		this._airdropDuration = Config.airdropPros.duration

		this._shot = false;
		this._gameStarted = false;

	}

	initWorld() {
		// Sets up scene physics
		this._ships = this.physics.add.group()
		this._ships.runChildUpdate = true

		this._otherShips = this.physics.add.group()
		this._otherShips.runChildUpdate = true

		this._bullets = this.physics.add.group()
		this._bullets.runChildUpdate = true

		this._enemyBullets = this.physics.add.group()
		this._enemyBullets.runChildUpdate = true

		this._regionBullets = this.physics.add.group()
		this._regionBullets.runChildUpdate = true

		this._airdrops = this.physics.add.group()
		this._airdrops.runChildUpdate = true

		this._enemies = this.physics.add.group()
		this._enemies.runChildUpdate = true

		let oppositeOrientation = isPortrait();

		//sets up background
		this._backImg = Config.graphicAssets.background[0].name;
		this._backgroundSprite = this.add.sprite(0, 0, Config.graphicAssets.background[0].name)
		this._backgroundSprite.displayWidth = oppositeOrientation ?  window.innerWidth  / (window.innerHeight / 1920):1920;
		this._backgroundSprite.displayHeight = oppositeOrientation ? 1920:1080;

		this._backgroundSprite.setOrigin(0,0);
		this._backgroundSprite.setScale(oppositeOrientation ?  1920 /window.innerHeight :1, oppositeOrientation ?  1920 /window.innerHeight :1);

		this.initWorldBounds();

		// darkhorse
		this.physics.add.overlap(this._ships, this._enemies, this.shipEnemyCollision, null, this)
		this.physics.add.overlap(this._ships, this._enemyBullets, this.shipEnemyCollision, null, this)
		this.physics.add.overlap(this._ships, this._airdrops, this.shipAirdropCollision, null, this)
		this.physics.add.overlap([this._bullets, this._regionBullets], this._enemies, this.bulletEnemyCollision, null, this)
		this.physics.add.overlap([this._bullets, this._regionBullets], this._enemyBullets, this.bulletEnemyCollision, null, this)
		this.physics.add.overlap(this._bullets, this._worldBounds, (bullet, _) => { bullet.destroy() })
		this.physics.add.overlap(this._enemyBullets, this._worldBounds, (bullet, _) => { bullet.destroy() })
		// this.physics.add.overlap(this._enemies, this._worldBounds, this.respawnEnemies, null. this)
	}

	initWorldBounds() {
		/** Calculate world bounds as offset from the center */
		let rect_width = 5
		let offsetX = this._width / 2 + 100
		let offsetY = this._height / 2 + 100
		let left = this._center.x - offsetX
		let right = this._center.x + (offsetX - rect_width)
		let top = this._center.y - offsetY
		let bottom = this._center.y + (offsetY - rect_width)
		let wx = right - left
		let wy = bottom - top

		let middle_y = top + wy / 2
		let middle_x = left + wx / 2

		this._worldBounds = this.physics.add.staticGroup()
		//Rectangle x,y is the center
		this._worldBounds.add(new Phaser.GameObjects.Rectangle(this, middle_x, top, wx, rect_width)) // Top
		this._worldBounds.add(new Phaser.GameObjects.Rectangle(this, left, middle_y, rect_width, wy))// Left

		this._worldBounds.add(new Phaser.GameObjects.Rectangle(this, middle_x, bottom, wx, rect_width, 1)) // Bottom
		this._worldBounds.add(new Phaser.GameObjects.Rectangle(this, right, middle_y, rect_width, wy, 0)) // Right
	}

	initShip(shipPros: any, hasCombat: boolean, keyboard: any) {
		let inputKeys = {
			forward: this.input.keyboard.addKey(keyboard.forward),
			brake: this.input.keyboard.addKey(keyboard.brake),
			left: this.input.keyboard.addKey(keyboard.left),
			right: this.input.keyboard.addKey(keyboard.right),
			fire: this.input.keyboard.addKey(keyboard.fire)
		}

		this._myShip = new MyShip({
			sargs: {
				scene: this,
				group: this._ships,
				x: this.cameras.main.centerX,
				y: this.cameras.main.centerY,
				//texture: SHIP_TYPE[shipPros.shipColor]
				texture : shipPros.spaceship
			},
			id: 1,
			shipPros: shipPros,
			hasCombat: hasCombat,
			inputKeys: inputKeys
		});

		if(window.innerWidth < 1024 && isPortrait()) {
			this._myShip.setRotation(this._myShip.rotForward)
		}
		else {
			this._myShip.setRotation(this._myShip.rotLeft)
		}

		let deathSound = this.sound.add(Config.soundAssets.shipExplose.name, { volume: 0.5 })
		deathSound.on("complete", () => {
			if (this._myShip.Lives < 1) {
				this.gameOver()
			} else {
				this._myShip.respawn(this._width / 2, this._height / 2)
			}
		})

		this._myShip.on("ship_death", () => {
			deathSound.play()
			this._particles.shipExplode.emitParticleAt(this._myShip.x, this._myShip.y)
		})

		this._myShip._engineSound = this.sound.add(Config.soundAssets.engine.name, { loop: true, volume: 0.5 })
		if (this._isEnableSoundEffect) this._myShip._engineSound.play()
		this._myShip._engineSound.pause();
	}

	initAssets() {
		// sets up sounds config variable data
		this._bulletSound = this.sound.add(Config.soundAssets.fire.name)
		this._destroyedSound = this.sound.add(Config.soundAssets.destroyed.name)
		this._fireSound = this.sound.add(Config.soundAssets.fire.name)

		// sets up explosion config variable data
		this._particles = {}
		let particles = this.add.particles(Config.graphicAssets.particles.name)
		particles.setDepth(9)
		let bulletExplosionConfig = {
			frame: ["blue", "red", "orange"],
			scale: { start: 0.2, end: 0 },
			quantity: 30,
			alpha: { start: 1, end: 0 },
			lifespan: { min: 500, max: 1000 },
			speed: { min: 120, max: 150 },
			frequency: -1,
			blendMode: "ADD",
		}

		let asteroidExplosionConfig = {
			frame: ["white", "red"],
			scale: { start: 0.3, end: 0 },
			quantity: 60,
			alpha: { start: 1, end: 0 },
			lifespan: { min: 300, max: 600 },
			speed: { min: 20, max: 150 },
			frequency: -1,
			blendMode: "ADD",
		}

		let shipExplosionConfig = {
			frame: ["white", "red", "orange"],
			scale: { start: 0.6, end: 0 },
			quantity: 60,
			alpha: { start: 1, end: 0 },
			lifespan: { min: 300, max: 600 },
			speed: { min: 20, max: 150 },
			frequency: -1,
			blendMode: "ADD",
		}

		this._particles.bulletImpact = particles.createEmitter(bulletExplosionConfig)
		this._particles.asteroidExplode = particles.createEmitter(asteroidExplosionConfig)
		this._particles.shipExplode = particles.createEmitter(shipExplosionConfig)
		this.time.addEvent({
			delay: 1000,
			callback: () => {
				this._backBg = Config.soundAssets.bg[0].name;
				this._bgSound = this.sound.add(Config.soundAssets.bg[0].name);
				this._bgSound.setLoop(true);
			},
		})
	}
	//#endregion

	create(data: { network: Network, shipPros: any, gameProps: any }) {

		this.initAssets()
		this.initWorld()

		this._airdropDuration *= BONUS_AIRDROP_DURATION[data.shipPros.tier]
		this.registry.set('bonusLives', BONUS_LIFE[data.shipPros.tier])
		this._specialKey = data.gameProps.keyboard.special

		this.scene.launch("text", { level: 1 })
		if (!data.network) {
			throw new Error('server instance missing')
		} else {
			this._network = data.network
		}
		this.initShip(data.shipPros, data.gameProps.hasCombat, data.gameProps.keyboard)
		this._account = data.shipPros.account
		this._tokenId = data.shipPros.tokenID
		this._paid = data.shipPros.paid
		this._team = data.shipPros.team
		this._wasted = data.shipPros.wasted
		this._hits = data.shipPros.hits

		if (data.shipPros.hasShield) {
			this._myShip.setShiled(this._airdropDuration)
			store.dispatch(setShieldName(AIRDROP_NAME.SHIELD))
			store.dispatch(setShieldDuration(this._airdropDuration))
		}

		this._startingAsteroids += DIFFICULTY[data.gameProps.difficulty].STARTING_ASTEROIDS
		this._incrementAsteroids += DIFFICULTY[data.gameProps.difficulty].INCREASE_ASTEROIDS
		this._maxAsteroids += DIFFICULTY[data.gameProps.difficulty].MAX_ASTEROIDS
		this._minAsteroidSpeed *= DIFFICULTY[data.gameProps.difficulty].MIN_ASTEROID_SPEED
		this._maxAsteroidSpeed *= DIFFICULTY[data.gameProps.difficulty].MAX_ASTEROID_SPEED
		this._startingEnemies += DIFFICULTY[data.gameProps.difficulty].STARTING_ENEMIES
		this._increaseEnemies += DIFFICULTY[data.gameProps.difficulty].INCREASE_ENEMIES
		this._minEnemySpeed *= DIFFICULTY[data.gameProps.difficulty].MIN_ENEMY_SPEED
		this._maxEnemySpeed *= DIFFICULTY[data.gameProps.difficulty].MAX_ENEMY_SPEED

		this._bossMode = data?.gameProps?.bossMode || false;

		this.input.keyboard.on(`keyup-${data.gameProps.keyboard.sounds}`, () => {
			this._isEnableSoundEffect = !this._isEnableSoundEffect
			phaserEvents.emit(Event.TOGGLE_SOUNDS, this._isEnableSoundEffect)
		}, this);

		
		this.input.keyboard.on(`keyup-${data.gameProps.keyboard.music}`, () => {
			this._isEnableBgSound = !this._isEnableBgSound
			this._isEnableBgSound ? this._bgSound.play() : this._bgSound.stop()
		}, this);

		this.input.keyboard.on(`keyup-${data.gameProps.keyboard.exit}`, () => {
			store.dispatch(setIsExist(true))
		}, this);

		phaserEvents.on(Event.EXIST_GAME, () => {
			this.gameOver()
		})
		this.time.addEvent({
			delay: 2000,
			callback: () => {
				this._bgSound.play()

			},
		});
		if (this._network) this._network.allPlayersReady(true)

		this._gameStarted = true;
	}

	updateBulletLaunchDataToserver(x: number, y: number, rotation: number, speed: number, shooter: any,teamflag:number) {
		let speed_x = 0;
		let speed_y = 0;
		let baseVel = shooter.body.velocity
		let vel = new Phaser.Math.Vector2().setToPolar(rotation, speed)
		speed_x = baseVel.x + vel.x;
		speed_y = baseVel.y + vel.y;
		if (!this._shot) {
			if(this._network)
				this._network.updateBulletToServer(
					x,
					y,
					rotation,
					speed_x,
					speed_y,
					shooter._bulletType,
					teamflag
			 	)
			this._shot = true;
		}
		this._shot = false;
	}

	//#region collision
	shipEnemyCollision(ship: any, asteroidOrEnemy: any) {
		if (ship._hasShield) {
			if (asteroidOrEnemy._group === 'asteroid') this.splitAsteroid(asteroidOrEnemy)
			this._particles.asteroidExplode.emitParticleAt(asteroidOrEnemy.x, asteroidOrEnemy.y)
			if (this._isEnableSoundEffect) this._destroyedSound.play()

			asteroidOrEnemy.destroy()
		} else if (ship.Vulnerable) {
			ship.kill() //by mars
		}
	}

	shipAirdropCollision(ship: any, airdrop: any) {
		if (airdrop._kind === AIRDROP_TYPE.LIFE) { }
		else if (airdrop._kind === AIRDROP_TYPE.ATOMIC_BULLET) {
			store.dispatch(setHasAtomic(true))
		} else if (airdrop._kind === AIRDROP_TYPE.SHIELD) {
			store.dispatch(setShieldName(airdrop._kind))
			store.dispatch(setShieldDuration(this._airdropDuration))
		} else {
			store.dispatch(setBulletName(airdrop._kind))
			store.dispatch(setBulletDuration(this._airdropDuration))
		}

		if (airdrop._kind === AIRDROP_TYPE.ATOMIC_BULLET) {
			ship._hasAtomic = true
		} else if (airdrop._kind === AIRDROP_TYPE.LIFE) {
			ship.Lives += 1
		} else if (airdrop._kind === AIRDROP_TYPE.SHIELD) {
			ship.setShiled(this._airdropDuration)
		} else {
			ship.updateBulletProperty(airdrop._kind, this._airdropDuration)
		}
		airdrop.destroy()
	}

	bulletEnemyCollision(bullet: any, asteroidOrEnemy: any) {
		if (bullet._bulletKind !== 'atomic') {
			this._myShip._hits += 1;
			this._myShip.setAccuracy();
		}
		if (bullet._bulletKind === 'normal' && bullet._owner._bulletType === BULLET_TYPE.EXPLOSIVE_BULLET) {
			bullet.destroy()
			this.spawnRegionBullet(asteroidOrEnemy.x, asteroidOrEnemy.y, bullet._owner, 'explosive')
			return
		}

		if (asteroidOrEnemy._group === 'asteroid') {
			if (asteroidOrEnemy._type === ASTEROID_TYPE.SECOND && asteroidOrEnemy._lives === 2) {
				asteroidOrEnemy._lives--
				this._particles.asteroidExplode.emitParticleAt(asteroidOrEnemy.x, asteroidOrEnemy.y)
				if (bullet._owner._bulletType !== BULLET_TYPE.LAZER_BULLET)
					bullet.destroy()
				return
			}
			bullet._owner.Score += 1;
			if(this._network && bullet._bulletKind !== 'atomic') {
				this._network.recordScore(
					bullet._owner._account,
					bullet._owner._tokenId,
					bullet._owner._shipName,
					bullet._owner._tier,
					bullet._owner._score,
				 )
			}
			this.spawnRandomAirdrop(asteroidOrEnemy, bullet._owner, this._airdropPercentAsteroid)
			this.splitAsteroid(asteroidOrEnemy)
		}

		if (asteroidOrEnemy._group === 'enemy' || asteroidOrEnemy._group === 'boss') {
			if (asteroidOrEnemy._group === 'enemy' && asteroidOrEnemy._lives === 2) {
				asteroidOrEnemy._lives--
				this._particles.asteroidExplode.emitParticleAt(asteroidOrEnemy.x, asteroidOrEnemy.y)
				if (bullet._owner._bulletType !== BULLET_TYPE.LAZER_BULLET)
					bullet.destroy()
				return
			}
			if (asteroidOrEnemy._group === 'boss' && asteroidOrEnemy._lives > 1) {
				asteroidOrEnemy._lives--
				this._particles.asteroidExplode.emitParticleAt(asteroidOrEnemy.x, asteroidOrEnemy.y)
				if (bullet._owner._bulletType !== BULLET_TYPE.LAZER_BULLET)
					bullet.destroy()
				return
			}
			if (asteroidOrEnemy._group === 'enemy') {
				bullet._owner.Score += 10;
				if(this._network && bullet._bulletKind !== 'atomic') {
					this._network.recordScore(
						bullet._owner._account,
						bullet._owner._tokenId,
						bullet._owner._shipName,
						bullet._owner._tier,
						bullet._owner._score,
					 )
				}
				this.spawnRandomAirdrop(asteroidOrEnemy, bullet._owner, this._airdropPercentEnemy)
			}
			if (asteroidOrEnemy._group === 'boss') {
				bullet._owner.Score += 80;
				if(this._network && bullet._bulletKind !== 'atomic') {
					this._network.recordScore(
						bullet._owner._account,
						bullet._owner._tokenId,
						bullet._owner._shipName,
						bullet._owner._tier,
						bullet._owner._score,
					 )
				}
				this.spawnRandomAirdrop(asteroidOrEnemy, bullet._owner, this._airdropPercentBoss)
			}

			// once a ship is destroyed, its bullets are destoryed
			// this._enemies.children.entries
			// 	//@ts-ignore
			// 	.filter((enemy) => (enemy._group === 'enemyBullet'))
			// 	.map((enemy) => (enemy.destroy()))
		}

		this._particles.asteroidExplode.emitParticleAt(asteroidOrEnemy.x, asteroidOrEnemy.y)
		if (this._isEnableSoundEffect) this._destroyedSound.play()

		if (bullet._bulletKind !== 'atomic') bullet._owner.reload()
		if (bullet._owner._bulletType !== BULLET_TYPE.LAZER_BULLET)
			bullet.destroy()
		asteroidOrEnemy.destroy()
	}
	//#endregion

	//#region spawn
	spawnRandomBullet(x: number, y: number, rotation: number, speed: number, shooter: any) {
		const bulletType = shooter._bulletType
		switch (bulletType) {
			case BULLET_TYPE.DOUBLE_BULLET:
				let baseVelD = shooter.body.velocity
				let velD = new Phaser.Math.Vector2().setToPolar(rotation, speed)
				let velocityD = velD.add(baseVelD)
				let len = Math.sqrt(velocityD.x * velocityD.x + velocityD.y * velocityD.y)
				let newD = { x: velocityD.x / len, y: velocityD.y / len }

				for (let i = -1; i <= 1; i += 2) {
					let bulletD = this.spawnBullet(x - newD.y * 15 * i, y + newD.x * 15 * i, shooter)
					bulletD.rotation = shooter.rotation
					bulletD.setVelocity(velocityD.x, velocityD.y)
				}
				break

			case BULLET_TYPE.TRIPLE_BULLET:
				let baseVelT = shooter.body.velocity
				let velT = new Phaser.Math.Vector2().setToPolar(rotation, speed)
				let velocityT = velT.add(baseVelT)
				let lenT = Math.sqrt(velocityT.x * velocityT.x + velocityT.y * velocityT.y)
				let newT = { x: velocityT.x / lenT, y: velocityT.y / lenT }

				for (let i = -1; i <= 1; i++) {
					let bulletD = this.spawnBullet(x - newT.y * 15 * i, y + newT.x * 15 * i, shooter)
					bulletD.rotation = shooter.rotation
					bulletD.setVelocity(velocityT.x, velocityT.y)
				}
				break

			case BULLET_TYPE.VOLLEY_BULLET:
				for (let i = -1; i <= 1; i++) {
					let q = i * Math.PI / 10
					let bullet1 = this.spawnBullet(x, y, shooter)
					bullet1.rotation = shooter.rotation + q
					let baseVel1 = shooter.body.velocity
					let vel1 = new Phaser.Math.Vector2().setToPolar(rotation, speed)
					// let r = Math.sqrt(Math.pow((baseVel1.x + vel1.x), 2) + Math.pow((baseVel1.y + vel1.y), 2))
					let r = vel1.add(baseVel1).length()
					let a = shooter.rotation
					bullet1.setVelocity(r * Math.cos(a + q), r * Math.sin(a + q))
				}
				break

			case BULLET_TYPE.EXPLOSIVE_BULLET:
				let bullet3 = this.spawnBullet(x, y, shooter)
				bullet3.rotation = shooter.rotation
				let baseVel3 = shooter.body.velocity
				let vel3 = new Phaser.Math.Vector2().setToPolar(rotation, speed)
				bullet3.setVelocity(baseVel3.x + vel3.x, baseVel3.y + vel3.y)
				break

			case BULLET_TYPE.LAZER_BULLET:
				shooter._hasLazer = true
				setTimeout(() => {
					let bullet4 = this.spawnBullet(x, y, shooter)
					bullet4.rotation = shooter.rotation
					let baseVel4 = shooter.body.velocity
					let vel4 = new Phaser.Math.Vector2().setToPolar(shooter.rotation, speed)
					bullet4.setVelocity(baseVel4.x + vel4.x, baseVel4.y + vel4.y)
					shooter._hasLazer = false
				}, 500);
				break

			case BULLET_TYPE.ATOMIC_BULLET:
				let bullet5 = this.spawnBullet(x, y, shooter)
				bullet5.rotation = shooter.rotation
				let baseVel5 = shooter.body.velocity
				let vel5 = new Phaser.Math.Vector2().setToPolar(rotation, speed)
				bullet5.setVelocity(baseVel5.x + vel5.x, baseVel5.y + vel5.y)
				break

			default:
				let bullet = this.spawnBullet(x, y, shooter)
				bullet.rotation = shooter.rotation
				let baseVel = shooter.body.velocity
				let vel = new Phaser.Math.Vector2().setToPolar(rotation, speed)
				bullet.setVelocity(baseVel.x + vel.x, baseVel.y + vel.y)
				break
		}
	}

	spawnBullet(x: number, y: number, shooter: any) {
		let posX: number
		let posY: number
		let bulletType = shooter._bulletType
		if (bulletType === BULLET_TYPE.LAZER_BULLET) {
			posX = shooter.x
			posY = shooter.y
		} else {
			posX = x
			posY = y
		}
		let bullet = new Bullet({
			sargs: {
				scene: this,
				group: this._bullets,
				x: posX, y: posY,
				texture: BULLET_NAME[shooter._bulletType],
				frame: 0
			},
			owner: shooter,
			kind: 'normal'
		})
		return bullet
	}

	spawnRegionBullet(x: number, y: number, shooter: any, kind: string) {
		this._myBullet = new Bullet({
			sargs: {
				scene: this,
				group: this._regionBullets,
				x: x, y: y,
				texture: BULLET_NAME.REGION_BULLET,
				frame: 0
			},
			owner: shooter,
			kind: kind
		})
		return this._myBullet
	}

	spawnRandomAsteroid(type: string, size: string) {
		let { x, y, dir: direction } = this.getOuterRimCoords()
		let asteroid = this.spawnAsteroid(x, y, type, size)
		asteroid.launchAsteroid(randRange(this._minAsteroidSpeed, this._maxAsteroidSpeed), direction + Math.PI, QUARTRAD)
	}

	spawnAsteroid(x: number, y: number, type: string, size: string) {
		let asteroid = new Asteroid(
			{
				sargs: {
					scene: this,
					group: this._enemies,
					x: x, y: y,
					texture: ASTEROID_NAME[type][size],
					frame: Math.round(Math.random() * 2)
				},
				type: type,
				size: size
			})
		return asteroid
	}

	respawnEnemies(asteroidOrEnemy: any, bound: any) {
		let { x, y, dir: direction } = this.getOuterRimCoords()
		asteroidOrEnemy.setPosition(x, y)
		if (asteroidOrEnemy._group === 'enemy') asteroidOrEnemy.launchEnemy(randRange(this._minEnemySpeed, this._maxEnemySpeed), direction + Math.PI, QUARTRAD)
		else if (asteroidOrEnemy._group === 'asteroid') asteroidOrEnemy.launchAsteroid(randRange(this._minAsteroidSpeed, this._maxAsteroidSpeed), direction + Math.PI, QUARTRAD)
		else if (asteroidOrEnemy._group === 'enemyBullet') asteroidOrEnemy.destroy()
	}

	splitAsteroid(asteroid: any) {
		if (asteroid._size === ASTEROID_SIZE.SMALL) return
		let type = asteroid._type
		let newSize = ASTEROID_SIZE.SMALL
		let originalVel = asteroid.body.velocity

		let { x, y } = asteroid.getCenter()

		for (let i = 0; i < 2; i++) {
			let { x: rx, y: ry } = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 40)
			let asteroid = this.spawnAsteroid(x + rx, y + ry, type, newSize)

			// Launch with velocity that is slightly faster and somewhat in the same direction
			asteroid.launchAsteroid(randRange(this._minAsteroidSpeed, this._maxAsteroidSpeed), originalVel.angle(), QUARTRAD, 60)
		}
	}

	spawnRandomEnemies(type: string, lives: number) {
		let { x, y, dir: direction } = this.getOuterRimCoords()
		let enemy = this.spawnEnemy(x, y, type, lives)
		enemy.launchEnemy(randRange(this._minEnemySpeed, this._maxEnemySpeed), direction + Math.PI, QUARTRAD - Math.PI)
	}

	spawnEnemy(x: number, y: number, type: string, lives: number) {
		let enemy = new Enemy(
			{
				sargs: {
					scene: this,
					group: this._enemies,
					x: x, y: y,
					texture: ENEMY_NAME[type],
					frame: Math.round(Math.random() * 2)
				},
				type: type,
				lives: lives
			})
		return enemy
	}

	spawnRandomEnemyBullet(x: number, y: number, rotation: number, speed: number, shooter: any) {
		if (shooter._type === ENEMY_TYPE.NORMAL_FIRST) {
			let enemyBullet = this.spawnEnemyBullet(x, y, shooter)
			enemyBullet.rotation = rotation
			let baseVel = shooter.body.velocity
			let vel = new Phaser.Math.Vector2().setToPolar(rotation, speed)
			enemyBullet.setVelocity(baseVel.x + vel.x, baseVel.y + vel.y)

		} else if (shooter._type === ENEMY_TYPE.NORMAL_SECOND) {
			for (let i = 0; i < 10; i++) {
				let angel = i * Math.PI / 5
				let enemyBullet = this.spawnEnemyBullet(x, y, shooter)
				let baseVel = this._enemyBulletVelocity
				enemyBullet.setVelocity(baseVel.x * Math.cos(angel), baseVel.y * Math.sin(angel))
			}

		} else if (shooter._type === ENEMY_TYPE.BOSS_FIRST || shooter._type === ENEMY_TYPE.BOSS_SECOND) {
			let enemyBullet = this.spawnEnemyBullet(x, y, shooter)
			let pVec = { x: this._myShip.x - shooter.x, y: this._myShip.y - shooter.y }
			let r = Math.sqrt(pVec.x * pVec.x + pVec.y * pVec.y)
			let dirVec = { x: pVec.x / r, y: pVec.y / r }
			let baseVel = { x: dirVec.x * this._bossSpeed, y: dirVec.y * this._bossSpeed }
			enemyBullet.setVelocity(baseVel.x, baseVel.y)

		} else if (shooter._type === ENEMY_TYPE.BOSS_THIRD || shooter._type === ENEMY_TYPE.BOSS_FOURTH) {
			// let enemyBullet = this.spawnEnemyBullet(x, y, shooter)
			let pVec = { x: this._myShip.x - shooter.x, y: this._myShip.y - shooter.y }
			let r = Math.sqrt(pVec.x * pVec.x + pVec.y * pVec.y)
			let dirVec = { x: pVec.x / r, y: pVec.y / r }
			let baseVel = { x: dirVec.x * this._bossSpeed, y: dirVec.y * this._bossSpeed }

			let len = Math.sqrt(baseVel.x * baseVel.x + baseVel.y * baseVel.y)
			let newP = { x: baseVel.x / len, y: baseVel.y / len }

			for (let i = -1; i <= 1; i += 2) {
				let enemyBullet = this.spawnEnemyBullet(x - newP.y * 15 * i, y + newP.x * 15 * i, shooter)
				enemyBullet.setVelocity(baseVel.x, baseVel.y)
			}
		}
	}

	spawnEnemyBullet(x: number, y: number, shooter: any) {
		let texture = shooter._type.startsWith('NORMAL') ? Config.graphicAssets.enemyBullet.name : Config.graphicAssets.rocketBullet.name
		let enemyBullet = new EnemyBullet({
			sargs: {
				scene: this,
				group: this._enemyBullets,
				x: x, y: y,
				texture: texture,
				frame: 0
			},
			owner: shooter
		})
		return enemyBullet
	}

	spawnRandomAirdrop(enemy: any, owner:any, airdropPercent: number) {
		// check if airdrop possible by percentage
		if (!checkRoulette(airdropPercent)) return

		const randVal = randRange(0, 9)
		let kind = ''
		if (randVal <= 1) kind = AIRDROP_TYPE.UNLIMITED_BULLET
		else if (randVal <= 2) kind = AIRDROP_TYPE.DOUBLE_BULLET
		else if (randVal <= 3) kind = AIRDROP_TYPE.TRIPLE_BULLET
		else if (randVal <= 4) kind = AIRDROP_TYPE.VOLLEY_BULLET
		else if (randVal <= 5) kind = AIRDROP_TYPE.LAZER_BULLET
		else if (randVal <= 6) kind = AIRDROP_TYPE.EXPLOSIVE_BULLET
		else if (randVal <= 7) kind = AIRDROP_TYPE.LIFE
		else if (randVal <= 8) kind = AIRDROP_TYPE.ATOMIC_BULLET
		else kind = AIRDROP_TYPE.SHIELD

		let { dir: direction } = this.getOuterRimCoords()
		let airdrop = this.spawnAirdrop(enemy.x, enemy.y, owner, kind)
		airdrop.launchAirdrop(10 + randRange(-5, 10), direction + Math.PI, QUARTRAD)

		let alertTimer = this.time.delayedCall(Config.airdropPros.alertTime * 1000, () => {
			this.time.addEvent({
				delay: 500,
				callback: () => {
					airdrop.setVisible(!airdrop.visible)
				},
				callbackScope: this,
				repeat: -1
			})
		})

		// destroy airdrop after 10secs
		this.time.delayedCall(Config.airdropPros.lifetime * 1000, () => {
			alertTimer.remove()
			airdrop.destroy()
		})
	}

	spawnAirdrop(x: number, y: number, owner:any, kind: string) {
		let airdrop = new Airdrop(
			{
				sargs: {
					scene: this,
					group: this._airdrops,
					x: x, y: y,
					texture: AIRDROP_NAME[kind],
					frame: Math.round(Math.random() * 2)
				},
				owner: owner,
				kind: kind
			})
		return airdrop
	}

	getOuterRimCoords() {
		// let direction = rand * Math.PI * 2
		// let x = this._center.x + Math.cos(direction) * randRange(this._width / 2 + 100, this._width / 2 + 200)
		// let y = this._center.y + Math.sin(direction) * randRange(this._height / 2 + 100, this._height / 2 + 200)

		let x = 0
		let y = 0
		let direction = 0
		let randVal = Math.random() * (this._width * 2 + this._height * 2)

		if (randVal < this._width) { // generate pos from top
			x = randVal
			y = 0
			direction = - randRange(0.1, 0.9) * Math.PI
		} else if (randVal < this._width + this._height) { // generat pos from right
			x = this._width
			y = randVal - this._width
			direction = randRange(-0.4, 0.4) * Math.PI
		} else if (randVal < this._width * 2 + this._height) { // generate pos from bottom
			x = randVal - this._width - this._height
			y = this._height
			direction = randRange(0.1, 0.9) * Math.PI
		} else { // generate pos from left
			x = 0
			y = randVal - this._width * 2 - this._height
			direction = randRange(0.6, 1.4) * Math.PI
		}
		return { x: x, y: y, dir: direction }
	}
	//#endregion

	gameOver() {
		this.sound.stopAll()
		this.scene.stop("play")
		this.scene.stop("text")

		let acc = this._myShip._hits / this._myShip._wasted;
		if(isNaN(acc) || acc === Infinity) acc = 0;

		this.scene.launch("gameOver", {
			score: this._myShip.Score,
			paid: this._myShip._paid,
			accuracy: acc
		})
	}

	nextAsteroids() {
		const inc = this._level % 2 == 0 ? 0 : this._incrementAsteroids;
		this._startingAsteroids = Math.min((this._startingAsteroids + inc), this._maxAsteroids)
		for (let i = 0; i < this._startingAsteroids; i++) {
			// second enemies can be appeared from 2 levels
			const type = this._level === 1 ? ASTEROID_TYPE.FIRST : randRange(0, 1) >= 0.5 ? ASTEROID_TYPE.FIRST : ASTEROID_TYPE.SECOND
			const size = ASTEROID_SIZE.LARGE
			this.spawnRandomAsteroid(type, size)
		}
	}

	nextEnemies(enemyCount: number, _enemyType: string, lives: number) {
		if (_enemyType !== ENEMY_TYPE.NORMAL_BOTH) {
			for (let i = 0; i < enemyCount; i++) {
				this.spawnRandomEnemies(_enemyType, lives)
			}
		} else {
			this.spawnRandomEnemies(ENEMY_TYPE.NORMAL_FIRST, lives)
			this.spawnRandomEnemies(ENEMY_TYPE.NORMAL_SECOND, lives)
			for (let i = 0; i < enemyCount - 2; i++) {
				let enemyType = randRange(1, 3) >= 2 ? ENEMY_TYPE.NORMAL_SECOND : ENEMY_TYPE.NORMAL_FIRST
				this.spawnRandomEnemies(enemyType, lives)
			}
		}
	}

	nextLevel() {
		this._passedIntro = false
		this.time.removeEvent(this._levelTimer)
		this._readyNewLevel = false
		this._levelTimer = this.time.addEvent({
			delay: 2000,
			callback: () => {
				this._readyNewLevel = false
			},
		})
		this._level++
		this.registry.set('level', this._level)

		if (!this._bossMode && !((this._level >= 8 && this._level % 4 === 0))) this.nextAsteroids()

		// normal enemies can be appeared from level 3, they need to be disappear on level 8, 12, 16 ...  // darkhorse 3, 8, 4
		if (!this._bossMode && this._level >= 3 && !(this._level >= 8 && this._level % 4 === 0)) {
			const inc = this._level % 2 != 0 ? 0 : this._increaseEnemies;
			this._startingEnemies += inc;
			let enemyType = this._level >= 5 ? ENEMY_TYPE.NORMAL_BOTH : ENEMY_TYPE.NORMAL_FIRST
			this.nextEnemies(this._startingEnemies, enemyType, this._enemyLives)
		}

		if(this._bossMode) {
			this._startingBoss = Math.ceil(this._level / 2);
			let randVal = randRange(0, 1);
			let enemyType = randVal > 0.5 ? ENEMY_TYPE.BOSS_FIRST : ENEMY_TYPE.BOSS_SECOND;

			const reduceWeak = this._startingBoss % 2 == 0 ? -1 : 0;
			const addStrong = this._startingBoss % 2 == 0 ? 1 : 0;

			if(this._level % 2 == 0) {
				this.nextEnemies(Math.floor(this._startingBoss / 2) + reduceWeak, enemyType, this._bossLives);
			}
			else {
				this.nextEnemies(Math.ceil(this._startingBoss / 2), enemyType, this._bossLives);
			}

			randVal = randRange(0, 1)
			enemyType = randVal > 0.5 ? ENEMY_TYPE.BOSS_THIRD : ENEMY_TYPE.BOSS_FOURTH;

			if(this._level % 2 == 0) {
				this._bossLives += 1;
				this.nextEnemies(Math.ceil(this._startingBoss / 2) + addStrong, enemyType, this._bossLives);
			}
			else {
				this.nextEnemies(Math.floor(this._startingBoss / 2), enemyType, this._bossLives);
			}
		}
		else {
			// first boss enemies can be appeared on level 8, 12, 16 ...  // darkhorse 8
			if (this._level >= 8 && this._level % 4 === 0) {
				this._startingBoss = Math.ceil(this._levelBoss / 2);
				let randVal = randRange(0, 1);
				let enemyType = randVal > 0.5 ? ENEMY_TYPE.BOSS_FIRST : ENEMY_TYPE.BOSS_SECOND;
	
				const reduceWeak = this._startingBoss % 2 == 0 ? -1 : 0;
				const addStrong = this._startingBoss % 2 == 0 ? 1 : 0;
	
				if(this._levelBoss % 2 == 0) {
					this.nextEnemies(Math.floor(this._startingBoss / 2) + reduceWeak, enemyType, this._bossLives);
				}
				else {
					this.nextEnemies(Math.ceil(this._startingBoss / 2), enemyType, this._bossLives);
				}
	
				randVal = randRange(0, 1)
				enemyType = randVal > 0.5 ? ENEMY_TYPE.BOSS_THIRD : ENEMY_TYPE.BOSS_FOURTH;
	
				if(this._levelBoss % 2 == 0) {
					this._bossLives += 1;
					this.nextEnemies(Math.ceil(this._startingBoss / 2) + addStrong, enemyType, this._bossLives);
				}
				else {
					this.nextEnemies(Math.floor(this._startingBoss / 2), enemyType, this._bossLives);
				}

				this._levelBoss += 1;
			}
		}
	}

	introNewEnemy(enemyType: string) {
		let enemyCount = 1
		this.nextEnemies(enemyCount, enemyType, this._bossLives)
	}

	newMission() {
		if (this._level === 2 && !this._passedIntro) {
			this._passedIntro = true
			this.registry.set('newEnemy', 1)
			this.introNewEnemy(ENEMY_TYPE.NORMAL_FIRST)
			this._levelTimer = this.time.addEvent({
				delay: Config.gamePros.introNewEnemyDelay,
				callback: () => {
					this.registry.set('newEnemy', -1)
				},
			})
		} else if (this._level === 4 && !this._passedIntro) {
			this._passedIntro = true
			this.registry.set('newEnemy', 1)
			this.introNewEnemy(ENEMY_TYPE.NORMAL_SECOND)
			this._levelTimer = this.time.addEvent({
				delay: Config.gamePros.introNewEnemyDelay,
				callback: () => {
					this.registry.set('newEnemy', -1)
				},
			})
		} else {
			this.registry.set('endLevel', this._level)
			this.registry.set('newEnemy', -1)
			this._levelTimer = this.time.addEvent({
				delay: Config.gamePros.endLevelDelay,
				callback: () => {
					this._readyNewLevel = true;
					this.registry.set('endLevel', -1)
				},
			})
		}
	}

	update(time: number, delta: number) {
		this.physics.world.wrap(this._ships)
		this.physics.world.wrap(this._enemies);
		//@ts-ignore
		let enemyCount = this._enemies.children.entries.filter((entry) => (entry._group !== "enemyBullet")).length;
		if (enemyCount <= 0) {
			this.newMission()
		}
		if (enemyCount <= 0 && this._readyNewLevel === true) {
			this.changeEnvPerLevel();
			this.nextLevel();
		}
		if (this._myShip && this._network) this._myShip.updateToServer(this._network);

		if (this.input.keyboard.addKey(this._specialKey).isDown) {
			if (this._myShip._hasAtomic) {
				this.spawnRegionBullet(this._center.x, this._center.y, this, 'atomic')
				this._myShip._hasAtomic = false
				store.dispatch(setHasAtomic(false))
			}
		}
	}

	changeEnvPerLevel() {
		const bgImageRes = (this._level + this._firstBackImgRandom) % Config.graphicAssets.background.length;
		const nextBgImageRes = (this._level + this._firstBackImgRandom + 1) % Config.graphicAssets.background.length;
		const bgMusicRes = (this._level + this._firstBgRandom) % Config.soundAssets.bg.length;
		const nextBgMusicRes = (this._level + this._firstBgRandom + 1) % Config.graphicAssets.background.length;

		if(!this.textures.exists(`${nextBgImageRes}`)) {
			this.load.image(Config.graphicAssets.background[nextBgImageRes].name, Config.graphicAssets.background[nextBgImageRes].URL);
		}
		if(!this.sound.get(`${nextBgMusicRes}`)) {
			this.load.audio(Config.soundAssets.bg[nextBgMusicRes].name, Config.soundAssets.bg[nextBgMusicRes].URL)
		}
		this.load.start();

		if(this._level == 0) {
			return;
		}

		if((`${bgImageRes}` != this._backImg) && this._backgroundSprite && this.textures.exists(`${bgImageRes}`)) {
			this.cameras.main.once('camerafadeoutcomplete', function (camera) {
				camera.fadeIn(500);
			}, this);
			this.cameras.main.fadeOut(500);
			this.time.removeEvent(this._randomTimer)
			this._randomTimer = this.time.addEvent({
				delay: 500,
				callback: () => {
					this._backImg = `${bgImageRes}`;
					//sets up background
					this._backgroundSprite.setTexture(Config.graphicAssets.background[bgImageRes].name);
				},
			})
		}

		if((`${bgMusicRes}` != this._backBg) && this._bgSound && this.sound.get(`${bgMusicRes}`)) {
			this._bgSound.stop();
			this._bgSound.destroy();
			this._backBg = `${bgMusicRes}`;
			this._bgSound = this.sound.add(Config.soundAssets.bg[bgMusicRes].name);
			this._bgSound.setLoop(true);
			this._bgSound.play();
		}
	}
}

export default PlayScene
import { Event, phaserEvents } from '../../events/EventCenter'

class GunModule {

	_owner: any
	_scene: any

	_fireCooldown: number
	_passiveRegenCooldown: number
	_sinceFired: number
	_sinceRegen: number
	_storedBullets: number
	_maxBullets: number
	_speed: number
	_triggerHeld: boolean
	_triggered: boolean
	_isShip: boolean
	_isEnableSoundEffect: boolean
	_isFired: boolean

	/**
	 * @param {Phaser.GameObjects} owner - game object that owns the module
	 **/
	constructor(owner: any, maxBullets: number, fireCooldown: number, passiveRegenCooldown: number, speed: number) {
		this._owner = owner
		this._scene = owner.scene

		this._fireCooldown = fireCooldown * 1000 // Convert to milliseconds
		this._passiveRegenCooldown = passiveRegenCooldown * 1000
		this._speed = speed
		this._isEnableSoundEffect = this._scene.registry.get('enabledSound') === undefined ? true : this._scene.registry.get('enabledSound')
		this._isShip = maxBullets !== 999
		this._sinceFired = 0
		this._sinceRegen = 0
		this._storedBullets = maxBullets
		if (this._isShip && this._maxBullets !== 99)
			this._scene.registry.set("shots", this._storedBullets)
		this._maxBullets = maxBullets
		this._triggerHeld = false

		phaserEvents.on(Event.TOGGLE_SOUNDS, (value) => {
			this._isEnableSoundEffect = value
			this._scene.registry.set('enabledSound', value)
		}, this)

		if (this._isEnableSoundEffect === undefined) this._isEnableSoundEffect = true
	}

	update(time, delta) {
		this._sinceFired += delta
		this._sinceRegen += delta
		if (this._sinceRegen > this._passiveRegenCooldown && this._storedBullets < this._maxBullets) {
			this.reload()
			this._sinceRegen = 0
		}
	}

	updateBullet(maxBullets: number, fireCooldown: number, passiveRegenCooldown: number, speed: number) {
		if (maxBullets !== 0) this._maxBullets = maxBullets
		if (fireCooldown !== 0) this._fireCooldown = fireCooldown * 1000
		if (passiveRegenCooldown !== 0) this._passiveRegenCooldown = passiveRegenCooldown * 1000
		if (speed !== 0) this._speed = speed
		if (maxBullets === 99) this._scene.registry.values.shots = 99
		this.reload()
	}

	setTriggerHeld(isHeld) {
		this._triggered = isHeld
	}

	spendBullet() {
		this._storedBullets = Math.max(this._storedBullets - 1, 0)
		if (this._isShip && this._maxBullets !== 99)
			this._scene.registry.values.shots = this._storedBullets
	}

	reload() {
		this._storedBullets = Math.min(this._storedBullets + 1, this._maxBullets)
		if (this._isShip && this._maxBullets !== 99)
			this._scene.registry.values.shots = this._storedBullets
	}
}

export class StandardGun extends GunModule {
	update(time, delta) {
		super.update(time, delta);
		this._isFired = false;
		if (this._triggered && this.canFire()) {
			this.fire({ pos: this._owner.getCenter(), rotation: this._owner.rotForward, speed: this._speed });
			this._isFired = true;
		}		
	}

	fire({ pos: { x, y }, rotation, speed }) {
		this.spendBullet()
		if (this._scene._network) {
			//send data when bullet launched
			if(this._owner.team === undefined)
			{
					this._owner.team = 1;
			}
			this._scene.updateBulletLaunchDataToserver(x, y, rotation, speed, this._owner,this._owner.team);
			this._scene.spawnRandomBullet(x, y, rotation, speed , this._owner, true,this._owner.team)
		}
		else { this._scene.spawnRandomBullet(x, y, rotation, speed, this._owner, true) }

		if (this._isEnableSoundEffect) this._scene._bulletSound.play()
		this._sinceFired = 0
	}

	canFire() {
		// return true
		return this._storedBullets > 0 && this._sinceFired > this._fireCooldown
	}
}

export class EnemyGun extends GunModule {

	update(time, delta) {
		super.update(time, delta)
		if (this._triggered && this.canFire()) {
			this.fire({ pos: this._owner.getCenter(), rotation: this._owner.rotLeft, speed: this._speed })
		}
	}

	fire({ pos: { x, y }, rotation, speed }) {
		this.spendBullet()
		this._scene.spawnRandomEnemyBullet(x, y, rotation, speed, this._owner)
		if (this._isEnableSoundEffect) this._scene._bulletSound.play()
		this._sinceFired = 0
	}

	canFire() {
		return this._sinceFired > this._fireCooldown
	}
}
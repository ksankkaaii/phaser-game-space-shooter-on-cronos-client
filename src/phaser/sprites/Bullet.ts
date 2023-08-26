import { BULLET_NAME } from "./../../types/config/helper"
import Entity from "./Entity"
class Bullet extends Entity {
	_owner: any
	_bulletKind: string
	_timetemp = 0;
	constructor({ sargs, owner, kind }) {
		super(sargs)
		this._owner = owner
		this._bulletKind = kind

		this.setOrigin(0.5, 0.5)
		if (sargs.texture === BULLET_NAME.REGION_BULLET) {
			if (this._bulletKind === 'explosive') this.setCircle(100)
			else if (this._bulletKind === 'atomic') this.setSize(this.scene.cameras.main.width, this.scene.cameras.main.height)
			this.scene.time.addEvent({
				delay: 50,
				callback: () => {
					this.destroy()
				}
			})
		}
	}
	protected preUpdate(time: number, delta: number): void {
		
	}
	updateServerDataBullet(field: string, value: number | string | boolean,deltaTime:any) {
		switch (field) {
			case 'x':
				if (typeof value === 'number') {
					let tempValue=value + this.body.velocity.x * deltaTime;
					// this.x = Phaser.Math.Linear(this.x, tempValue, 0.2);
					this.x = value;//tempValue
				}
				break
	  
			case 'y':
				if (typeof value === 'number') {
					let tempValue=value + this.body.velocity.x * deltaTime;
					// this.y = Phaser.Math.Linear(this.y, tempValue, 0.2);
					this.y = value;//tempValue
				}
				break
			case 'speed_x':
					if (typeof value === 'number') {
					  this.setVelocityX(value); 
					}
			break
			case 'speed_y':
					if (typeof value === 'number') {
					  this.setVelocityY(value);
					}
			break
		}
	}
	updateServerDataChangesBullet(changes: any,deltaTimeFromServer:any) {
		const curTime = Date.now();    
		const serverTimeChange = changes.find((change: { field: string; }) => change.field === 'curServerTime')
		const serverTime = serverTimeChange.value
		if (serverTime < this._timetemp) return;
		const dt = (curTime - serverTime-deltaTimeFromServer)/1000.0;
		changes.map((change: { field: string; value: string | number | boolean; }) => {
		  this.updateServerDataBullet(change.field, change.value, dt)
		})
		this._timetemp = serverTime;
	  }
}

export default Bullet
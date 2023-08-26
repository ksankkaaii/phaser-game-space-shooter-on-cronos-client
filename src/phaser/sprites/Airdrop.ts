/*jshint esversion: 6 */
import Entity from "./Entity"
import { randRange } from "./../../types/config/helper"

class Airdrop extends Entity {
  _kind: string
  _owner: any
  constructor({ sargs, owner, kind }) {
    super(sargs)
    this._owner = owner
    this._kind = kind
  }

  /** Launches this asteroid in the specified direction at the specified speed.
   * 
   * @param {number} speed - velocity of asteroid.
   * @param {number} direction - (radians) main direction of launch.
   * @param {number} dirRandom - (radians) adds randomness to direction.
   * @param {number} angVelRange - specifies range within which the angular velocity will be.
  */
  launchAirdrop(speed, direction, dirRandom = 0, angVelRange = 30) {
    let dirx = randRange(direction - dirRandom, direction + dirRandom)
    let diry = randRange(direction - dirRandom, direction + dirRandom)
    let vx = speed * Math.cos(dirx)
    let vy = speed * Math.sin(diry)
    this.setOrigin(0.5, 0.5)
    this.setVelocity(vx, vy)
    this.setAngularVelocity(randRange(-angVelRange, angVelRange))
  }
  
  updateServerDataAirdrop(field: string, value: number | string | boolean) {
		switch (field) {
			case 'x':
				if (typeof value === 'number') {
					// this.x = Phaser.Math.Linear(this.x, value, 0.2);
          this.x = value     
				}
				break	  
			case 'y':
				if (typeof value === 'number') {
					// this.y = Phaser.Math.Linear(this.y, value, 0.2);
          this.y = value
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
}

export default Airdrop
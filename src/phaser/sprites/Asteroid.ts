/*jshint esversion: 6 */
import Entity from "./Entity"
import { randRange, ASTEROID_SIZE } from "./../../types/config/helper"

class Asteroid extends Entity {
  
  _type: string
  _size: string
  _lives = 2
  _group = 'asteroid'
  _timetemp = 0;
  //for server update

  constructor({ sargs, type, size }) {
    super(sargs)
    this._type = type
    this._size = size
  }

  /** Launches this asteroid in the specified direction at the specified speed.
   * 
   * @param {number} speed - velocity of asteroid.
   * @param {number} direction - (radians) main direction of launch.
   * @param {number} dirRandom - (radians) adds randomness to direction.
   * @param {number} angVelRange - specifies range within which the angular velocity will be.
  */
  launchAsteroid(speed, direction, dirRandom = 0, angVelRange = 50) {
    let dirx = randRange(direction - dirRandom, direction + dirRandom)
    let diry = randRange(direction - dirRandom, direction + dirRandom)
    let vx = speed * Math.cos(direction)
    let vy = speed * Math.sin(direction)
    this.setOrigin(0.5, 0.5)
    if (this._size === ASTEROID_SIZE.LARGE) this.setCircle(29)
    if (this._size === ASTEROID_SIZE.SMALL) this.setCircle(19)
    this.setVelocity(vx, vy)
    this.setAngularVelocity(randRange(-angVelRange, angVelRange))
  }

  updateServerDataAsteroid(field: string, value: number | string | boolean, deltaTime: number) {
		switch (field) {
			case 'x':
				if (typeof value === 'number') {
				if (deltaTime > 1 || deltaTime <-1)
				    break;
				//if ((value - this.x) > 40 || (value - this.x) < -40)
                    this.x = value;// + this.body.velocity.x * deltaTime;
				}
				break
			case 'y':
				if (typeof value === 'number') {
				if (deltaTime > 1 || deltaTime <-1)
				    break;
				//if ((value - this.y) > 40 || (value - this.y) < -40)
                    this.y = value;// + this.body.velocity.y * deltaTime;
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

  updateServerDataChangesAsteroid(changes: any, deltaTimeFromServer: any) {
    const curTime = Date.now(); 
    const serverTimeChange = changes.find((change: { field: string }) => change.field === 'curServerTime')
    const serverTime = serverTimeChange?.value
    if (serverTime < this._timetemp) return;
    const dt = (curTime - serverTime - deltaTimeFromServer) / 1000.0;
    changes.map((change: { field: string; value: string | number | boolean }) => {
      this.updateServerDataAsteroid(change.field, change.value, dt)
    })
    this._timetemp = serverTime;
  }
}


export default Asteroid
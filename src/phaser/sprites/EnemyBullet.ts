import Entity from "./Entity";

class EnemyBullet extends Entity {

  _owner: any
  _group = 'enemyBullet'

  constructor({ sargs, owner }) {
    super(sargs)

    this._owner = owner
    this.setOrigin(0.5, 0.5)
  }
}

export default EnemyBullet
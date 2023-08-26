import Phaser from 'phaser'

import Config from './../../types/config/config'
import store from '../../stores'
import { setGameOver, setCanPlayAgain, setIsGameOVerScene } from '../../stores/UserStore'
import { setBulletDuration, setHasAtomic, setShieldDuration } from '../../stores/PhaserStore'

import { phaserEvents, Event } from '../../events/EventCenter'
import isPortrait from 'events/detectOrientation'

class GameOver extends Phaser.Scene {

  _contentText: any
  _mainMenuButton: any
  _playAgainButton: any
  _tokenRewarded: boolean
  _canPlay: boolean
  _shipDamaged: boolean

  constructor() {
    super('gameOver');
    this._tokenRewarded = false
    this._canPlay = false
    this._shipDamaged = false
  }

  create(data: { score: number, paid: boolean, accuracy: number }) {
    if(window.innerWidth < 1024 && isPortrait()) {
			this.cameras.main.setAngle(90)
		}
    
    store.dispatch(setGameOver(true));
    store.dispatch(setIsGameOVerScene(true));
    store.dispatch(setBulletDuration(0));
    store.dispatch(setHasAtomic(false));
    store.dispatch(setShieldDuration(0));
    
    Config.fontAssets.gameoverFontStyle.fontSize = '50px'
    let title = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'GAME OVER', Config.fontAssets.gameoverFontStyle)
    title.setOrigin(0.5)

    Config.fontAssets.gameoverFontStyle.fontSize = '24px'

    this._contentText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, ``, Config.fontAssets.gameoverFontStyle)
    this._contentText.setOrigin(0.5)
    if (data.score !== 0){
      if(data?.paid) {
        this._contentText.setText(`You have reached a score of ${data.score}. \n Sending ${Math.round((data.score * data.accuracy))} $CROSMO to rewards balance...`)
      }
      else {
        this._contentText.setText(`You have reached a score of ${data.score}.`)
      }
    }
    else {
      this._contentText.setText(`You did not get any score`)
    } 

    // await delayTime(2000);

    this._mainMenuButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 70, '', Config.fontAssets.gameoverFontStyle)
    this._mainMenuButton.setOrigin(0.5)
    this._mainMenuButton.setInteractive();
    this._mainMenuButton.on("pointerdown", () => { this._mainMenuButton.setColor("#4c1a03"); });
    this._mainMenuButton.on("pointerup", () => { this._mainMenuButton.setColor("#ff601a"); this.gotoMenu(); });

    this._playAgainButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 120, '', Config.fontAssets.gameoverFontStyle)
    this._playAgainButton.setOrigin(0.5)
    this._playAgainButton.setInteractive();
    this._playAgainButton.on("pointerdown", () => { this._playAgainButton.setColor("#4c1a03"); });
    this._playAgainButton.on("pointerup", () => { this._playAgainButton.setColor("#ff601a"); this.playAgain(); });

    phaserEvents.on(Event.TOKEN_REWARDED, () => {
      console.log(`can TOKEN_REWARDED listend`)
      this._tokenRewarded = true
    }, this)

    phaserEvents.on(Event.CAN_PLAY, () => {
      console.log(`can play listend`)
      this._contentText.setText(`Score: ${data.score}`);
      this._mainMenuButton.setText('Main Menu')
      this._playAgainButton.setText('Play Again')
      this._canPlay = true;
    }, this)

    phaserEvents.on(Event.SHIP_DAMAGED, () => {
      console.log(`can SHIP_DAMAGED listend`)
      this._contentText.setText('Your ship is damaged.')
      this._mainMenuButton.setText('Main Menu')
      this._shipDamaged = true
    }, this)

    phaserEvents.on(Event.PLAY_AGAIN, () => {
      this.startGame()
    })
  }

  gotoMenu() {
    // this.scene.stop('gameOver')
    // phaserEvents.emit(Event.GOTO_MAINMENU)
    // darkhorse
    window.location.href = "/"
  }

  playAgain() {
    store.dispatch(setCanPlayAgain(true));
    store.dispatch(setIsGameOVerScene(false));
  }

  startGame() {
    console.log(`start game`);
    this._canPlay = false;
    store.dispatch(setIsGameOVerScene(false));
    this.scene.start('play')
  }

}

export default GameOver

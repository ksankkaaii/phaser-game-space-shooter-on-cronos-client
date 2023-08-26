import Phaser from "phaser"

import BootScene from './scenes/BootScene'
import PlayScene from './scenes/PlayScene'
import MultiplayerScene from './scenes/MultiplayerScene'
import TextScene from './scenes/TextScene'
import GameOver from './scenes/GameOver'

import isPortrait from "./../events/detectOrientation";

let oppositeOrientation = isPortrait();

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  backgroundColor: 'black',
  pixelArt: false, 
 
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width : oppositeOrientation ?  window.innerWidth  / (window.innerHeight / 1920):1920,
    height:  oppositeOrientation ? 1920:1080,
  },
  fps: {
    // Defaults:
    deltaHistory: 10,
    panicMax: 120,
    smoothStep: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  autoFocus: true,
  scene: [BootScene, PlayScene, MultiplayerScene, TextScene, GameOver],
}

const phaserGame = new Phaser.Game(config); 
(window as any).game = phaserGame

export default phaserGame

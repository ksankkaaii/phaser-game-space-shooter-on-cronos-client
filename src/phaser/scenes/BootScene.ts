import Phaser from 'phaser'
import WebFont from 'webfontloader'

import store from '../../stores'
import { setRoomJoined, setResourcesLoaded } from '../../stores/RoomStore'

import Network from '../../services/Network'
import Config from './../../types/config/config'

class BootScene extends Phaser.Scene {

	_txtIntro: Phaser.GameObjects.Text
	_network!: Network

	constructor() {
		super('boot')
	}

	init() {
		//  Inject our CSS
		var element = document.createElement('style');

		document.head.appendChild(element);

		var sheet = element.sheet;

		var styles = '@font-face { font-family: "Fast Hand"; src: url("assets/fonts/Fast_Hand.otf") format("opentype"); }'
		sheet.insertRule(styles, 0);

		Config.gamePros.screenWidth = this.cameras.main.width
		Config.gamePros.screenHeight = this.cameras.main.height

		this._network = new Network();
	}

	preload() {
		this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

		WebFont.load({
			custom: {
				families: ['Fast Hand']
			},
		})

		// let joystick_url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        // this.load.plugin('rexvirtualjoystickplugin', joystick_url, true);

		/**
		CrosmoCrafts assets
		 */
		Config.graphicAssets.shipsTypes.forEach((name)=>{
			this.load.image(name, Config.graphicAssets.shipUrl+name+'.png')
		});
		this.load.image(Config.graphicAssets.bulletNormal.name, Config.graphicAssets.bulletNormal.URL)
		this.load.image(Config.graphicAssets.bulletUnlimited.name, Config.graphicAssets.bulletUnlimited.URL)
		this.load.image(Config.graphicAssets.bulletDouble.name, Config.graphicAssets.bulletDouble.URL)
		this.load.image(Config.graphicAssets.bulletTriple.name, Config.graphicAssets.bulletTriple.URL)
		this.load.image(Config.graphicAssets.bulletVolley.name, Config.graphicAssets.bulletVolley.URL)
		this.load.image(Config.graphicAssets.bulletLazer.name, Config.graphicAssets.bulletLazer.URL)
		this.load.image(Config.graphicAssets.bulletExplose.name, Config.graphicAssets.bulletExplose.URL)
		this.load.image(Config.graphicAssets.bulletRegion.name, Config.graphicAssets.bulletRegion.URL)
		this.load.image(Config.graphicAssets.bulletAtomic.name, Config.graphicAssets.bulletAtomic.URL)

		this.load.image(Config.graphicAssets.asteroidFirstL.name, Config.graphicAssets.asteroidFirstL.URL)
		this.load.image(Config.graphicAssets.asteroidFirstS.name, Config.graphicAssets.asteroidFirstS.URL)
		this.load.image(Config.graphicAssets.asteroidSecondL.name, Config.graphicAssets.asteroidSecondL.URL)
		this.load.image(Config.graphicAssets.asteroidSecondS.name, Config.graphicAssets.asteroidSecondS.URL)

		this.load.image(Config.graphicAssets.airdropRapid.name, Config.graphicAssets.airdropRapid.URL)
		this.load.image(Config.graphicAssets.airdropDouble.name, Config.graphicAssets.airdropDouble.URL)
		this.load.image(Config.graphicAssets.airdropTriple.name, Config.graphicAssets.airdropTriple.URL)
		this.load.image(Config.graphicAssets.airdropBurst.name, Config.graphicAssets.airdropBurst.URL)
		this.load.image(Config.graphicAssets.airdropExplosive.name, Config.graphicAssets.airdropExplosive.URL)
		this.load.image(Config.graphicAssets.airdropLazer.name, Config.graphicAssets.airdropLazer.URL)
		this.load.image(Config.graphicAssets.airdropRocket.name, Config.graphicAssets.airdropRocket.URL)
		this.load.image(Config.graphicAssets.airdropLife.name, Config.graphicAssets.airdropLife.URL)
		this.load.image(Config.graphicAssets.airdropShield.name, Config.graphicAssets.airdropShield.URL)

		this.load.image(Config.graphicAssets.enemyFirst.name, Config.graphicAssets.enemyFirst.URL)
		this.load.image(Config.graphicAssets.enemySecond.name, Config.graphicAssets.enemySecond.URL)
		this.load.image(Config.graphicAssets.enemyBullet.name, Config.graphicAssets.enemyBullet.URL)
		this.load.image(Config.graphicAssets.rocketFirst.name, Config.graphicAssets.rocketFirst.URL)
		this.load.image(Config.graphicAssets.rocketSecond.name, Config.graphicAssets.rocketSecond.URL)
		this.load.image(Config.graphicAssets.rocketThird.name, Config.graphicAssets.rocketThird.URL)
		this.load.image(Config.graphicAssets.rocketFourth.name, Config.graphicAssets.rocketFourth.URL)
		this.load.image(Config.graphicAssets.rocketBullet.name, Config.graphicAssets.rocketBullet.URL)

		this.load.image(Config.graphicAssets.lifeEmpty.name, Config.graphicAssets.lifeEmpty.URL)
		this.load.image(Config.graphicAssets.lifeFull.name, Config.graphicAssets.lifeFull.URL)

		this.load.image(Config.graphicAssets.background[0].name, Config.graphicAssets.background[0].URL)
		// for(let i = 0; i < Config.graphicAssets.background.length; i++) {
		// 	this.load.image(Config.graphicAssets.background[i].name, Config.graphicAssets.background[i].URL)
		// }

		this.load.atlas(Config.graphicAssets.particles.name, Config.graphicAssets.particles.URL, Config.graphicAssets.particles.data)
		this.load.atlas(Config.graphicAssets.lazerEffectParticle.name, Config.graphicAssets.lazerEffectParticle.URL, Config.graphicAssets.lazerEffectParticle.data)
		this.load.image(Config.graphicAssets.shield.name, Config.graphicAssets.shield.URL)
		
		this.load.audio(Config.soundAssets.bg[0].name, Config.soundAssets.bg[0].URL)
		// for(let i = 0; i < Config.soundAssets.bg.length; i++) {
		// 	this.load.audio(Config.soundAssets.bg[i].name, Config.soundAssets.bg[i].URL)
		// }

		this.load.audio(Config.soundAssets.destroyed.name, Config.soundAssets.destroyed.URL)
		this.load.audio(Config.soundAssets.fire.name, Config.soundAssets.fire.URL)
		this.load.audio(Config.soundAssets.engine.name, Config.soundAssets.engine.URL)
		this.load.audio(Config.soundAssets.shipExplose.name, Config.soundAssets.shipExplose.URL)
		
		this.load.once('complete', () => {
			store.dispatch(setResourcesLoaded(true));
		}, this)
	}

	startGame(shipPros: any, gameProps: any) {
		this.scene.stop('boot')
		this.scene.start('play', {
			network: this._network,
			shipPros: shipPros,
			gameProps: gameProps
		})	
		store.dispatch(setRoomJoined(true))
	}
	startMultiGame(shipPros: any, gameProps: any) {
		this.scene.stop('boot')
		this.scene.start('multiplay', {
			network: this._network,
			shipPros: shipPros,
			gameProps: gameProps,
		})
		store.dispatch(setRoomJoined(true))
		if (this._network) {
			this._network.readyToConnect();
			this._network.changeName('1');

		}
	}
}

export default BootScene

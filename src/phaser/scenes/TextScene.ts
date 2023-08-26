/*jshint esversion: 6 */
import Phaser from "phaser"
import Config from './../../types/config/config';

import isPortrait from "././../../events/detectOrientation";

class TextScene extends Phaser.Scene {

    _scoreLabel: any
    _scoreText: any
    _levelLabel: any
    _levelText: any
    _shotLabel: any
    _shotText: any
    _accLabel: any
    _accText: any
    _endLevel: any
    _newEnemy: any

    _lives: any
    _startingLives: number
    _bonusLives: number
    _width: number
    _height: number

    _level: any

    constructor() {
        super("text")
    }

    _updateSceneOrientation(orientation){
		let oppositeOrientation = isPortrait();

		Config.gamePros.screenWidth = oppositeOrientation ?  window.innerWidth  / (window.innerHeight / 1920):1920;
		Config.gamePros.screenHeight = oppositeOrientation ? 1920:1080;
		this._width = Config.gamePros.screenWidth;
		this._height = Config.gamePros.screenHeight;
		this.scale.setGameSize(this._width, this._height);

        this._endLevel.destroy(true);
        this._newEnemy.destroy(true);
        this._scoreLabel.destroy(true);
        this._scoreText.destroy(true);
        this._levelLabel.destroy(true);
        this._levelText.destroy(true);
        this._shotLabel.destroy(true);
        this._shotText.destroy(true);
        this._accLabel.destroy(true);
        this._accText.destroy(true);
        
        let leftTopX = 0;
        let leftTop = 0;
        let rightTopX = this._width;
        let rightTop = 0;
        let rightBottomX = this._width;
        let rightBottomY = this._height;

        if(window.innerWidth < 1024 && isPortrait()) {
            this.cameras.main.setAngle(90);
            leftTopX = -1 * ((this._height / 2) - (this._width / 2));
            leftTop = (this._height / 2) - (this._width / 2);
            rightTopX = (this._width / 2) + (this._height / 2);
            rightTop = (this._height / 2) - (this._width / 2);
            rightBottomX = (this._width / 2) + (this._height / 2);
            rightBottomY = (this._width / 2) + (this._height / 2);
		}
        else {
            this.cameras.main.setAngle(0);
        }

        this._scoreLabel = this.add.text(leftTopX + 16, leftTop + 16, "Score:", Config.fontAssets.scoreLabel)
        this._scoreText = this.add.text(leftTopX + 132, leftTop + 16, "0", Config.fontAssets.scoreText)

        this._levelLabel = this.add.text(leftTopX + 16, leftTop + 48, "Level:", Config.fontAssets.levelLabel)
        this._levelText = this.add.text(leftTopX + 132, leftTop + 48, this._level, Config.fontAssets.levelText)

        this._shotLabel = this.add.text(rightBottomX - 155, rightBottomY - 45, "Shots:", Config.fontAssets.scoreLabel)
        this._shotText = this.add.text(rightBottomX - 16, rightBottomY - 16, this.registry.values.shots, Config.fontAssets.scoreText)
        this._shotText.setOrigin(1, 1)

        this._accLabel = this.add.text(rightBottomX - 155, rightBottomY - 66, "Acc:", Config.fontAssets.levelLabel)
        this._accText = this.add.text(rightBottomX - 32, rightBottomY - 48, `${this.registry.values.accuracy || 0} %`, Config.fontAssets.levelText)
        this._accText.setOrigin(1, 1)

        this._lives.forEach(live => {
            live.destroy(true);
        });

        this.setLives()

        // Clear listener or an exception is throw on game restart
        this.events.on("shutdown", () => this.registry.events.removeListener("changedata", this.updateData, this), this)
        this.registry.events.on("changedata", this.updateData, this)

	}

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

		Config.gamePros.screenWidth = oppositeOrientation ?  window.innerWidth  / (window.innerHeight / 1920):1920;
		Config.gamePros.screenHeight = oppositeOrientation ? 1920:1080;
		this._width = Config.gamePros.screenWidth;
		this._height = Config.gamePros.screenHeight;
		this.scale.setGameSize(this._width, this._height);
        
        this._startingLives = Config.shipPros.startingLives + this.registry.values.bonusLives
        this._bonusLives = 0;
        if(Array.isArray(this._lives)) {
            this._lives.forEach(live => {
                live.destroy(true);
            });
        }
        this._lives = [];

        if(window.innerWidth < 1024 && isPortrait()) {
			this.cameras.main.setAngle(90);
		}
    }

    create(data: { level: string }) {
        this._endLevel = this.add.text(this._width / 2, this._height / 2 - 50, "", Config.fontAssets.endLevel)
        this._endLevel.setOrigin(0.5)
        this._newEnemy = this.add.text(this._width / 2, this._height / 2 - 50, "", Config.fontAssets.endLevel)
        this._newEnemy.setOrigin(0.5);

        let leftTopX = 0;
        let leftTop = 0;
        let rightTopX = this._width;
        let rightTop = 0;
        let rightBottomX = this._width;
        let rightBottomY = this._height;

        if(window.innerWidth < 1024 && isPortrait()) {
            leftTopX = -1 * ((this._height / 2) - (this._width / 2));
            leftTop = (this._height / 2) - (this._width / 2);
            rightTopX = (this._width / 2) + (this._height / 2);
            rightTop = (this._height / 2) - (this._width / 2);
            rightBottomX = (this._width / 2) + (this._height / 2);
            rightBottomY = (this._width / 2) + (this._height / 2);
		}

        this._scoreLabel = this.add.text(leftTopX + 16, leftTop + 16, "Score:", Config.fontAssets.scoreLabel)
        this._scoreText = this.add.text(leftTopX + 132, leftTop + 16, "0", Config.fontAssets.scoreText)

        this._levelLabel = this.add.text(leftTopX + 16, leftTop + 48, "Level:", Config.fontAssets.levelLabel)
        this._levelText = this.add.text(leftTopX + 132, leftTop + 48, data.level, Config.fontAssets.levelText)

        this._level = data.level;

        this._shotLabel = this.add.text(rightBottomX - 155, rightBottomY - 45, "Shots:", Config.fontAssets.scoreLabel)
        this._shotText = this.add.text(rightBottomX - 16, rightBottomY - 16, this.registry.values.shots, Config.fontAssets.scoreText)
        this._shotText.setOrigin(1, 1)

        this._accLabel = this.add.text(rightBottomX - 155, rightBottomY - 66, "Acc:", Config.fontAssets.levelLabel)
        this._accText = this.add.text(rightBottomX - 32, rightBottomY - 48, `${this.registry.values.accuracy || 0} %`, Config.fontAssets.levelText)
        this._accText.setOrigin(1, 1)

        this.setLives()

        // Clear listener or an exception is throw on game restart
        this.events.on("shutdown", () => this.registry.events.removeListener("changedata", this.updateData, this), this)
        this.registry.events.on("changedata", this.updateData, this)
    }

    updateData(parent, key, data) {
        if (key === "score") {
            this._scoreText.setText(data)
        } else if (key === "level") {
            this._levelText.setText(data)
            this.setLives()
        } else if (key === "playerLives") {
            this.setLives()
        } else if (key === "shots") {
            if (data > 90) this._shotText.setText('∞')
            else this._shotText.setText(data)
        } else if (key === "accuracy") {
            this._accText.setText(`${data} %`)
        } else if (key === "endLevel") {
            if (data === -1) this._endLevel.setText("")
            else if (data === 0) this._endLevel.setText(`Enjoy The Game!`)
            else this._endLevel.setText(`Level ${data} completed`)
        } else if (key === "newEnemy") {
            if (data === -1) this._newEnemy.setText("")
            else this._newEnemy.setText('A new kind of enemy appears')
        }
    }

    setLives() {
        let rightTopX = this._width;
        let rightTopY = 0;

        if(window.innerWidth < 1024 && isPortrait()) {
            rightTopX = (this._width / 2) + (this._height / 2);
            rightTopY = (this._height / 2) - (this._width / 2);
		}

        if(Array.isArray(this._lives)) {
            this._lives.forEach(live => {
                live.destroy(true);
            });
        }
        this._lives = [];
        let baseX = this._width;

        for (let i = 0; i < this._startingLives; i++) {
            let img;
            if(i < (this._startingLives - this.registry.values.playerLives)) {
                img = this.add.image(rightTopX - 32 - i * (32 + 8), rightTopY + 35, Config.graphicAssets.lifeEmpty.name);
            }
            else {
                img = this.add.image(rightTopX - 32 - i * (32 + 8), rightTopY + 35, Config.graphicAssets.lifeFull.name)
            }
            this._lives.push(img)
        }
    }
}

export default TextScene
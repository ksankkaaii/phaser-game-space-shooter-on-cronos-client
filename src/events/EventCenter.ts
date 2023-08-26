import Phaser from 'phaser'

export const phaserEvents = new Phaser.Events.EventEmitter()

export enum Event {

	PLAYER_JOINED = 'player-joined',
	PLAYER_UPDATED = 'player-updated',
	PLAYER_LEFT = 'player-left',
	PLAYER_DISCONNECTED = 'player-disconnected',
	MY_PLAYER_READY = 'my-player-ready',
	MY_PLAYER_NAME_CHANGE = 'my-player-name-change',
	MY_PLAYER_TEXTURE_CHANGE = 'my-player-texture-change',
	ITEM_USER_ADDED = 'item-user-added',
	ITEM_USER_REMOVED = 'item-user-removed',
	TOKEN_REWARDED = 'token-rewarded',
	CAN_PLAY = 'can-play',
	SHIP_DAMAGED = 'ship-damaged',
	GOTO_MAINMENU = 'goto-mainmenu',
	TOGGLE_SOUNDS = 'toggle-sounds',
	EXIST_GAME = 'exit-game',
	PLAY_AGAIN = 'play-again',
	BULLET_UPDATED = 'bullet-updated',
	BULLET_CREATED = 'bullet-created',
	BULLET_REMOVED = 'bullet-removed',

	ASTEROID_UPDATED = 'asteroid-updated',
	ASTEROID_CREATED = 'asteroid-created',
	ASTEROID_REMOVED = 'asteroid-removed',
	ASTEROID_SPLIT = 'asteroid-split',
	
	AIRDROP_UPDATED = 'airdrop-updated',
	AIRDROP_CREATED = 'airdrop-created',
	AIRDROP_REMOVED = 'airdrop-removed',
	
	COLLISION_PLAYER_BULLET = 'collision-player-bullet',
	COLLISION_PLAYER_ASTEROID = 'collision-player-asteroid',
	COLLISION_BULLET_ASTEROID = 'collision-bullet-asteroid',
	COLLISION_PLAYER_AIRDROP = 'collision-player-airdrop',

	ASTEROID_CHANGES_UPDATED = 'asteroid-changes-updated',
	GAME_TIMEOUT = 'game-timeout',
	
}

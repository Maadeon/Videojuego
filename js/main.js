var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gamediv');

var background;
var player1;
var player2;

var mainState = {
	preload:function(){
	game.load.image('background', "assets/bosque.jpg");
	game.load.image('player1', "monitos/sprite-babymario.png");
	game.load.image('player2', "monitos/sprite-babyluigi.png");
	},

	create:function(){
	background = game.add.tileSprite(0,0,800,600,'background');
	
	player1 = game.add.sprite(game.world.centerX - 400,game.world.centerY -40, 'player1');
	game.physics.enable(player1,Phaser.Physics.ARCADE);
	player1.body.collideWorldBounds = true;

	player2 = game.add.sprite(game.world.centerX - 400,game.world.centerY + 400, 'player2');
	game.physics.enable(player2,Phaser.Physics.ARCADE);
	player2.body.collideWorldBounds = true;
	},
		
	update:function(){
	background.tilePosition.x-= 3.5;
	}

}

game.state.add('mainState', mainState);
game.state.start('mainState');
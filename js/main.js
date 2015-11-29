var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
// variables en general
var background;

var player1;
var player2;
var heart1;
var heart2;

var jumpButton1;
var RightButton1;
var LeftButton1;

var RestartButton;

var enemies1;
var enemies1velocity = -400;
var enemies2;
var enemies2velocity = -400;
var enemyRate = 1000;
var enemyTimer = 0;

var plataforma;
var plataforma2;

var coins1;
var coins1velocity = -400;
var coins2;
var coins2velocity = -400;
var coinRate = 1200;
var coinTimer = 0;

var score1 = 0;
var score2 = 0;

var vidas1 = 3;
var vidas2 = 3;

var gameover = -1;
var kirby;

var mainState = {
	//el preload es donde se cargan las imagenes antes del juego
	preload:function(){
	game.load.image('background', "assets/bosque.jpg");
	game.load.spritesheet('heart', 'monitos/heart.png', 50, 50, 2);
	game.load.spritesheet('gallina', 'monitos/sprite_gallina.png', 50, 50, 2);
	game.load.spritesheet('gallina2', 'monitos/sprite_gallinacafe.png', 50, 50, 2)
	game.load.image('plataforma', "assets/plataformaB.png");
	game.load.spritesheet('bat', "monitos/bat.png", 50, 50, 2);
	game.load.spritesheet("coin", "monitos/coinsmall.png", 32, 32, 6);

	game.load.audio('done', 'assets/musica/Done.mp3');
	game.load.audio('smack', 'assets/musica/smack.mp3');
	game.load.audio('coin', 'assets/musica/coin.mp3');
	},
	//el create es donde decidimos que sale en la pantalla
	create:function(){
	vidas1 = 3;
	vidas2 = 3;
	kirby = game.add.audio('done');
	hit = game.add.audio('smack');
	coinSound = game.add.audio('coin');

	background = game.add.tileSprite(0,0,800,600,'background');
	score1Text = game.add.text(10, 10,"Score: 0", {
		fill:"white"
	});
	vidas1Text = game.add.text(135, 10,"     x 3", {
		fill:"white"
	});
	score2Text = game.add.text(10, 325,"Score: 0", {
		fill:"white"
	});
	vidas2Text = game.add.text(135, 325,"     x 3", {
		fill:"white"
	});
	//Funcion predeterminada para las "arrow keys"
	cursors = game.input.keyboard.createCursorKeys();
	//gravedad que afecta a los jugadores en los ejes X y Y

	//var enemiesgroup1 = game.add.group();
	enemies1 = this.add.physicsGroup();
	enemies1.setAll('checkWorldBounds', true);
	enemies1.setAll('onOutOfBoundsKill', true);
	//enemiesgroup1.add(enemies1);

	enemies2 = this.add.physicsGroup();
	enemies2.setAll('checkWorldBounds', true);
	enemies2.setAll('onOutOfBoundsKill', true);

	coins1 = this.add.physicsGroup();
	coins1.setAll('checkWorldBounds', true);
	coins1.setAll('onOutOfBoundsKill', true);

	coins2 = this.add.physicsGroup();
	coins2.setAll('checkWorldBounds', true);
	coins2.setAll('onOutOfBoundsKill', true);
	
	//creacion del jugador y establecimiento de las funciones de fisica y donde aparecen en la pantalla
	heart1 = game.add.sprite(game.world.centerX - 265,game.world.centerY -292, 'heart');
	heart2 = game.add.sprite(game.world.centerX - 265,game.world.centerY - -22, 'heart');
	player1 = game.add.sprite(game.world.centerX - 400,game.world.centerY -65, 'gallina');
	player1.animations.add('fly', [0, 1]);
	player1.animations.play('fly', 10, true);
	game.physics.enable(player1,Phaser.Physics.ARCADE);
	player1.body.collideWorldBounds = true;
	player1.body.gravity.x = -10000;
	player1.body.gravity.y = 10000;

	player2 = game.add.sprite(game.world.centerX - 400,game.world.centerY + 225, 'gallina2');
	player2.animations.add('fly', [0, 1]);
	player2.animations.play('fly', 10, true);
	game.physics.enable(player2,Phaser.Physics.ARCADE);
	player2.body.collideWorldBounds = true;
	player2.body.gravity.x = -10000;
	player2.body.gravity.y = 10000;
	
	//DANGER!!!! NO MOVER, TOCAR, CAMBIAR, NADA, OSEA NADA 
	plataforma = this.add.physicsGroup();
	for(var k = -25; k< 800; k+=100){
	plataforma.create(k, 290, 'plataforma');
	}
	
	plataforma.setAll('body.allowGravity', false);
	plataforma.setAll('body.immovable', true);

	plataforma2 = this.add.physicsGroup();
	for(var k = -25; k< 800; k+=100){
	plataforma2.create(k, 575, 'plataforma');
	}
	
	plataforma2.setAll('body.allowGravity', false);
	plataforma2.setAll('body.immovable', true);
	//HASTA ACA!!!! TODO LO DE EN MEDIO

	//Debido a que las letras del teclado no estan predeterminadas se deben seleccionar una a la vez
	jumpButton1 = game.input.keyboard.addKey(Phaser.Keyboard.W);
	RightButton1 = game.input.keyboard.addKey(Phaser.Keyboard.D);
	LeftButton1 = game.input.keyboard.addKey(Phaser.Keyboard.A);

	RestartButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);         

	},
	//el update es donde se establece que sucede cuando el usuario realiza algo
	update:function(){
		//Permite que el fondo sea "scrolling"
		background.autoScroll(-350, 0);
		//Indica que cuando este en reposo el jugador no se mueva
		player1.body.velocity.y = 0;
		player1.body.velocity.x = 0;
		player2.body.velocity.y = 0;
		player2.body.velocity.x = 0;

		enemies1.setAll('body.velocity.x', enemies1velocity);
		enemies2.setAll('body.velocity.x', enemies2velocity);
		coins1.setAll('body.velocity.x', coins1velocity);
		coins2.setAll('body.velocity.x', coins2velocity);

		//NO TOCAR, Es lo que no permite a los jugadores cruzarse
		this.physics.arcade.collide(player1, plataforma, this.setFriction, null, this);
		this.physics.arcade.collide(player2, plataforma, this.setFriction, null, this);
		this.physics.arcade.collide(player2, plataforma2, this.setFriction, null, this);
		//Llama la funcion para cuando se choca con el enemigo
		this.physics.arcade.overlap(player1, enemies1, enemyHit1, null, this);
		this.physics.arcade.overlap(player2, enemies2, enemyHit2, null, this);

		this.physics.arcade.overlap(player1, coins1, coinHit1, null, this);
		this.physics.arcade.overlap(player2, coins2, coinHit2, null, this);
		
		//Main Menu/Start
		if(gameover==-1)
		{
			score1Text.visible = false;
			score2Text.visible = false;
			vidas1Text.visible = false;
			vidas2Text.visible = false;  
			Start();
			if(RestartButton.isDown)
			{
				shutdown();
				game.state.restart();
			}
		}
		//movimientos del jugador 1
		if(jumpButton1.isDown)
	    {
	        player1.body.velocity.y = -500;
	    }
	    if(RightButton1.isDown)
	    {
	        player1.body.velocity.x = 500;
	    }
	    if(LeftButton1.isDown)
	    {
	        player1.body.velocity.x = -500;
	    }
	    //movimientos del jugador 2
	    if(cursors.left.isDown)
	    {
	        player2.body.velocity.x = -500;
	    }
	    if(cursors.right.isDown)
	    {
	        player2.body.velocity.x = 500;
	    }
		if(cursors.up.isDown)
	    {
	        player2.body.velocity.y = -500;
	    }

	    if(enemyTimer < game.time.now) {
	    	createEnemy1();
	    	createEnemy2();
	    	enemyTimer = game.time.now + enemyRate;
	    }
	    if(coinTimer < game.time.now) {
	    	createCoin1();
	    	createCoin2();
	    	coinTimer = game.time.now + coinRate;
	    }
	    if(gameover==2){
	    	kirby.play();
			enemyTimer = Number.MAX_VALUE;
			coinTimer = Number.MAX_VALUE;
			gameover = 5;
	    }
	    if (gameover == 5) {
	    	background.autoScroll(0, 0);
	    	gameoverText = game.add.text(335, 290,"Gameover", {
				fill:"white"
			});
			if(score1>score2)
			{
				winner1Text = game.add.text(310, 340,"Player 1 wins!!!", {
					fill:"white"
				});
			}
			if(score2>score1)
			{
				winner2Text = game.add.text(310, 340,"Player 2 wins!!!", {
					fill:"white"
				});
			}
			if(score1==score2)
			{
				winnerText = game.add.text(335, 340,"Draw losers", {
					fill:"white"
				});
			}
			if(RestartButton.isDown)
			{
				shutdown();
				game.state.restart();
			}
	    }

	},
	
}

function createEnemy1() {

    var y1 = this.game.rnd.integerInRange(0, game.world.centerY - 55);
    enemies1.create(game.world.width, y1,'bat');
    enemies1.callAll('animations.add', 'animations', 'fly', [0,1], 6, true);
    enemies1.callAll('animations.play', 'animations', 'fly');
    
    if(score1>14){
		var y2 = this.game.rnd.integerInRange(0, game.world.centerY - 55);
		enemies1.create(game.world.width, y2,'bat');
		enemies1.callAll('animations.add', 'animations', 'fly', [0,1], 6, true);
    	enemies1.callAll('animations.play', 'animations', 'fly');

		

	}
	if(score1>29){
		enemies1velocity=-500;
	}
	
}

function createEnemy2() {

	var y1 = this.game.rnd.integerInRange(game.world.centerY + 50, game.world.centerY +225);
	enemies2.create(game.world.width, y1,'bat');
	enemies2.callAll('animations.add', 'animations', 'fly', [0,1], 6, true);
    enemies2.callAll('animations.play', 'animations', 'fly');

	if(score2>14){
		var y2 = this.game.rnd.integerInRange(game.world.centerY + 50, game.world.centerY +225);
		enemies2.create(game.world.width, y2,'bat');
		enemies2.callAll('animations.add', 'animations', 'fly', [0,1], 6, true);
    	enemies2.callAll('animations.play', 'animations', 'fly');
	}
	if(score2>29){
		enemies2velocity=-500;
	}
}

function createCoin1() {

    var y1 = this.game.rnd.integerInRange(0, game.world.centerY - 55);
    coins1.create(game.world.width, y1,'coin');
    coins1.callAll('animations.add', 'animations', 'spin', [0,1,2,3,4,5], 6, true);
    coins1.callAll('animations.play', 'animations', 'spin');
}
function createCoin2() {

	var y2 = this.game.rnd.integerInRange(game.world.centerY + 50, game.world.centerY +225);
	coins2.create(game.world.width, y2,'coin');
	coins2.callAll('animations.add', 'animations', 'spin', [0,1,2,3,4,5], 6, true);
    coins2.callAll('animations.play', 'animations', 'spin');

}

function enemyHit1(player1, enemy){
	hit.play();
	vidas1--;
	if(vidas1 < 1){
		player1.kill();
		coins1velocity=0;
		enemies1velocity=0;
		vidas1Text.text="     x " +vidas1;
		gameover++;
	} else {
		enemy.kill();
		vidas1Text.text="     x " +vidas1;
	}
}
function enemyHit2(player2, enemy){
	hit.play();
	vidas2--;
	if(vidas2 < 1){
		player2.kill();
		coins2velocity=0;
		enemies2velocity=0;
		vidas2Text.text="     x " +vidas2;
		gameover++;
	} else {
		enemy.kill();
		vidas2Text.text="     x " +vidas2;
	}
}
function coinHit1(player1, coin){
	coinSound.play();
	score1++;
	coin.kill();
	score1Text.text="Score: " +score1;

}
function coinHit2(player2, coin){
	coinSound.play();
	score2++;
	coin.kill();
	score2Text.text="Score: " +score2;
}
function Start(){
	player1.kill();
	player2.kill();
	heart1.kill();
	heart2.kill();
	background.autoScroll(0, 0);
	enemyTimer = Number.MAX_VALUE;
	coinTimer = Number.MAX_VALUE;

}
function shutdown(){
	enemies1velocity = -400;
	enemies2velocity = -400;
	coins1velocity = -400;
	coins2velocity = -400;
	enemyRate = 1000;
	enemyTimer = -1000;
	coinRate = 1200;
	coinTimer = -1000;
	score1 = 0;
	score2 = 0;
	gameover = 0;

}

game.state.add('mainState', mainState);
game.state.start('mainState');


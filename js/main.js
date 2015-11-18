var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gamediv');
// variables en general
var background;

var player1;
var player2;

var jumpButton1;
var RightButton1;
var LeftButton1;

var plataforma;


var mainState = {
	//el preload es donde se cargan las imagenes antes del juego
	preload:function(){
	game.load.image('background', "assets/bosque.jpg");
	game.load.spritesheet('gallina', 'monitos/sprite_gallina.png', 50, 50, 2);
	game.load.spritesheet('gallina2', 'monitos/sprite_gallinaamarilla.png', 50, 50, 2)
	game.load.image('plataforma', "assets/plataformaB.png");
	},
	//el create es donde decidimos que sale en la pantalla
	create:function(){
	background = game.add.tileSprite(0,0,800,600,'background');
	//Funcion predeterminada para las "arrow keys"
	cursors = game.input.keyboard.createCursorKeys();
	//gravedad que afecta a los jugadores en los ejes X y Y
	game.physics.arcade.gravity.y = 10000;
	game.physics.arcade.gravity.x = -10000;
	
	//creacion del jugador y establecimiento de las funciones de fisica y donde aparecen en la pantalla
	player1 = game.add.sprite(game.world.centerX - 400,game.world.centerY -65, 'gallina');
	player1.animations.add('fly', [0, 1]);
	player1.animations.play('fly', 10, true);
	game.physics.enable(player1,Phaser.Physics.ARCADE);
	player1.body.collideWorldBounds = true;

	player2 = game.add.sprite(game.world.centerX - 400,game.world.centerY + 400, 'gallina2');
	player2.animations.add('fly', [0, 1]);
	player2.animations.play('fly', 10, true);
	game.physics.enable(player2,Phaser.Physics.ARCADE);
	player2.body.collideWorldBounds = true;
	
	//DANGER!!!! NO MOVER, TOCAR, CAMBIAR, NADA, OSEA NADA 
	plataforma = this.add.physicsGroup();
	for(var k = -25; k< 800; k+=100){
	plataforma.create(k, 290, 'plataforma');
	}
	
	plataforma.setAll('body.allowGravity', false);
	plataforma.setAll('body.immovable', true);
	//HASTA ACA!!!! TODO LO DE EN MEDIO
	
	//Debido a que las letras del teclado no estan predeterminadas se deben seleccionar una a la vez
	jumpButton1 = game.input.keyboard.addKey(Phaser.Keyboard.W);
	RightButton1 = game.input.keyboard.addKey(Phaser.Keyboard.D);
	LeftButton1 = game.input.keyboard.addKey(Phaser.Keyboard.A);

	},
	//el update es donde se establece que sucede cuando el usuario realiza algo
	update:function(){
		//Permite que el fondo sea "scrolling"
		background.tilePosition.x-= 3.5;
		//Indica que cuando este en reposo el jugador no se mueva
		player1.body.velocity.y = 0;
		player1.body.velocity.x = 0;
		player2.body.velocity.y = 0;
		player2.body.velocity.x = 0;

		//NO TOCAR, Es lo que no permite a los jugadores cruzarse
		this.physics.arcade.collide(player1, plataforma, this.setFriction, null, this);
		this.physics.arcade.collide(player2, plataforma, this.setFriction, null, this);

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
	}

}

game.state.add('mainState', mainState);
game.state.start('mainState');
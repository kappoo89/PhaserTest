window.onload = function(){

	// Pause flag
	var paused = true;

	// Create our game unique game state
	var Game = function(game){};

	Game.prototype = {
		preload: function(){
			// Load assets
			this.load.image('ground', 'assets/ground.png');
			this.load.image('cloud', 'assets/cloud.png');
			this.load.image('btnPause', 'assets/btn-pause.png');
			this.load.image('btnPlay', 'assets/btn-play.png');
			this.load.image('panel', 'assets/panel.png');
			this.load.spritesheet('hero', 'assets/hero.png', 70, 94, 11);
			this.load.bitmapFont('kenpixelblocks', 'assets/fonts/kenpixelblocks/kenpixelblocks.png', 'assets/fonts/kenpixelblocks/kenpixelblocks.fnt');
		},

		create: function(){
			// Reponsive and centered canvas
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

			this.scale.minWidth = 320;
			this.scale.minHeight = 200;
			this.scale.maxWidth = 720;
			this.scale.maxHeight = 480;

			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;

			this.scale.setScreenSize(true);

			// Change stage background color
			this.game.stage.backgroundColor = '#d0f4f7';

			// Enable arcade physics
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.physics.arcade.gravity.y = 1200;

			// Add a scrolling ground
			this.ground = this.game.add.tileSprite(0, 250, 480, 70, 'ground');
			this.game.physics.arcade.enableBody(this.ground);
			this.ground.body.immovable = true;
			this.ground.body.allowGravity = false;
			this.ground.autoScroll(-100, 0);

			// Add some moving clouds
			this.clouds = game.add.group();
			for(var i=0; i<3; i++){
				var cloud = this.game.add.sprite(this.game.rnd.integerInRange(0, this.game.width), this.game.rnd.integerInRange(0, 50), 'cloud');
				cloud.anchor.setTo(0.5, 0);
				this.clouds.add(cloud);

				// Kill the cloud when out of bounds
				cloud.checkWorldBounds = true;
   				cloud.outOfBoundsKill = true;

   				// Move clouds
   				this.game.physics.arcade.enableBody(cloud);
   				cloud.body.allowGravity = false;
				cloud.body.velocity.x = -this.game.rnd.integerInRange(15, 30);
			}

			// Add hero
			this.hero = this.game.add.sprite(180, 160, 'hero');
			this.hero.anchor.setTo(0.5, 0.5);
			this.hero.animations.add('run');
			this.hero.animations.play('run', 20, true);

			// Activate hero gravity
			this.game.physics.arcade.enableBody(this.hero);
			this.hero.body.allowGravity = true;

			// Animation loop on the hero
			this.heroTween = this.game.add.tween(this.hero).to({x: 360}, 2500, Phaser.Easing.Linear.NONE, true, 0, Number.POSITIVE_INFINITY, true);

			// Allow hero to jump (Spacebar and mouse/touch)
			this.jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.jumpKey.onDown.add(this.heroJump, this.hero);
			this.game.input.onDown.add(this.heroJump, this.hero);
		},

		update: function(){
			// Revive dead clouds
			this.clouds.forEachDead(function(cloud){
				cloud.revive();
				cloud.x = this.game.width + cloud.width/2;
			}, this);

			// Collisions between hero and ground
			this.game.physics.arcade.collide(this.hero, this.ground);
		},

		heroJump: function(){
			// Change hero velocity if touching the ground
			if(this.body.touching.down){
				this.body.velocity.y -= 500;
			}
		}
	};

	// Create game state and start phaser
	var game = new Phaser.Game(480, 320, Phaser.AUTO, 'game');
	game.state.add('game', Game);
	game.state.start('game');
};
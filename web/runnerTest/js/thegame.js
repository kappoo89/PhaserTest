var theGame = function(game){

	jump = Phaser.Sound;
	pic_coin = Phaser.Sound;
	pic_poison = Phaser.Sound;
	mainTheme = Phaser.Sound;
	
	player = null;
	clones = null;

	stars = null;
	poisons = null;
	
	platforms = null;
	bgtile = null;

	cursors = null;
		
	score = 0;
	scoreText = null;
	
	distance = 0;
	distanceText = null;
	
	
	worldVel = -300;
	oldWorldVel = worldVel;
	
	clonesVel = -100;
	worldVelText = null;	
	
	pause = null;
	paused = true;	
	
	
	LoopDrop = null;
	LoopClone = null;
}

theGame.prototype = {
  	create: function(){

  		this.game.physics.startSystem(Phaser.Physics.ARCADE);


  		//SETUP CONTROLS
  		this.game.input.addPointer();
  		cursors = this.game.input.keyboard.createCursorKeys();
		

		//SETUP BACKGROUND
     	bgStart =  this.game.add.sprite(0,0,'star');
   	 	this.game.physics.enable(bgStart, Phaser.Physics.ARCADE);
	 	bgStart.body.velocity.x = worldVel; 

		bgtile = this.game.add.tileSprite(0, 0, this.game.stage.bounds.width, this.game.cache.getImage('bgtile').height, 'bgtile');	

		//SETUP GROUNDS				
		platforms = this.game.add.group();
	    platforms.enableBody = true;
	    ground = platforms.create(0, this.game.world.height - 64, 'ground');
	    ground.scale.setTo(2, 2);
	    ground.body.immovable = true;

		
		//SETUP PLAYER
		player = this.game.add.sprite(this.game.world.width/3, this.game.world.height - 150, 'ale');
		player.scale.setTo(0.5, 0.5);
   	    player.animations.add('right', [5, 6, 7, 8],11, true);
		
	    this.game.physics.arcade.enable(player);
	    player.body.collideWorldBounds = true;
	    
	    /*
	    boost = this.game.add.sprite((this.game.world.width/3)-50, this.game.world.height - 135, 'boost');
   		boost.scale.setTo(2,2);
   	    boost.animations.add('right', [0, 1, 2, 3],11, true);
   		boost.animations.play('right');
   		*/  
   		  
		//SETUP OBJECTS
   		stars = this.game.add.group();
   		stars.enableBody = true;
   		
	    poisons = this.game.add.group();
	    poisons.enableBody = true;
	    
		clones = this.game.add.group();
   		clones.enableBody = true;		    
	    	    	    
		//SETUP TEXTS	    	    	    	    	    
	    scoreText = this.game.add.text(16, 10, 'SCORE: 0', { fontSize: '2px', fill: '#FFF' });
	    distanceText = this.game.add.text(16, 30, 'DISTANCE: 0', { fontSize: '2px', fill: '#FFF' });
	    worldVelText = this.game.add.text(16, 50, 'DISTANCE: 0', { fontSize: '40pt', fill: '#FFF' });
	    	  

		//AUDIO		
  		mainTheme = this.game.add.audio('mainTheme');
  		mainTheme.play('',0,1,true);
		
	    jump = this.game.add.audio('jump');
	    pic_coin = this.game.add.audio('pic_coin');
	    pic_poison = this.game.add.audio('pic_poison');
	    
		//generatePauseButton	    
   		pause = this.game.add.button(this.game.world.width-55, 10, 'pause', this.pauseGame, this);
		pause.scale.setTo(0.5, 0.5);
	    
		// Let's build a pause panel
		this.pausePanel = new PausePanel(this.game);
		this.game.add.existing(this.pausePanel);
	
		this.playGame();		
		
	},		
	update: function(){
	
		//UPDATE WORLD SPEED
		bgtile.autoScroll(worldVel, 0);
		stars.setAll('body.velocity.x', worldVel);
	 	bgStart.body.velocity.x = worldVel; 
		poisons.setAll('body.velocity.x', worldVel);
		
		
		distance = parseInt(this.game.physics.arcade.distanceBetween(player, bgStart)/20);
		
		distanceText.text = 'DISTANCE:' + distance;
		worldVelText.text = 'SPEED:' + worldVel;

		//platform can handle objects
		this.game.physics.arcade.collide(platforms, player);
		this.game.physics.arcade.collide(platforms, stars);
		this.game.physics.arcade.collide(platforms, poisons);
		this.game.physics.arcade.collide(platforms, clones);

		//player collect stars and poisons		
		this.game.physics.arcade.overlap(player, stars, this.collectStar, null, this);
	   	this.game.physics.arcade.overlap(player, poisons, this.collectPoison, null, this);
	   	this.game.physics.arcade.overlap(player, clones, this.collectClones, null, this);
	   	
//	    if (cursors.up.isDown && player.body.touching.down)
	    if (this.game.input.mousePointer.isDown && player.body.touching.down || this.game.input.pointer1.isDown && player.body.touching.down)
	    {
		    player.body.velocity.y = -350;
	        jump.play();
	    }

		if(!paused){
			if(player.body.touching.down){
				player.animations.play('right');	
			}else{
		        player.animations.stop();
				player.frame = 6;	    		
			}
			
		}

	},	
	pauseGame: function(){
		if(!paused){
			paused = true;
			this.pausePanel.show();
			this.game.add.tween(pause).to({y:-55}, 200, Phaser.Easing.Linear.NONE, true);
			
			//BLOCCO TUTTO
	        player.animations.stop();
			player.body.velocity.y = 0;
			player.body.gravity.y = 0;
			

			clones.setAll('body.velocity.x', 0);
			clones.setAll('animations.currentAnim.paused', true);

			oldWorldVel = worldVel;
			worldVel = 0;
			
	   		//LOOP	   		
	   		this.game.time.events.remove(LoopDrop);
	   		this.game.time.events.remove(LoopClone);	
	   		
	   		//METTO IN PAUSA LA MUSICA
	   		mainTheme.pause();
	   		   		
		}
	},
	playGame: function(){
		if(paused){
			paused = false;
			this.pausePanel.hide();
			this.game.add.tween(pause).to({y:10}, 400, Phaser.Easing.Bounce.Out, true);	
			
			//RIPARTE TUTTO
	   		player.animations.play('right');
	   		player.body.gravity.y = 800;

	   		

			clones.setAll('body.velocity.x', clonesVel);
			clones.setAll('animations.currentAnim.paused', false);
			
	   		worldVel = oldWorldVel;		
	   		
	   		//LOOP
			LoopDrop = this.game.time.events.loop(3000, this.createDrops, this)
			LoopClone = this.game.time.events.loop(15200, this.createClone, this);
			
	   		mainTheme.resume();

		}
	},
	stopMusic: function(){   		
   		if(this.game.sound.mute){
	   		this.game.sound.mute = false;
	   		console.log("switcho l'icona");
   		}else{
	   		this.game.sound.mute = true;	   		
	   		console.log("switcho l'icona");	   		
   		}
	},	
	createDrops: function(){
		
		x = this.game.world.width + 100;
		y = this.game.world.height - 140;
		
		gravity = 800;
		
		if (Phaser.Math.chanceRoll(50)) {
			star = stars.create(x, y, 'star');
			star.body.velocity.x = worldVel;
			star.body.gravity.y = gravity;
		}else{
			var poison = poisons.create(x, y, 'poison');
			poison.body.velocity.x = worldVel;
			poison.body.gravity.y = gravity;
		}
	},
	createClone: function(){
		
		x = this.game.world.width + 200;
		y = this.game.world.height - 140;

		gravity = 100;

		clone = clones.create(x, y, 'dude');
		clone.body.velocity.x = clonesVel
		clone.animations.add('right', [5, 6, 7, 8],8, true);
   		clone.animations.play('right');
		clone.body.gravity.y = gravity;
	},
	collectStar: function(player, star){
	    star.kill();
   	    pic_coin.play();
   	    
   		this.increaseSpeed();
	    
	    score += 10;
	    scoreText.text = 'SCORE: ' + score;
	},
	collectPoison: function(player, poison){
	    poison.kill();
   	    pic_poison.play();
	    
	    this.decreaseSpeed();
	    
	    score -= 10;
	    scoreText.text = 'SCORE: ' + score;
	    
	    if(score < -10){
		    mainTheme.stop();
		 	this.game.state.start("GameOver",true,false,score);   
	    }
	},	
	collectClones: function(player, clones){
	    clones.kill();	    
	    
	    score += 100;
	    scoreText.text = 'SCORE: ' + score;
	    
	},	
	increaseSpeed: function(){		
		
		if(worldVel+(worldVel/10)>-900){
			worldVel = 	Math.floor(worldVel+(worldVel/10));			
		}		
	},
	decreaseSpeed: function(){
		
		if(worldVel-(worldVel/5)<-144){
			worldVel = 	Math.floor(worldVel-(worldVel/5));
		}
	},

	//DEBUG AREA
	/*	
	render: function(){
		this.game.debug.body(player);
		
		stars.forEachAlive(this.renderGroup, this);
		poisons.forEachAlive(this.renderGroup, this);
	},
	renderGroup: function(member) {
	    this.game.debug.body(member);
	}	
	*/	
}
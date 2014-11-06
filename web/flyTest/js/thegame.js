var theGame = function(game){

	pic_coin = Phaser.Sound;
	pic_poison = Phaser.Sound;
	mainTheme = Phaser.Sound;
	
	player = null;
	clones = null;

	stars = null;
	asteroids = null;
	
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

	    cursors = this.game.input.keyboard.createCursorKeys();
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		//SETUP BACKGROUND
     	bgStart =  this.game.add.sprite(0,0,'star');
   	 	this.game.physics.enable(bgStart, Phaser.Physics.ARCADE);
	 	bgStart.body.velocity.x = worldVel; 

		bgtile = this.game.add.tileSprite(0, 0, this.game.stage.bounds.width, this.game.cache.getImage('bgtile').height, 'bgtile');	
		
		//SETUP PLAYER
		/*
		player = this.game.add.sprite(this.game.world.width/3, this.game.world.height - 150, 'ale');
		player.scale.setTo(0.5, 0.5);
   	    player.animations.add('right', [5, 6, 7, 8],11, true);
		*/
		
		player = this.game.add.sprite(this.game.world.width/3, this.game.world.height - 150, 'spaceship');
		player.scale.setTo(0.5, 0.5);

		
		
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
   		
	    asteroids = this.game.add.group();
	    asteroids.enableBody = true;
	    
		clones = this.game.add.group();
   		clones.enableBody = true;		    
	    	    	    
		//SETUP TEXTS	    	    	    	    	    
	    scoreText = this.game.add.text(16, 10, 'SCORE: 0', { fontSize: '2px', fill: '#FFF' });
	    distanceText = this.game.add.text(16, 30, 'DISTANCE: 0', { fontSize: '2px', fill: '#FFF' });
	    worldVelText = this.game.add.text(16, 50, 'DISTANCE: 0', { fontSize: '40pt', fill: '#FFF' });
	    	  

		//AUDIO		
  		mainTheme = this.game.add.audio('mainTheme');
  		mainTheme.play('',0,1,true);
		
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
		//  only move when you click
		if (this.game.input.mousePointer.isDown)
		{
		    //  400 is the speed it will move towards the mouse
		    this.game.physics.arcade.moveToPointer(player, 400);
		
		    //  if it's overlapping the mouse, don't move any more
		    if (Phaser.Rectangle.contains(player.body, this.game.input.x, this.game.input.y))
		    {
		        player.body.velocity.setTo(0, 0);
		    }
		}
		else
		{
		    player.body.velocity.setTo(0, 0);
		}	
	
	
		//UPDATE WORLD SPEED
		bgtile.autoScroll(worldVel, 0);
		stars.setAll('body.velocity.x', worldVel);
	 	bgStart.body.velocity.x = worldVel; 
		asteroids.setAll('body.velocity.x', worldVel);
		
		
		distance = parseInt(this.game.physics.arcade.distanceBetween(player, bgStart)/20);
		
		distanceText.text = 'DISTANCE:' + distance;
		worldVelText.text = 'SPEED:' + worldVel;

		//player collect stars and asteroids		
		this.game.physics.arcade.overlap(player, stars, this.collectStar, null, this);
	   	this.game.physics.arcade.overlap(player, asteroids, this.collectAsteroid, null, this);
	   	this.game.physics.arcade.overlap(player, clones, this.collectClones, null, this);
	   	
	},	
	pauseGame: function(){
		if(!paused){
			paused = true;
			this.pausePanel.show();
			this.game.add.tween(pause).to({y:-55}, 200, Phaser.Easing.Linear.NONE, true);
			
			//BLOCCO TUTTO
	        player.animations.stop();
			player.body.velocity.y = 0;
			
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

			clones.setAll('body.velocity.x', clonesVel);
			clones.setAll('animations.currentAnim.paused', false);
			
	   		worldVel = oldWorldVel;		
	   		
	   		//LOOP
			LoopDrop = this.game.time.events.loop(500, this.createDrops, this)
			LoopClone = this.game.time.events.loop(14000, this.createUfo, this);
			
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
		
		randomY = (Math.floor(Math.random()*40))*10;
		
		x = this.game.world.width + 100;
		y = this.game.world.height - randomY;
		
		
		if (Phaser.Math.chanceRoll(50)) {
			star = stars.create(x, y, 'star');
			star.scale.setTo(1.5, 1.5);
			star.body.velocity.x = worldVel;
		}else{
			
			randInt = Math.floor(Math.random()*4+1);
			
			var asteroid = asteroids.create(x, y, 'asteroid_'+randInt);
			
			randDimension = Math.floor(Math.random()*2+1);
			
			asteroid.scale.setTo(randDimension, randDimension);

			asteroid.body.velocity.x = worldVel;
		}
	},
	createUfo: function(){
		
		randomY = (Math.floor(Math.random()*40))*10;

		
		x = this.game.world.width + 200;
		y = this.game.world.height - randomY;


		clone = clones.create(x, y, 'ufo');
		clone.scale.setTo(2, 2);
		clone.body.velocity.x = clonesVel
		clone.animations.add('right', [5, 6, 7, 8],8, true);
   		clone.animations.play('right');
	},
	collectStar: function(player, star){
	    star.kill();
   	    pic_coin.play();
   	    
   		this.increaseSpeed();
	    
	    score += 10;
	    scoreText.text = 'SCORE: ' + score;
	},
	collectAsteroid: function(player, asteroid){
	    asteroid.kill();
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
		asteroids.forEachAlive(this.renderGroup, this);
	},
	renderGroup: function(member) {
	    this.game.debug.body(member);
	}	
	*/	
}
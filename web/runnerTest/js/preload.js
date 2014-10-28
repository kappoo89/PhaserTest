var preload = function(game){}

preload.prototype = {
	preload: function(){ 

        this.game.stage.backgroundColor = 0x2B85CA;
        var loadingBar = this.add.sprite(300,200,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);
        
        
		this.game.load.image("splashscreen0","assets/splashscreens/splash-screen0.png");
		this.game.load.image("splashscreen1","assets/splashscreens/splash-screen1.png");
		this.game.load.image("splashscreen2","assets/splashscreens/splash-screen2.png");
		this.game.load.image("gameover","assets/gameover.png");
		
		this.game.load.image("pause","assets/pause_menu/pause.png");		
		this.game.load.image("credits","assets/pause_menu/credits.png");		
		this.game.load.image("pause_menu_bg","assets/pause_menu/pause_menu_bg.png");		
		this.game.load.image("play","assets/pause_menu/play.png");		
		this.game.load.image("restart","assets/pause_menu/restart.png");		
		this.game.load.image("sound","assets/pause_menu/sound.png");		
				
	    this.game.load.image('bgtile', 'assets/backgrounds/bg1.png');
	    this.game.load.image('ground', 'assets/backgrounds/platform.png');

		this.game.load.image('star', 'assets/objects/star.png');
	    this.game.load.image('poison', 'assets/objects/poison.png');
	
	    this.game.load.spritesheet('dude', 'assets/characters/dude.png', 32, 48);
	    this.game.load.spritesheet('ale', 'assets/characters/ale.png', 133, 144);
	    this.game.load.spritesheet('boost', 'assets/characters/boost.png', 64, 36);
	
		this.game.load.audio('jump', 'assets/audio/jump.mp3');
	    this.game.load.audio('pic_coin', 'assets/audio/pic_coin.mp3');
	    this.game.load.audio('pic_poison', 'assets/audio/pic_poison.mp3');
	    this.game.load.audio('mainTheme', 'assets/audio/mainTheme.mp3');
	    this.game.load.audio('gameOver', 'assets/audio/gameOver.mp3');	    
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}
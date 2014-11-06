var boot = function(game){
	console.log("%cStarting my awesome game", "color:white; background:red");
};
  
boot.prototype = {
	preload: function(){
        this.game.load.image("loading","assets/splashscreens/loading.png"); 
	},
  	create: function(){
	  	
	  	
		if (this.game.device.desktop) //if playing on desktop
		{
			this.scale.pageAlignHorizontally = true;
			this.scale.setScreenSize();
			this.game.state.start("Preload");
		}
		else
		{
			this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			this.scale.minWidth = 150;  //set up minimum and maximum game widths allowed.
			this.scale.minHeight = 250;  
			//above and below these limits, the show_all attribute wont bother scaling
			this.scale.maxWidth = 600;
			this.scale.maxHeight = 1000;
			this.scale.forceLandscape = true;
			this.scale.pageAlignHorizontally = true;
		}
		
		this.scale.setScreenSize(true);  //apply the setting we set up
		this.state.start('Preload');   //start the Preloader state
				
	}
}
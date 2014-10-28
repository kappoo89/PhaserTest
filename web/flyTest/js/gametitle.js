var gameTitle = function(game){}

gameTitle.prototype = {
  	create: function(){
				
		var splashscreen2 = this.game.add.sprite(0,0,"splashscreen2");
		var splashscreen1 = this.game.add.sprite(0,0,"splashscreen1");
		var splashscreen0 = this.game.add.sprite(0,0,"splashscreen0");
				
		setTimeout(
			function(){
				splashscreen0.destroy();
				setTimeout(
				function(){
					splashscreen1.destroy();
					
					//this.game.input.onDown.add(this.playTheGame, this);

			}, 2000);

		},2000);

		this.game.input.onDown.add(this.playTheGame, this);						
	},
	playTheGame: function(){
		
		this.game.state.start("TheGame");
	}
}
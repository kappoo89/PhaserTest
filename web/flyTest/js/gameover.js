var gameOver = function(game){
	
	mainTheme = Phaser.Sound;

}

gameOver.prototype = {
	init: function(){
		
	},
  	create: function(){
	  	mainTheme = this.game.add.audio('gameOver');
	  	mainTheme.play();
  		var gameOverTitle = this.game.add.sprite(0,0,"gameover");
  		this.game.input.onDown.add(this.playTheGame, this);	
	},
	playTheGame: function(){
	  	mainTheme.stop();
		this.game.state.start("TheGame");
	}
}
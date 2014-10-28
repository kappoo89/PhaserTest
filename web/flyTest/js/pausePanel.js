// Create our pause panel extending Phaser.Group
var PausePanel = function(game, parent){
	// Super call to Phaser.Group
	Phaser.Group.call(this, game, parent);

	// Add the panel
	this.panel = this.create(0, 0, 'pause_menu_bg');
	this.panel.scale.setTo(1, 0.5);


	// Add play button
	this.btnPlay = this.game.add.button(this.game.world.width-75,35, 'play', function(){
		this.game.state.getCurrentState().playGame()}
	, this);
	this.btnPlay.scale.setTo(0.5, 0.5);
	this.add(this.btnPlay);
	
	// Add restart button
	this.btnRestart = this.game.add.button((this.game.world.width/2)-100, this.game.world.height/4, 'restart', function(){
		//this.game.state.start('TheGame',true,false)
		}
	, this);
	
	this.btnRestart.anchor.setTo(0.5,0.5);
	this.add(this.btnRestart);
	
	// Add Music button
	this.btnMusic = this.game.add.button((this.game.world.width/2)+100, this.game.world.height/4, 'sound', function(){
		this.game.state.getCurrentState().stopMusic()}
	, this, 'sound_muted');
	
	this.btnMusic.anchor.setTo(0.5,0.5);
	this.add(this.btnMusic);

	// Place it out of bounds
	this.x = 0;
	this.y = -400;
};

PausePanel.prototype = Object.create(Phaser.Group.prototype);
PausePanel.constructor = PausePanel;

PausePanel.prototype.show = function(){
	this.game.add.tween(this).to({y:0}, 400, Phaser.Easing.Bounce.Out, true);
};
PausePanel.prototype.hide = function(){
	this.game.add.tween(this).to({y:-400}, 200, Phaser.Easing.Linear.NONE, true);
};
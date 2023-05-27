//=============================================================================
// EnemyBars.js
//=============================================================================
//v1.1
/*:
 * @plugindesc Makes enemy hp bar appear in battle. 
 * @author Jeremy Cannady
 *
 * @param High HP Color
 * @desc Insert the color code.
 * @default #009900
 *
 * @param Medium HP Color
 * @desc Insert the color code.
 * @default #ffcc00
 *
 * @param Low HP Color
 * @desc Insert the color code.
 * @default #ff6600
 *
 * @param Critical HP Color
 * @desc Insert the color code.
 * @default #ff3300
 *
 * @help
 * Put <hpBar> in the enemy note tag to activate the hp bar for that enemy
 during battle.
 *Put <hpBarSelectionOnly> to actiavte the hp bar only during selection.
 *Put<hpBarTurnASelection> to actiavet he bar during selection and attack.
 *Put <hpBarTurnOnly> to only show the bar during the attack phase.
 *PLEASE PUT ONLY ONE NOTETAG.
 * For the paramters use any html hex color codes.
 * A few color codes are:
 Green: #009900
 Yellow: #ffcc00
 Orange: #ff6600
 Red: #ff3300
 White: #ffffff
 Blue: #33ffff
 Purple: #660099
 *
*/

(function(){
//=============================================================================
// Create some variables and define the colors
//=============================================================================
Game_Enemy.prototype.battlerHeight = null;
Game_Enemy.prototype.battlerWidth = null;
var parameters = PluginManager.parameters('EnemyBars');
var high = parameters['High HP Color'] || '#009900';
var medium = parameters['Medium HP Color'] || '#ffcc00';
var low = parameters['Low HP Color'] || '#ff6600';
var critical = parameters['Critical HP Color'] || '#ff3300';

//=============================================================================
// Create the enemy hp window that displays all the hp bars
//=============================================================================
function Enemy_Bars() { 
	this.initialize.apply(this, arguments);
};

Enemy_Bars.prototype = Object.create(Window_Base.prototype);
Enemy_Bars.prototype.constructor = Enemy_Bars;

Enemy_Bars.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.deactivate();
	//Make the window transparent
	this.opacity = 0;
};

Enemy_Bars.prototype.update = function() {
    Window_Base.prototype.update.call(this);
	//Clear the window and re-draw the hp bars
    this.contents.clear();
    this.drawBar();
};

//FUNCTION: return the color the hp bar should be based on current hp
Enemy_Bars.prototype.guageColor = function(rate) {
	if(rate > 0.75){
		return high;//High hp color
	}else if(rate > 0.50){
		return medium;//Medium hp color
	}else if(rate > 0.25){
		return low;//Low hp color
	}else{
		return critical;//Critical hp color
	};
};

//FUNCTION: draw the hp guage
Enemy_Bars.prototype.drawBar = function() {
	//Go through the enemies and draw the bars
	for(var i = 0; i < $gameTroop._enemies.length; i++){
		var enemyId = $gameTroop._enemies[i]._enemyId;
		var selected = $gameTroop._enemies[i]._selected;
		if(BattleManager._phase === "action" || BattleManager._phase === "turn"){
			var turn = true
		}else{ 
			var turn = false
			console.log(BattleManager._phase)
			};

		var enabled = false;
		var meta = new Array(4);
		meta[0] = $dataEnemies[enemyId].meta.hpBar
		meta[1] = $dataEnemies[enemyId].meta.hpBarSelectionOnly
		meta[2] = $dataEnemies[enemyId].meta.hpBarTurnASelection
		meta[3] = $dataEnemies[enemyId].meta.hpBarTurnOnly

		if(meta[0]){
			enabled = true;
		}else if(meta[1] && selected){
			enabled = true;
		}else if(meta[2] && (selected || turn)){
			enabled = true;
		}else if(meta[3] && turn){
			enabled = true;
		}else{
			enabled = false;
		}
		
		//Current hp	
		var currentHp = $gameTroop._enemies[i]._hp;
		//If the enemy hp is not zero then draw the hp bar
		if(currentHp > 0 && enabled){
			//Max hp defined from the enemies parameters.
			var maxHp = $dataEnemies[enemyId].params[0];
			//Rate is the currnet hp compared to the max hp
			var rate = currentHp/maxHp;
			//Width of the bar
			var width = $dataEnemies[enemyId].battlerWidth;
			var xOffset = $dataEnemies[enemyId].battlerWidth / 2 + 16;
			var x = $gameTroop._enemies[i]._screenX - xOffset;
			var y = $gameTroop._enemies[i]._screenY - 32;
			//Draw the guage
			this.drawGauge(x, y, width, rate , this.guageColor(rate), this.guageColor(rate));
		};
	};
 };
 
//=============================================================================
// Alias the Scene_Battle createAllWindows to add the hp window
//=============================================================================
var battleWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
	battleWindows.call(this)
	//Add the hp window to the battle scene
	this.Bar = new Enemy_Bars(0, 0, Graphics.width, Graphics.height);
	this.addChild(this.Bar);
};

//=============================================================================
// Alias the Sprite_Enemy.updateFrame to return information back to the hp window.
//=============================================================================
var copyOfSprite_EnemyupdateFrame = Sprite_Enemy.prototype.updateFrame;
Sprite_Enemy.prototype.updateFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
	copyOfSprite_EnemyupdateFrame.call(this);
	//As we are updating the enemy sprites return the bitmaps height and width
	$dataEnemies[this._enemy._enemyId].battlerHeight = this.bitmap.height;
	$dataEnemies[this._enemy._enemyId].battlerWidth = this.bitmap.width;
};
})();
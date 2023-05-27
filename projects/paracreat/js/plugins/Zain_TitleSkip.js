/*:
 * @target MZ
 * @plugindesc Makes it so the default title screen is skipped when booting up the game and after a gameover.
 * @author ZainWD
 * @url https://forums.rpgmakerweb.com/index.php?members/zainwd.124539/
 * @help Terms of use
 * 1. This plugin is free for both commercial and non-commercial use.
 * 2. I must be credited as "ZainWD"
 * 3. Not a term of use, but a link to your game would be appreciated.
 */

(function() {

    Scene_Boot.prototype.startNormalGame = function() {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    };

    Scene_Gameover.prototype.update = function() {
        if (this.isActive() && !this.isBusy() && this.isTriggered()) {
            DataManager.setupNewGame();
            SceneManager.goto(Scene_Map);
        }
        Scene_Base.prototype.update.call(this);
    };

})();
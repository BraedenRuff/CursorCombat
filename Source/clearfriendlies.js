/**
 * Class Name: ClearFriendlies
 * Description: Inherits from the Upgrade class to implement a specific type of game upgrade, "Clear Friendlies". 
 * This upgrade, when activated, removes friendly units or obstacles from the game screen, potentially aiding the player by clearing clutter or saving them from challenging situations. 
 * The upgrade is represented visually within the game as a pentagon with a bomb sprite.
 * Expected Inputs: Calls to instantiate a new Clear Friendlies upgrade within the Level class via loadLevel.
 * Expected Outputs: A sprite representing the Clear Friendlies upgrade added to level.shapes, with functionality to clear friendly units upon activation.
 * Called By: Game logic responsible for spawning shapes. Currently loadLevel()->spawnShape().
 * Will Call: Phaser library methods for adding sprites to render the visual representation of the upgrade.
 * @class
 * @author Braeden Ruff
 */

class ClearFriendlies extends Upgrade
{
	/**
     * Overrides the createGraphics method from the Upgrade class to add the correct sprite for the Clear Friendlies upgrade. Then calls upgrades createGraphics method
     */
	createGraphics()
	{
        // Add a bomb sprite at the center of the pentagon
        this.centerSprite = this.scene.add.sprite(this.x, this.y, 'clear-friendlies'); 
		super.createGraphics();
		
	}
}
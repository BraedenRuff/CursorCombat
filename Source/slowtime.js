/**
 * Class Name: SlowTime
 * Description: Inherits from the Upgrade class to implement a specific type of game upgrade, "SlowTime". 
 * This upgrade, when activated, slows down time by 90%. 
 * The upgrade is represented visually within the game as a pentagon with an hourglass sprite.
 * Expected Inputs: Calls to instantiate a new SlowTime upgrade within the Level class via loadLevel.
 * Expected Outputs: A sprite representing the SlowTime upgrade added to level.shapes, with functionality to slow time upon activation.
 * Called By: Game logic responsible for spawning shapes. Currently loadLevel()->spawnShape().
 * Will Call: Phaser library methods for adding sprites to render the visual representation of the upgrade.
 * @class
 * @author Braeden Ruff
 */
class SlowTime extends Upgrade
{
	/**
     * Overrides the createGraphics method from the Upgrade class to add a custom sprite representing the SlowTime upgrade.
	 */
	createGraphics()
	{
        // Add a sprite at the center of the pentagon
        this.centerSprite = this.scene.add.sprite(this.x, this.y, 'slowtime'); 
		super.createGraphics();
		
	}
}
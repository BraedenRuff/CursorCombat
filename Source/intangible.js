/**
 * Class Name: ClearFriendlies
 * Description: Inherits from the Upgrade class to implement a specific type of game upgrade, "Intangible". 
 * This upgrade, when activated, prevents the cursor from interacting with anything. 
 * The upgrade is represented visually within the game as a pentagon with a transparent cursor sprite.
 * Expected Inputs: Calls to instantiate a new Intangible upgrade within the Level class via loadLevel.
 * Expected Outputs: A sprite representing the Intangible upgrade added to level.shapes, with functionality to become intangible upon activation.
 * Called By: Game logic responsible for spawning shapes. Currently loadLevel()->spawnShape().
 * Will Call: Phaser library methods for adding sprites to render the visual representation of the upgrade.
 * @class
 * @author Braeden Ruff
 */
class Intangible extends Upgrade
{
	/**
     * Overrides the createGraphics method from the Upgrade class to add a custom sprite representing the Intangible upgrade. The sprite is set with reduced opacity to visually suggest the upgrade's intangible effect.
	 */
	createGraphics()
	{
        // Add a sprite at the center of the pentagon
        this.centerSprite = this.scene.add.sprite(this.x, this.y, 'intangible'); 
		this.centerSprite.setAlpha(0.5);
		super.createGraphics();
		
	}
}
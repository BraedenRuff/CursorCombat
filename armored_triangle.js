/**
 * Class Name: ArmoredTriangle
 * Description: Extends the Triangle class to include armor/health points for additional durability, and requires the player to click to kill. 
 * Manages the health and damage model for armored triangle shapes within the game, including visual representation 
 * of armor levels and handling damage taken by the triangle.
 * Expected Inputs: Click to decrement health points.
 * Expected Outputs: Visual updates to represent current health status, removal of the shape upon depletion of health,
 * and score updates for destroying armored triangles.
 * Called By: Level class loadLevel()->spawnShape().
 * Will Call: Phaser library methods for sprite manipulation and rendering, and custom methods for health management and score updates.
 * @class
 * @author Braeden Ruff
 */

class ArmoredTriangle extends Triangle {
    /**
     * Generates and displays a sprite for the armored triangle based on its current health points.
     * @param {number} healthPoints - The health points of the armored triangle, determining the sprite to display.
     */
    generateSprite(healthPoints) {
        this.healthPoints = healthPoints; // Store the health points.
        let name = "armored_" + healthPoints; // Name of the sprite based on health points.
        this.armored_sprite = this.scene.add.sprite(this.x, this.y, name); // Add the sprite to the scene.

        if (this.armored_sprite) {
            const diameterOfCircle = 50; // Diameter to fit the sprite within. (50 is the side length)

            // Set graphical layering.
            this.graphics.setDepth(0);
            this.armored_sprite.setDepth(1);

            // Calculate and apply scale factor to fit the sprite within a predefined diameter.
            this.spriteScaleFactor = diameterOfCircle / Math.max(this.armored_sprite.width, this.armored_sprite.height);
            this.armored_sprite.setScale(this.spriteScaleFactor);
        }
    }

    /**
     * Handles the damage taken by the armored triangle, updating its health status,
     * visual representation, and game score accordingly.
     */
    takeDamage() {
        this.healthPoints -= 1; // Decrement health points.
        this.armored_sprite.destroy(); // Remove the current sprite.

        // If health points are depleted
        if (this.healthPoints === 0) {
            // Update the score display.
			this.scene.score += 1;
			this.scene.scoreText.setText('Score: ' + this.scene.score.toString().padStart(this.scene.level.levelPassableScore.toString().length, '0') + "/" + this.scene.level.levelPassableScore);
			 // Remove the shape from the game.
			this.scene.level.shapes.forEach((shape) => {
				if(this === shape)
				{
					this.scene.level.removeShape(shape);
				}
			});
        } else if (this.healthPoints > 0) {
            // If still alive, generate a new sprite reflecting the remaining health points.
            this.generateSprite(this.healthPoints);
        }
    }
}
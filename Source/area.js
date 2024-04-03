/**
 * Area Class
 * Extends Square class to implement Area-specific behaviors.
 *
 * Description:
 * This class is responsible for creating and managing the graphical representation of an area object within the game.
 * It uses Phaser's graphics system to draw a red square shape and sets it to be interactive, allowing for event handling such as pointerover.
 *
 * Expected Inputs:
 * - scene: The current Phaser scene object where the area will be added.
 * - x: The x-coordinate for the area's position.
 * - y: The y-coordinate for the area's position.
 * - velocityX: Horizontal velocity of the area.
 * - velocityY: Vertical velocity of the area.
 * - angularVelocity: The angular velocity for the area's rotation.
 *
 * Expected Outputs:
 * - An area object that can be manipulated within the Phaser scene. It supports basic interactions such as clicking and hovering.
 *
 * Functions:
 * - draw(halfWidth, halfHeight): Draws a red square shape based on provided dimensions.
 *
 * Called by:
 * This class is instantiated by the Level class when loading a level that includes area as part of its design.
 *
 * Will call:
 * - Phaser's graphics system methods to create and manage the square's graphical representation.
 * @class
 * @author Braeden Ruff
 */
class Area extends Square
{
    /**
     * Draws the area on the scene.
     * @param {number} halfWidth - Half of the area's width.
     * @param {number} halfHeight - Half of the area's height.
     */
    draw(halfWidth, halfHeight) {
        // Set the fill color and line style for the square.
        this.graphics.fillStyle(0xFFFFFF, 0);
        this.graphics.lineStyle(3, 0x63040A);
        
        // Begin the path for the square shape.
        this.graphics.beginPath();
        this.graphics.moveTo(halfWidth, halfHeight);
        this.graphics.lineTo(halfWidth, -halfHeight);
        this.graphics.lineTo(-halfWidth, -halfHeight);
        this.graphics.lineTo(-halfWidth, halfHeight);
        
        // Close the path and fill the shape with the defined color.
        this.graphics.closePath();
        this.graphics.fillPath();
        this.graphics.strokePath();
    }
}
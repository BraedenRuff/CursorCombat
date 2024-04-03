/**
 * Square Class
 * Extends Shape class to implement Square-specific behaviors.
 *
 * Description:
 * This class is responsible for creating and managing the graphical representation of a square object within the game.
 * It uses Phaser's graphics system to draw a square shape and sets it to be interactive, allowing for event handling such as pointerover.
 *
 * Expected Inputs:
 * - scene: The current Phaser scene object where the square will be added.
 * - x: The x-coordinate for the square's position.
 * - y: The y-coordinate for the square's position.
 * - velocityX: Horizontal velocity of the square.
 * - velocityY: Vertical velocity of the square.
 * - angularVelocity: The angular velocity for the square's rotation.
 *
 * Expected Outputs:
 * - A square object that can be manipulated within the Phaser scene. It supports basic interactions such as clicking and hovering.
 *
 * Functions:
 * - createGraphics(): Sets up the square's graphical representation and interaction.
 * - draw(halfWidth, halfHeight): Draws the square shape based on provided dimensions.
 *
 * Called by:
 * This class is instantiated by the Level class when loading a level that includes squares as part of its design.
 *
 * Will call:
 * - Phaser's graphics system methods to create and manage the square's graphical representation.
 * @class
 * @author Braeden Ruff
 */

class Square extends Shape {
    /**
     * Creates the graphical representation of the square and sets it as interactive.
     */
    createGraphics() {
        // Initialize the graphics object for this square.
        this.graphics = this.scene.add.graphics({ x: this.x, y: this.y });
        
        // Define the dimensions of the square.
        let squareWidth = 50; // The width of the square
        let squareHeight = 50; // The height of the square

        let halfWidth = squareWidth / 2;
        let halfHeight = squareHeight / 2;
        let geom = new Phaser.Geom.Rectangle(-halfWidth, -halfHeight, squareWidth, squareHeight);
		this.graphics.geom = geom;
        // Call the draw function to render the square based on the defined dimensions.
        this.draw(halfWidth, halfHeight);
        
        // Set the square as interactive, enabling it to respond to pointer events.
        this.graphics.setInteractive(geom, Phaser.Geom.Rectangle.Contains);
    }

    /**
     * Draws the square on the scene.
     * @param {number} halfWidth - Half of the square's width.
     * @param {number} halfHeight - Half of the square's height.
     */
    draw(halfWidth, halfHeight) {
        // Set the fill color and line style for the square.
        this.graphics.fillStyle(0xFFFFFF, 1);
        this.graphics.lineStyle(0, 0x000000);
        
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

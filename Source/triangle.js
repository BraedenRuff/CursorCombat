/**
 * Triangle Class
 * Extends Shape class to implement Triangle-specific behaviors.
 *
 * Description:
 * This class is responsible for creating and managing the graphical representation of a triangle object within the game.
 * It uses Phaser's graphics system to draw a triangle shape and sets it to be interactive, allowing for event handling such as pointerover.
 *
 * Expected Inputs:
 * - scene: The current Phaser scene object where the triangle will be added.
 * - x: The x-coordinate for the triangle's position.
 * - y: The y-coordinate for the triangle's position.
 * - velocityX: Horizontal velocity of the triangle.
 * - velocityY: Vertical velocity of the triangle.
 * - angularVelocity: The angular velocity for the triangle's rotation.
 *
 * Expected Outputs: A triangle object that can be manipulated within the Phaser scene. It supports basic interactions such as pointerover.
 * 
 * Functions:
 * - createGraphics(): Sets up the triangle's graphical representation and interaction.
 * - draw(points): Draws the triangle shape based on provided points.
 *
 * Called by:
 * This class is instantiated by the Level class when loading a level that includes triangles as part of its design.
 *
 * Will call:
 * - Phaser's graphics system methods to create and manage the triangle's graphical representation.
 * @class
 * @author Braeden Ruff
 */

class Triangle extends Shape {
    /**
     * Creates the graphical representation of the triangle and sets it as interactive.
     */
    createGraphics() {
        // Initialize the graphics object for this triangle.
        this.graphics = this.scene.add.graphics({ x: this.x, y: this.y });
        
        // Define the points that make up the triangle shape. Offset by 8 for rotation since the center isn't in the center of the triangle for some reason, but this way it works
        const points = [ {x: -25, y: 25-8}, {x: 25, y: 25-8}, {x: 0, y: -25-8} ];
        let geom = new Phaser.Geom.Triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);
		this.graphics.geom = geom;
        // Call the draw function to render the triangle based on the defined points.
        this.draw(points);
        
        // Set the triangle as interactive, enabling it to respond to pointer events. Get the hitbox the same as the drawing
        this.graphics.setInteractive(geom, Phaser.Geom.Triangle.Contains);
    }

    /**
     * Draws the triangle on the scene.
     * @param {Array} points - An array of points defining the triangle's vertices.
     */
    draw(points) {
        // Set the fill color and line style for the triangle.
        this.graphics.fillStyle(0x00FF00, 1);
        this.graphics.lineStyle(0, 0x000000);
        
        // Begin the path for the triangle shape.
        this.graphics.beginPath();
        this.graphics.moveTo(points[0].x, points[0].y);
        this.graphics.lineTo(points[1].x, points[1].y);
        this.graphics.lineTo(points[2].x, points[2].y);
        
        // Close the path and fill the shape with the defined color.
        this.graphics.closePath();
        this.graphics.fillPath();
        this.graphics.strokePath();
    }
}
/**
 * Architecture Class
 * Extends the Shape class to implement complex polygonal structures within the game.
 *
 * Description:
 * This class is designed to create and manage architectural elements in the game environment,
 * allowing for the representation of complex shapes beyond simple geometric figures.
 * It takes a series of points defining the vertices of a polygon and a vertical velocity,
 * drawing the shape in the Phaser scene and making it interactive.
 *
 * Expected Inputs:
 * - scene: The Phaser scene where the architecture will be drawn.
 * - points: An array of points {x, y} defining the vertices of the polygon.
 * - velocityY: The vertical velocity at which the architecture moves.
 *
 * Expected Outputs:
 * - An interactive polygonal shape rendered in the Phaser scene, capable of moving at the specified velocity.
 *
 * Functions:
 * - constructor(scene, points, velocityY): Initializes the architectural shape with the given parameters.
 * - createGraphics(): Sets up the graphical representation of the architecture.
 * - draw(): Draws the polygonal shape on the scene based on the vertices provided.
 *
 * Called by:
 * This class is instantiated by the Level class when loading levels that include architectural elements as part of their design.
 *
 * Will call:
 * - Phaser's graphics and geometry systems to create and manage the polygonal shape's graphical representation.
 * @class
 * @author Braeden Ruff
 */

class Architecture extends Shape 
{
	/**
	 * The constructor for the Architecture class
	 * @constructor
	 * @param {Phaser.Scene} scene - The current Phaser scene instance.
	 * @param {Array.<{x: number, y: number}>} points - An array of points defining the architecture polygon  
	 * @param {number} velocityY - Initial vertical velocity.
	 */
    constructor(scene, points, velocityY) 
	{
        // Adjust points to be relative to the lowest y-value to normalize position.
        const minY = Math.min(...points.map(p => p.y));
        super(scene, 0, minY, 0, velocityY, 0); // Initialize the shape with the adjusted position.
        this.points = points.map(p => new Phaser.Geom.Point(p.x, p.y - minY)); // Normalize points.
    }
    
    /**
     * Prepares the graphics object for the architecture and draws its initial state.
     */
    createGraphics() {
        this.graphics = this.scene.add.graphics({ x: this.x, y: this.y });
		
		let geom = new Phaser.Geom.Polygon(this.points);
		this.graphics.geom = geom;
		
        this.draw(); // Draw the architecture based on the points provided.
        
        // Make the polygon interactive, allowing for event handling.
        this.graphics.setInteractive(geom, Phaser.Geom.Polygon.Contains);
		this.graphics.setDepth(2);
    }

    /**
     * Draws the polygonal shape on the scene.
     */
    draw() {
        // Set the color and style for the architecture.
        this.graphics.fillStyle(0x777777, 1); // A neutral grey color.
        this.graphics.lineStyle(0, 0x000000); // Black border.

        // Begin the path for the polygon shape.
        this.graphics.beginPath();
        if(this.points.length > 0) {
            // Move to the first point.
            this.graphics.moveTo(this.points[0].x, this.points[0].y);
        }
        // Draw lines to each subsequent point.
        for(let i = 1; i < this.points.length; ++i) {
            this.graphics.lineTo(this.points[i].x, this.points[i].y);
        }
        
        // Close the path and fill the shape with the defined color.
        this.graphics.closePath();
        this.graphics.fillPath();
        this.graphics.strokePath();
    }
}

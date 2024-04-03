/**
 * Class Name: Upgrade
 * Description: Inherits from the Shape class to implement a generic upgrade mechanism within the game, visually represented as a pentagon. 
 * This class serves as a base for various types of upgrades, facilitating the addition of interactive upgrades to the game world. Upgrades enhance the player's abilities or provide temporary benefits, making gameplay more dynamic.
 * Currently, there are 3 upgrades: ClearFriendlies, SlowTime, and Intangible
 * Expected Inputs: Instantiation with position and possibly type specifications for different upgrades.
 * Expected Outputs: A graphical representation of the upgrade in the form of a pentagon, set as interactive to respond to player actions (pointerover).
 * Called By: Level class -> loadLevel()->spawnShape() spawns upgrades within the game environment.
 * Will Call: Phaser library methods for graphics and interaction, leveraging geometry for shape drawing and interaction detection.
 * @class
 * @author Braeden Ruff
 */

class Upgrade extends Shape 
{
    /**
     * Creates the graphical representation of the pentagon and sets it as interactive.
     */
    createGraphics() {
		// Initialize the graphics object for this triangle.
        this.graphics = this.scene.add.graphics({ x: this.x, y: this.y });
        
        // Define the points for a pentagon
        const size = 30; // The size from the center to a vertex
        let points = [];
        for (let i = 0; i < 5; i++) {
            // Calculate the vertex position
            const angle_deg = 72 * i - 90; // -90 to start the first point upwards
            const angle_rad = Phaser.Math.DegToRad(angle_deg);
            points.push(new Phaser.Geom.Point(
                size * Math.cos(angle_rad),
                size * Math.sin(angle_rad)
            ));
        }

        // Draw the pentagon
        this.draw(points);
		
        // Convert points to a Phaser polygon for interaction.
        const polygon = new Phaser.Geom.Polygon(points.map(p => [p.x, p.y]).flat());
		this.graphics.geom = polygon; // Attach the polygon to the graphics object for reference.
        // Make the polygon interactive, allowing for event handling
        this.graphics.setInteractive(polygon, Phaser.Geom.Polygon.Contains);
		
        // Additional sprite within the upgrade, if defined.
		if(this.centerSprite)
		{
			const diameterOfCircle = size * 1.3;
			// Adjust the depth and scale of the sprite to fit within the pentagon.
			this.graphics.setDepth(0);
			this.centerSprite.setDepth(1);
			// Calculate the scale factor needed for the sprite to fit within the pentagon
			// This assumes the sprite's dimensions are larger than the pentagon's diameter.
			this.spriteScaleFactor = diameterOfCircle / Math.max(this.centerSprite.width, this.centerSprite.height);
			this.centerSprite.setScale(this.spriteScaleFactor);
		}
        // Position the graphics object at the Upgrade object's position
        this.graphics.setPosition(this.x, this.y);
    }

    /**
     * Draws the pentagon on the scene.
     * @param {Array} points - An array of points defining the pentagon's vertices.
     */
    draw(points) {
        this.graphics.fillStyle(0x00FF00, 1); // Green
        this.graphics.lineStyle(2, 0x000000); // Adjusted line style for visibility

        this.graphics.beginPath();
        this.graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.graphics.lineTo(points[i].x, points[i].y);
        }
        this.graphics.closePath();
        this.graphics.fillPath();
        this.graphics.strokePath();
    }
}
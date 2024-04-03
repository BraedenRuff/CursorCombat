/**
 * Class Name: StealthTriangle
 * Description: Extends the Triangle class to implement a stealth triangle, which is visually designed to blend into the game's background, making it harder to identify. 
 * This class adjusts the visual properties of the triangle, such as its color and opacity, to create a "stealth" effect, challenging the player to spot these triangles among other game elements.
 * Expected Inputs: An array of points defining the vertices of the stealth triangle. Will be the same as a normal triangle (from createGraphics() of the Triangle class).
 * Expected Outputs: A stealth triangle rendered on the game scene with modified visual properties for reduced visibility.
 * Called By: Any class or function responsible for spawning or rendering stealth triangles within the game, typically within the context of level design or enemy generation. 
 * Additionally, createGraphics of the Triangle class calls this if it's a stealth Triangle
 * Will Call: Phaser's graphics methods for drawing shapes, specifically fillStyle and lineStyle, to customize the appearance of the triangle.
 * @class
 * @author Braeden Ruff
 */

class StealthTriangle extends Triangle
{
	/**
     * Draws the Triangle on the scene.
     * @param {Array} points - An array of points defining the pentagon's vertices.
     */
    draw(points) {
        this.graphics.fillStyle(0x444444, 0.3); // Slightly lighter than background. (#2d2d2d)
        this.graphics.lineStyle(2, 0x181818, 0.3); // Slightly darker than background. (#2d2d2d)

		// Draw the lines.
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
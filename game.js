/**
 * Program Name: Phaser Game Initialization
 * Description: This script initializes a Phaser game instance with a specified configuration,
 *              including the type of renderer to use, game dimensions, background color, 
 *              the parent HTML container for the game, and the scene(s) that are part of the game.
 * Expected Inputs: None directly to this script. It utilizes Phaser's game configuration object.
 * Expected Outputs: An initialized Phaser game instance attached to the specified HTML container.
 * Called By: This script is typically loaded in an HTML document as a standalone script.
 * Will Call: GameScene.js for scene-specific logic and settings.
 * @class
 * @author Braeden Ruff
 */

// Import the GameScene class from the GameScene.js file. Adjust the path as necessary based on your project structure.
import GameScene from './GameScene.js';

// Define the game configuration object.
var config = {
    // Phaser.AUTO automatically chooses the WebGL renderer if available, with a fallback to Canvas renderer.
    type: Phaser.AUTO,
    // Set the width of the game in pixels.
    width: 800,
    // Set the height of the game in pixels.
    height: 600,
    // Set the background color of the game. Here, it's set to a dark gray color.
    backgroundColor: '#2d2d2d',
	// Set the fps higher for better mouse tracking (less potential to miss if the mouse is going fast).
	fps: {
		target: 120,
	},
    // Specify the ID of the HTML container that the game should be attached to. This is used to make achievements go underneath the game area and to center it
    parent: 'gameContainer',
    // An array of scenes that are part of this game. You can add more scenes to this array as needed.
    scene: [GameScene] // Use the scene class
};

// Create a new Phaser game instance with the specified configuration.
var game = new Phaser.Game(config);
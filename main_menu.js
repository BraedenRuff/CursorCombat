/**
 * Class Name: MainMenu
 * Description: Manages the main menu interface, including the display of the play button, difficulty selection,
 * and instructions. It facilitates starting the game, setting the difficulty level, and accessing the instructions.
 * Expected Inputs: User interactions with the menu, such as clicking the play button or choosing a difficulty, or the instructions button.
 * Expected Outputs: Transition to the game scene or instructions, based on user selection.
 * Called By: GameScene class during the game initialization.
 * Will Call: Phaser library methods for UI elements and GameScene methods for starting the game and setting difficulty.
 * @class
 * @author Braeden Ruff
 */

class MainMenu 
{
    /**
     * Constructs the main menu with necessary UI elements.
	 * @constructor
     * @param {Phaser.Scene} scene - Reference to the current Phaser scene.
     */
    constructor(scene) 
	{
        this.scene = scene; // Reference to the Phaser game scene.
        this.playButton = null; // Button to start the game.
        this.difficultyButtons = []; // Buttons for selecting game difficulty.
        this.background = null; // Background sprite for the menu.
		this.displayWidth = this.scene.sys.game.config.width; // Game display width.
		this.displayHeight = this.scene.sys.game.config.height; // Game display height.
        this.create(); // Initialize the menu creation.
    }

    /**
     * Creates and displays the main menu, including background, play button, and instructions button.
     */
    create() 
	{
        // Add and configure the background sprite.
        this.background = this.scene.add.sprite(0, 0, 'background-menu').setOrigin(0, 0).setDisplaySize(this.displayWidth, this.displayHeight).setDepth(10001);

        // Add and configure the play button.
        this.playButton = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY - 25, 'Play', { font: '32px Arial', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.showDifficultySelection()).setDepth(10001).setOrigin(0.5, 0.5);

        // Add and configure the instructions button.
		this.instructionsButton = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 25, 'Instructions', { font: '32px Arial', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => { this.hide(); this.scene.instructions.show(); }).setDepth(10001).setOrigin(0.5, 0.5);
    }

    /**
     * Hides the play button and instructions button, then displays difficulty selection options.
     */
    showDifficultySelection() {
		this.playButton.setVisible(false);
		this.instructionsButton.setVisible(false);

        // Configuration for difficulty selection buttons.
		const difficulties = ['Easy', 'Medium', 'Hard', 'Insane'];
		const yOffsetStart = this.displayHeight / 3; // Vertical start position for buttons.

		// Create and configure difficulty buttons.
		difficulties.forEach((difficulty, index) => {
			this.difficultyButtons.push(this.scene.add.text(this.scene.cameras.main.centerX, yOffsetStart + (50 * index), difficulty, { font: '24px Arial', fill: '#fff' })
				.setInteractive()
				.on('pointerdown', () => this.startCutscene(difficulty)).setOrigin(0.5, 0).setDepth(10001));
		});
	}

    /**
     * Initiates the game based on the selected difficulty and starts the cutscene.
     * @param {string} difficulty - The selected game difficulty.
     */
    startCutscene(difficulty) {
        this.scene.setDifficulty(difficulty); // Set the game difficulty.
        this.scene.showCutscene(); // Show the game's introductory cutscene.
		this.hide(); // Hide the main menu.
    }

    /**
     * Hides the menu and cleans up UI elements to prepare for the game or instructions.
     */
    hide() {
        // Clean up the play button.
        if (this.playButton) {
            this.playButton.setText('');
            this.playButton = null;
        }

        // Clean up difficulty buttons.
		this.difficultyButtons.forEach(button => button.setText(''));
        this.difficultyButtons = []; // Clear the array of buttons.

        // Clean up the background.
        if (this.background) {
            this.background.destroy();
            this.background = null;
        }

        // Clean up the instructions button.
		if (this.instructionsButton) {
            this.instructionsButton.destroy();
            this.instructionsButton = null;
        }

		// Reset game time factor to normal in case it was altered.
		this.scene.setSlowtimeFactor(1);
    }
}
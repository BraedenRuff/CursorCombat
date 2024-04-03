/**
 * Class Name: EscapeMenu
 * Description: Manages the escape menu interface within the game, offering options such as level selection, changing difficulty, and accessing instructions. This menu is typically accessed during gameplay by pressing the escape key or through a game pause event.
 * Expected Inputs: User interactions with the menu, such as clicking buttons for level selection, changing difficulty, or viewing instructions.
 * Expected Outputs: Navigation to different parts of the game or changes to the game settings based on user selection.
 * Called By: GameScene class when the escape menu needs to be displayed, in response to user input (e.g., pressing the escape key).
 * Will Call: Phaser library methods for UI elements, GameScene methods for setting game difficulty, showing instructions, or selecting levels.
 * @class
 * @author Braeden Ruff
 */

class EscapeMenu 
{
    /**
     * Constructs the escape menu with references to necessary UI elements.
	 * @constructor
     * @param {Phaser.Scene} scene - The current Phaser scene, providing context for UI element placement and interaction.
     */
    constructor(scene) 
	{
        this.scene = scene;
        this.levelSelectButton = null; // Button for navigating to the level selection screen.
        this.background = null; // Background for the escape menu.
        // Size adjustments for the menu based on the game's display dimensions.
        this.displayWidth = this.scene.sys.game.config.width / 2;
        this.displayHeight = this.scene.sys.game.config.height / 3 * 2;
        this.difficultyButtons = []; // Array to hold the dynamically created difficulty selection buttons.
    }

    /**
     * Creates and initializes the escape menu UI elements, including the background, buttons for level selection, difficulty change, and instructions.
     */
    create() 
	{
        // Add and configure the background sprite for the menu.
        this.background = this.scene.add.sprite(this.displayWidth / 2, this.displayHeight / 3, 'background-menu').setOrigin(0, 0).setDisplaySize(this.displayWidth, this.displayHeight).setDepth(10000).setInteractive(); // Interactive so we can't click shapes
		
        // Create and configure the Level Select button.
        this.levelSelectButton = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, 'Level Select', { font: '32px Arial', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.levelSelect.show();
                this.hide(); // Hide the escape menu upon selection.
            }).setDepth(10001).setOrigin(0.5, 0.5);

		// Create and configure the Change Difficulty button
		this.changeDifficultyButton = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 40, 'Change Difficulty', { font: '32px Arial', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => {
				this.showDifficultySelection();
			}).setDepth(10001).setOrigin(0.5, 0.5);
			
		// Create and configure the Instructions button
		this.instructionButton = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 80, 'Instruction', { font: '32px Arial', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => {
				this.scene.instructions.show();
				this.hide();
			}).setDepth(10001).setOrigin(0.5, 0.5);
    }

    /**
     * Shows the difficulty selection options by hiding current buttons and displaying new ones for difficulty levels.
     */
    showDifficultySelection() 
	{
        // Hide existing buttons before showing new ones.
        this.levelSelectButton.setVisible(false);
        this.changeDifficultyButton.setVisible(false);
        this.instructionButton.setVisible(false);

        // Dynamically create and display buttons for each difficulty level.
        const difficulties = ['Easy', 'Medium', 'Hard', 'Insane'];
        const yOffsetStart = this.scene.cameras.main.centerY - this.displayHeight / 5;

        difficulties.forEach((difficulty, index) => {
            this.difficultyButtons.push(this.scene.add.text(this.scene.cameras.main.centerX, yOffsetStart + (50 * index), difficulty, { font: '24px Arial', fill: '#fff' })
                .setInteractive()
                .on('pointerdown', () => {
                    this.hide(); // Hide the escape menu.
                    this.scene.setDifficulty(difficulties[index]); // Set the selected difficulty.
                    this.scene.levelSelect.show(); // Show the level select screen.
                })
                .setOrigin(0.5, 0).setDepth(10001));
        });
    }

    /**
     * Hides the escape menu and cleans up UI elements to prepare for returning to the game or navigating to another screen.
     */
    hide() 
	{
        // Clean up Level Select button
        if(this.levelSelectButton) 
		{
			this.levelSelectButton.setText('');
			this.levelSelectButton = null;
        }
		
        // Clean up Change Difficulty button
		if(this.changeDifficultyButton)
		{
			this.changeDifficultyButton.setText('');
			this.changeDifficultyButton = null;
		}
		
        // Clean up Instructions button
		if(this.instructionButton)
		{
			this.instructionButton.setText('');
			this.instructionButton = null;
		}
		
        // Clean up difficulty buttons
		this.difficultyButtons.forEach((currButton) => {
			currButton.destroy();
		});			
		this.difficultyButtons = [];
		
        // Clean up background
        if(this.background) 
		{
			this.background.destroy();
			this.background = null;
		}
    }
}
/**
 * Class Name: LevelSelect
 * Description: Manages the level selection screen, allowing players to choose from available levels. 
 * Displays level numbers and additional details, and handles user interactions for level selection.
 * Expected Inputs: User interactions for selecting levels.
 * Expected Outputs: Changes the current game scene to the selected level, updating the game state accordingly.
 * Called By: GameScene class when navigating to the level selection from the main menu or escape menu, and the Level class when a level is over
 * Will Call: Phaser library methods for creating UI elements and GameScene methods for loading levels.
 * @class
 * @author Braeden Ruff
 */

class LevelSelect {
    /**
     * Constructs the level selection screen.
	 * @constructor
     * @param {Phaser.Scene} scene - The current Phaser scene, providing context for element placement.
     */
    constructor(scene) {
        this.scene = scene;
        this.background = null; // Background sprite for the level selection menu.
        this.displayWidth = this.scene.sys.game.config.width; // Full width of the game display.
        this.displayHeight = this.scene.sys.game.config.height; // Full height of the game display.
        this.buttonList = []; // Array to store buttons for each level.
        this.create(); // Calls the create method to initialize the level selection UI.
    }

    /**
     * Creates the level selection UI, including the background and level buttons.
     */
    create() {
        // Add and configure the background sprite for the level selection menu.
        this.background = this.scene.add.sprite(0, 0, 'background-menu').setOrigin(0, 0).setDisplaySize(this.displayWidth, this.displayHeight).setDepth(10000);

        // Calculate positions and dimensions for level buttons.
        const buttonPadding = 35; // Padding between buttons.
        const buttonSize = 64; // Size of each button, assuming square shape.
        // Calculate start positions for the first button.
        const startX = (this.displayWidth - (6 * buttonSize) - (5 * buttonPadding)) / 2;
        const startY = (this.displayHeight - (4 * buttonSize) - (3 * buttonPadding)) / 10 * 4;

        // Dynamically create buttons for levels 1-20.
        for (let i = 0; i < 20; i++) {
            let level = i + 1; // Level number.
            // Calculate position for each button based on its index.
            let x = startX + (i % 6) * (buttonSize + buttonPadding) + buttonSize / 2;
            let y = startY + Math.floor(i / 6) * (buttonSize + buttonPadding) + buttonSize / 2;

            // Create the main level number button.
            let currButton = this.scene.add.text(x, y - 10, level.toString(), { font: `${buttonSize - 20}px Arial`, fill: '#fff', stroke: '#000', strokeThickness: 4, align: 'center' })
                .setInteractive()
                .setData('level', level)
                .setOrigin(0.5, 0.5) // Center the text.
                .setDepth(10001);

            // Create additional detail text below the level number.
            let detailText = this.scene.add.text(x, y + 20, 'Detail', { font: '10px Arial', fill: '#fff', align: 'center' })
                .setOrigin(0.5, 0.5)
                .setDepth(10001);

            // Set interaction for each button.
            currButton.on('pointerdown', () => {
                this.scene.currentLevelIndex = currButton.getData('level') - 1; // the 'level' stores 1-20 while our array is 0-19
                this.scene.loadCurrentLevel();
				this.scene.escMenuOpen = false;
                this.hide(); // Hide the level select menu.
            });

            // Adjust button appearance based on completion status.
            if (i < this.scene.achievedScores[this.scene.difficultyIndex].length) {
                currButton.setTint(0xffffff); // Normal color for completed or available levels.
            } else {
                currButton.setTint(0xaaaaaa); // Greyed out for unavailable levels.
                currButton.disableInteractive();
            }

            this.buttonList.push({ currButton, detailText }); // Store button and detail text objects.
        }

        this.hide(); // Initially hide the level select UI until specifically shown.
    }

    /**
     * Hides the level selection UI, including all buttons and the background.
     */
    hide() {
        this.buttonList.forEach(buttonObject => {
            buttonObject.currButton.setVisible(false); // Hide each button.
            buttonObject.detailText.setVisible(false); // Hide detail text for each button.
        });
        if (this.background) {
            this.background.setVisible(false); // Hide the background.
        }
    }

    /**
     * Shows the level selection UI, making buttons interactive based on level availability.
     * @param {number} levelLength - The number of levels available for selection based on difficulty and progression.
     */
    show() {
        if (this.background) {
            this.background.setVisible(true); // Ensure the background is visible.
        }
        let difficultyIndex = this.scene.difficultyIndex; // Current difficulty index.
		let currIndex = 0;
        // Loop through all buttons, updating visibility and details based on level availability.
        this.buttonList.forEach((buttonObject, index) => {
            const level = buttonObject.currButton.getData('level');
            if (currIndex++ < this.scene.achievedScores[difficultyIndex].length+1) // Color normally and interactable 
			{
                buttonObject.currButton.setVisible(true);
                buttonObject.currButton.setTint(0xffffff); // Normal color
                buttonObject.currButton.setInteractive();
				buttonObject.detailText.setVisible(true);
				if(this.scene.achievedScores[difficultyIndex][index])
				{
					buttonObject.detailText.setText(this.scene.achievedScores[difficultyIndex][index] + '/' + this.scene.maxScores[index]);
				}
				else 
				{
					buttonObject.detailText.setText('0/' + this.scene.maxScores[index]);
				}
            } 
			else // Past this point, all levels are gray since you haven't reached here. Not interactable
			{
                buttonObject.currButton.setVisible(true);
                buttonObject.currButton.setTint(0xaaaaaa); // Greyed out
                buttonObject.currButton.disableInteractive();
				buttonObject.detailText.setVisible(false);
            }
        });
		
		this.scene.instructions.hide();
		this.scene.escMenuOpen = false;
		this.scene.escMenu.hide();
    }
}
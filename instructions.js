/**
 * Class Name: Instructions
 * Description: Manages the display of instructions for the game, explaining game objectives, the types of triangles, and power-ups available to the player. 
 * This class provides a clear and concise explanation of the game mechanics and how to interact with different game elements.
 * Expected Inputs: Activation through the game's main menu or escape menu.
 * Expected Outputs: Displays instructional text and possibly navigational options for returning to the game or main menu.
 * Called By: MainMenu class for initial instruction display or GameScene class when accessed via the escape menu.
 * Will Call: Phaser library methods for creating and manipulating text and graphics.
 * @class
 * @author Braeden Ruff
 */
class Instructions 
{
	/**
     * Constructs the instructions screen.
	 * @constructor
     * @param {Phaser.Scene} scene - The current Phaser scene for context.
     */
    constructor(scene) 
	{
		this.scene = scene;
		this.instructionText = null; // Instruction text block for page 1.
		this.instructionText2 = null; // Instruction text block for page 2.
		this.background = null; // Background sprite for the instruction screen.
		this.create(); // Initializes the instruction UI components.
	}
	
	/**
     * Creates and initializes the instruction screen UI, including text and background.
     */
	create()
	{
		
        // Add background
        this.background = this.scene.add.sprite(0, 0, 'background-menu'); // Set up the background for the instruction screen.
        this.background.setOrigin(0, 0); // Align top-left
        this.background.setDisplaySize(this.scene.sys.game.config.width, this.scene.sys.game.config.height);
		this.background.setDepth(10000);
		
		 // First page instruction text, explaining objectives and enemies.
		this.instructionText = this.scene.add.text(760, 120, 'Your objective is to destory all the triangles, and not hit the white squares or the grey architecture.\n\n' +
		'There are various different types of triangles:\n\t\t\t' +
		'Green triangles: these are the weakest of the triangles. Simply move your mouse over them and they will fade out and die\n\t\t\t' + 
		'Stealthed triangles: they are killed the the same way. They are the same colour as the background, with a slightly darker outline. Keep an eye out for them\n\t\t\t' + 
		'Armored triangles: they are tougher. You will have to click them to kill them. Wooden armor takes 1 click, metal armor takes 2 clicks, and cyborg armor takes 3 clicks', 
		{ 
			fontSize: '16px', 
			fill: '#FFF', 
			wordWrap: {width:720},
			stroke: '#000',
			strokeThickness: 4, 
		}).setOrigin(1, 0).setDepth(10001);
		
		 // Second page instruction text, explaining power-ups and additional game mechanics.
		this.instructionText2 = this.scene.add.text(760, 120, 'There are 3 types of upgrades you may get that are in the shape of pentagons:\n\t\t\t' + 
		'Clear-friendlies: the first type clears the screen of all friendly shapes, making it easier to navigate to the triangles\n\t\t\t' + 
		'Intangible: the second type makes the cursor intangible for 1 second. While intangible, you cannot touch triangles, upgrades, squares, or architecture. You may activate it by pressing E, and deactivate it early by clicking E again\n\t\t\t' + 
		'Slow-time: the last time slows down time for 3 seconds. You may activate it by pressing S, and deativate it early by clicking S again\n\n' + 
		'You can access the menu by pressing escape, which allows you to view this page again, select your level, or change difficulties.', 
		{ 
			fontSize: '16px', 
			fill: '#FFF', 
			wordWrap: {width:720},
			stroke: '#000',
			strokeThickness: 4, 
		}).setOrigin(1, 0).setDepth(10001);
		
		// Navigation button for going between first text and second text.
		this.next = this.scene.add.sprite(this.scene.sys.game.config.width-100,this.scene.sys.game.config.height-200, 'next')
		.setDepth(10001)
		.setOrigin(0,0)
		.setDisplaySize(50,50)
		.setInteractive()
		.on('pointerdown', () =>
		{
			this.nextText();
		});
		this.hide();
	}
	
	/**
     * Hides the instruction screen and all its components.
     */
	hide() 
	{
        // Hide or clean up the menu
        if(this.instructionText) 
		{
			this.instructionText.setVisible(false);
        }
		if(this.instructionText2) 
		{
			this.instructionText2.setVisible(false);
        }
		if(this.background) 
		{
			this.background.setVisible(false);
		}
		if(this.next)
		{
			this.next.setVisible(false);
		}
		// Reenable the escape key listener (see this.show()).
		this.scene.input.on('keydown-ESC', this.scene.handleEscape, this);
    }
	/**
     * Goes from the first page text to the second page text.
     */
	nextText()
	{
		 // If you're on the second page and hit the next button, get off instruction text.
		if(this.instructionText2.visible)
		{
			// If showing the second block, hide the instructions and potentially return to the game or main menu.
			this.hide();
			// If you're on the main menu, hide bring the main menu back
			if(this.scene.difficultyAdjustment === 0)
			{
				this.scene.mainMenu.hide();
				this.scene.mainMenu.create();
			}
			else
			{
				this.scene.handleEscape();
			}
			return;
		}
		// Otherwise, hide the first block and show the second.
		if(this.instructionText) 
		{
			this.instructionText.setVisible(false);
        }
		if(this.instructionText2) 
		{
			this.instructionText2.setVisible(true);
        }
	}
	/**
     * Shows the instruction screen, making it visible and interactive.
     */
	show()
	{
		// Disable the escape key listener to prevent opening the escape menu.
		this.scene.input.off('keydown-ESC', this.scene.handleEscape, this);
		// Make the first block of instructions visible and prepare the screen.
        if(this.instructionText) 
		{
			this.instructionText.setVisible(true);
        }
		if(this.instructionText2) 
		{
			this.instructionText2.setVisible(false);
        }
		if(this.background) 
		{
			this.background.setVisible(true);
		}
		if(this.next)
		{
			this.next.setVisible(true);
		}
	}
}
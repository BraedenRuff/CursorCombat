import { level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11, level12, level13, level14, level15, level16, level17, level18, level19, level20 } from './levels.js';
import { Level } from './level.js';

/**
 * Class Name: GameScene
 * Description: Manages the main game scene, including level loading, score tracking, and achievements.
 * Expected Inputs: User interactions (mouse clicks, keyboard inputs).
 * Expected Outputs: Game progression, visual updates, and achievement unlocks.
 * Called By: Phaser Game Framework during game initialization and runtime.
 * Will Call: Level class methods for level loading and updating; Phaser library methods for input handling and rendering.
 * @class
 * @param {Phaser.Scene} scene
 * @author Braeden Ruff
 */
class GameScene extends Phaser.Scene {
    /**
     * Initializes a new instance of the GameScene class.
	 * @constructor
     */
    constructor() {
        super({ key: 'GameScene' }); // Initialize with a unique key for Phaser.
        this.score = 0; // Track the current score.
        // Array containing all level data, imported from levels.js.
        this.levels = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11, level12, level13, level14, level15, level16, level17, level18, level19, level20 ]; // Array of levels.
        this.currentLevelIndex = 0; // Index of the currently loaded level.
		this.loadLevelStartTime = 0; // Time when the current level was loaded. Used for debugging and helping make new levels
		this.achievements = { // Track achievements.
			"Win-0": false, // Winning at easy difficulty
			"Win-1": false, // Winning at medium difficulty
			"Win-2": false, // Winning at hard difficulty
			"Win-3": false, // Winning at insane difficulty
			"Max-0": false, // Achieving the max score on easy difficulty
			"Max-1": false, // Achieving the max score on medium difficulty
			"Max-2": false, // Achieving the max score on hard difficulty
			"Max-3": false, // Achieving the max score on insane difficulty
			"Friendly-Fire": false, // Killing all squares and architecture
			"Destructive": false, // Killing all squares, triangles, and architecture
		};
		this.healthBar = null; // Represents the player's health bar object.
		this.intangibleEffectTweenIn = null; // Tween for the intangible effect appearing animation.
		this.intangibleEffectTweenOut = null; // Tween for the intangible effect disappearing animation.
		this.intangibleEffect = null; // Object for the intangible effect visualization.
		this.slowtimeFactor = 1; // Controls the game's time scaling factor, 1 being normal speed.
		this.fadeTween = null; // Tween for black screen fade effect (for making levels harder).
		this.mainMenu = null; // Reference to the main menu object, used for navigation and game settings.
		this.difficulty = null; // Current difficulty setting of the game.
		this.difficultyAdjustment = 0; // Numeric representation of the difficulty adjustment. 
		this.cutsceneText = null; // Text displayed during cutscenes.
		this.escMenu = null; // Reference to the escape menu object.
		this.escMenuOpen = false; // Flag to track if the escape menu is currently open.
		this.achievedScores = [[],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[],[]]; // Arrays to track scores achieved in each level at different difficulties.
		this.maxScores = [6, 6, 4, 8, 7, 24, 6, 7, 13, 7, 20, 10, 10, 9, 19, 21, 14, 25, 20, 38]; // Predefined max scores for each level to determine level completion and achievement unlocking.
		this.levelSelect = null; // Reference to the level selection menu object.
		this.difficultyIndex = 0; // Index representing the current difficulty level.
		this.instructions = null; // Instructions class reference.
		this.isMuted = false; // Flag to track if the game sound is muted. Used when refocusing screen
    }

    /**
     * Preloads game assets.
     */
    preload() {
		this.load.image('clear-friendlies', 'clear-friendlies.png');
		this.load.image('intangible', 'intangible.png');
		this.load.image('slowtime', 'slowtime.png');
		this.load.image('armored_1', 'armored_1.png');
		this.load.image('armored_2', 'armored_2.png');
		this.load.image('armored_3', 'armored_3.png');
		this.load.image('background-menu', 'background-menu.png');
		this.load.image('cutscene_1', 'cutscene_1.png');
		this.load.image('cutscene_2', 'cutscene_2.png');
		this.load.image('cutscene_3', 'cutscene_3.png');
		this.load.image('cutscene_4', 'cutscene_4.png');
		this.load.image('cutscene_5', 'cutscene_5.png');
		this.load.image('cutscene_6', 'cutscene_6.png');
		this.load.image('sound_on', 'sound_on.png');
		this.load.image('sound_off', 'sound_off.png');
		this.load.image('next', 'next.png');
		this.load.audio('pop', 'mixkit-click-balloon-small-burst-3070.wav');
		this.load.audio('win', 'mixkit-fantasy-game-success-notification-270.wav');
		this.load.audio('lose', 'mixkit-losing-piano-2024.wav');
		this.load.audio('background', 'Maximalism(chosic.com).mp3');
    }

    /**
     * Creates the game scene, initializing the level, score, and input handlers.
     */
    create() 
	{
		// Cutscene sentences
		this.sentences = [
			"In the digital realm of Cubeville, all the shapes lived in harmony.",
			"But one day, the triangles attacked and broke that peace. For centuries, the Triangles continued their relentless assault and the Cubes fought valiantly...",
			"... but slowly the Cubes are being pushed back.", 
			"The Square Council, in a desperate bid to save their citizens and restore peace, performed a ritual to summon the ancient magic: cursor technology.", 
			"Cursors are a powerful magic, capable of killing all shapes in it's path.",
			"As the operator of this technology, you are Cubeville's last line of defense against the triangle invasion. We're counting on you..."
		];
		
        // Setup score, level display, and buff texts.
        this.scoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#FFF' });
        this.levelText = this.add.text(16, 46, '', { fontSize: '32px', fill: '#FFF' });
        this.intangibleText = this.add.text(this.cameras.main.width - 40, 30, '', { fontSize: '16px', fill: '#FFF' }).setOrigin(1, 0);
        this.slowtimeText = this.add.text(this.cameras.main.width - 40, 50, '', { fontSize: '16px', fill: '#FFF' }).setOrigin(1, 0);
		
        // Display reset instructions and setup key event listeners for resetting level or game.
        this.resetText = this.add.text(this.cameras.main.width - 40, 10, '', { fontSize: '16px', fill: '#FFF' }).setOrigin(1, 0);
		
		// Enable pointer events only when over the canvas.
		const canvas = this.sys.game.canvas;
		canvas.addEventListener('pointerenter', () => this.input.enabled = true);
		canvas.addEventListener('pointerleave', () => this.input.enabled = false);
		this.input.setPollAlways(true);

        // Setup pointer down debug output.
        //this.input.on('pointerdown', pointer => {
        //    const elapsedTime = this.time.now - this.loadLevelStartTime; // Calculate elapsed time since level load.
        //   console.log(`${pointer.x} ${pointer.y} Elapsed Time: ${elapsedTime}ms`); //only used when debugging
        //});

        this.input.keyboard.on('keydown-R', () => {
			this.time.removeAllEvents(); // Clear scheduled events.
			this.loadCurrentLevel(); // Reload current level.
		});
		
		this.input.keyboard.on('keydown-S', () => {
			if(!this.level.slowtimeActive && !this.level.slowtime) return;
			if(this.level.slowtime)
			{
				if (this.slowtimeTimerEvent) {
					this.slowtimeTimerEvent.remove();
					this.slowtimeTimerEvent = null; // Clear the reference
				}
				this.finishSlowtime();
				return;
			}
			this.setSlowtimeFactor(0.1);
			this.level.slowtime = true;
			this.level.slowtimeActive = false;
			this.slowtimeText.setText('Press S to cancel Slow Time');
			this.slowtimeTimerEvent = this.time.delayedCall(3000 * this.slowtimeFactor, () => { 
				this.finishSlowtime();
			});
		});
		
		this.input.keyboard.on('keydown-E', () => {
			if(!this.level.intangibleActive && !this.level.intangible) return;
			if(this.level.intangible)
			{
				//if it entered here, you want to instant cancel the intangible effect
				if (this.intangibleEffectTweenIn) {
					this.intangibleEffectTweenIn.stop();
				}
				if (this.intangibleEffectTweenOut) {
					this.intangibleEffectTweenOut.stop();
				}

				// immediately hide or destroy the intangible effect
				if (this.intangibleEffect) {
					this.intangibleEffect.setVisible(false); // or this.intangibleEffect.destroy();
				}
				if (this.intangibleTimerEvent) {
					this.intangibleTimerEvent.remove();
					this.intangibleTimerEvent = null; // Clear the reference
				}
				// Reset state
				this.finishIntangible();
				return;
			}
			this.level.intangibleActive = false;
			this.level.intangible = true;
			this.intangibleText.setText('Press E to cancel Intangible');
			
			// Activate intangibility logic...
			const pointer = this.input.activePointer;
			this.intangibleEffect = this.add.circle(pointer.x, pointer.y, 40, 0x777777);
			
			this.intangibleEffect.setAlpha(0);

			// Update the effect's position to follow the cursor
			this.input.on('pointermove', (pointer) => {
				this.intangibleEffect.setPosition(pointer.x, pointer.y);
			});

			// Fade effect in
			this.intangibleEffectTweenIn = this.tweens.add({
				targets: this.intangibleEffect,
				alpha: { from: 0, to: 0.5 },
				duration: 250,
			});

			// Fade effect out
			this.intangibleEffectTweenOut = this.tweens.add({
				targets: this.intangibleEffect,
				alpha: { from: 0.5, to: 0 },
				duration: 250,
				delay: 750,
			});
			this.adjustActiveTweens();
			// Create and store the delayed call
			this.intangibleTimerEvent = this.time.delayedCall(1000, () => {
				this.finishIntangible();
			});
		});
		
		this.healthBar = new HealthBar(this);
		
        // Initialize the level.
        this.level = new Level(this);
		this.mainMenu = new MainMenu(this);
		this.escMenu = new EscapeMenu(this);
		this.instructions = new Instructions(this);
	}
	
	/**
     * Regularly updates the game state, such as checking for level completion.
     * @param {number} time - The current time.
     * @param {number} delta - The time elapsed since the last update.
     */
    update(time, delta) 
	{
        this.level.update(time, delta); // Delegate update to the level manager.
    }
	
	/**
     * Adjusts the game's difficulty based on player selection or game progression.
     * @param {string} difficulty - The selected difficulty level.
     */
	setDifficulty(difficulty)
	{
		this.difficulty = difficulty;
		
		// Slightly inefficient compared to enum but this isn't called very often and finishes in under a millisecond anyway so it doesn't matter 
		if(this.difficulty === 'Easy')
		{
			this.difficultyAdjustment = 0.5;
			this.difficultyIndex = 0;
		}
		
		if(this.difficulty === 'Medium')
		{
			this.difficultyAdjustment = 0.8;
			this.difficultyIndex = 1;
		}
		
		if(this.difficulty === 'Hard')
		{
			this.difficultyAdjustment = 1;
			this.difficultyIndex = 2;
		}
		
		if(this.difficulty === 'Insane')
		{
			this.difficultyAdjustment = 1.5;
			this.difficultyIndex = 3;
		}
	}
	
	/**
     * Handles the logic to mute or unmute the game sounds based on player interaction or game events.
     */
	switchMute()
	{	
		// Toggle the mute state
		this.isMuted = !this.isMuted;
		this.sound.mute = !this.sound.mute;

		// Update the button's texture based on the new mute state
		this.soundButton.setTexture(this.sound.mute ? 'sound_on' : 'sound_off' );
	}
	
	/**
     * Applies a "slow time" effect, reducing the game's speed for a short duration.
     * @param {number} factor - The factor by which to slow down the game time.
     */
	setSlowtimeFactor(factor) 
	{
		this.slowtimeFactor = factor;
		this.time.timeScale = this.slowtimeFactor;
		this.adjustActiveTweens(); 
	}

	/**
	 * Adjusts the time scale of active tweens to synchronize with the game's current time scale.
	 * This ensures that all moving or animating objects in the game match the speed set by `setSlowtimeFactor`.
	 * Tweens control various aspects such as movement, growth, or fading effects of game objects.
	 */
	adjustActiveTweens() {
		this.level.shapes.forEach((shape) => {
			// For each shape, adjust the time scale of its tweens if they exist.
			if (shape.movementTween) {
				shape.movementTween.timeScale = this.slowtimeFactor; // Adjusts movement speed to match game speed.
			}
			if (shape.growingTween) {
				shape.growingTween.timeScale = this.slowtimeFactor; // Adjusts growing/shrinking speed to match game speed.
			}
			if (shape.velocityTween) {
				shape.velocityTween.timeScale = this.slowtimeFactor; // Adjusts velocity changes to match game speed.
			}
		});
		
		// Additionally, adjust the time scale of global tweens affecting the game state, such as intangibility and fading effects.
		if (this.intangibleEffectTweenIn) {
			this.intangibleEffectTweenIn.timeScale = this.slowtimeFactor; // Adjusts the fade-in speed of the intangible effect.
		}
		if (this.intangibleEffectTweenOut) {
			this.intangibleEffectTweenOut.timeScale = this.slowtimeFactor; // Adjusts the fade-out speed of the intangible effect.
		}
		if (this.fadeTween) {
			this.fadeTween.timeScale = this.slowtimeFactor; // Adjusts the speed of any ongoing fade transitions.
		}
	}
		
	/**
     * Displays the cutscene at the beginning of the game or between levels.
     */
	showCutscene()
	{		
		// Start the background music on the start of the cutscene
		this.backgroundMusic = this.sound.add('background', { loop: true, volume: 0.05 });
		this.backgroundMusic.play();
		
		// If you tab off the screen, pause all the sounds
		this.sys.game.events.on('blur', () => {
			// Game lost focus, pause sounds.
			this.sound.pauseAll();
		});
		
		this.sys.game.events.on('focus', () => {
			// Temporarily store whether the background music timestamp
			let playbackTime = this.backgroundMusic.seek;

			// Stop all sounds to clear any sounds that might have started playing, else any level fails all pile up and play at once when you reclick
			this.sound.stopAll();

			// Restart background music where you left off
			this.backgroundMusic.play({
				loop: true,
				volume: 0.05,
				seek: playbackTime
			});

			this.sound.setMute(this.isMuted); // re-mute on refocus if needed
		});
		
		this.currentSentenceIndex = 0;
		this.input.once('pointerdown', this.handlePointerDown, this);
		
        // Listen for a key press to skip the cutscene
        this.input.keyboard.on('keydown-SPACE', this.handleSpaceDown, this);
	}
	
	/**
	 * Handles the pointer down event to display the next sentence in the cutscene or start the game.
	 */
	handlePointerDown() 
	{
		 // Displays the current sentence from the sentences array based on the current index.
		this.input.on('pointerdown', this.fadeOutCurrentSentence, this);
		this.displaySentence(this.currentSentenceIndex);
	}
	/**
	 * Handles the SPACE key down event to skip the cutscene or proceed to the next part immediately.
	 */
	handleSpaceDown() 
	{
		 // Removes the pointerdown listener to prevent advancing the cutscene further with clicks.
		this.input.off('pointerdown', this.handlePointerDown, this);
		// Sets the sentence index to the length of the sentences array, effectively ending the cutscene.
		this.currentSentenceIndex = this.sentences.length;
		this.displaySentence(this.currentSentenceIndex);
	}
	
	/**
	 * Displays a sentence from the cutscene or concludes the cutscene if all sentences are shown.
	 * @param {number} index - The index of the sentence to display.
	 */
	displaySentence(index) 
	{
		// Check if the index is out of bounds
		if (index >= this.sentences.length) 
		{
			this.endCutscene();
			return;
		}
		this.prepareSentenceDisplay(index);
	}
	
	/**
	 * Ends the cutscene, performing cleanup and initializing the game level.
	 */
	endCutscene() 
	{
		// Remove specific listeners and reset game state as necessary to start or resume the game.
		this.input.keyboard.off('keydown-SPACE', this.handleSpaceDown, this);
		this.input.off('pointerdown', this.fadeOutCurrentSentence, this);
		this.setSlowtimeFactor(1);
		this.time.removeAllEvents(); // Clear scheduled events.
		this.currentLevelIndex = 0; // Reset to first level.
		
		// Fade out logic and level initialization happen here.
		let black = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000).setOrigin(0, 0).setDepth(10001);
		black.alpha = 0; // Start transparent.

		// Fade the rectangle in (increase alpha to 1)
		this.tweens.add({
			targets: black,
			alpha: 1,
			ease: 'Linear',
			duration: 500,
			hold: 500,
			onComplete: () => {
				// Destroy the current sentence text and image to free up resources
				if (this.currentSentenceText) 
				{
					this.currentSentenceText.destroy();
				}
				if (this.currentCutsceneImage) 
				{
					this.currentCutsceneImage.destroy();
				}
				
				// After hold, manually create a fade-out effect 
				this.tweens.add(
				{
					targets: black,
					alpha: 0,
					ease: 'Linear',
					duration: 500,
					onComplete: () => 
					{
						// Destroy the rectangle after fade-out
						black.destroy();
						// Set the text for score, level, and reset
						this.scoreText.setText('Score: ');
						this.levelText.setText('Level: ' + (this.currentLevelIndex + 1));
						this.resetText.setText('Press R to Reset Level');
						
						// Add the sound button.
						this.soundButton = this.add.image(this.cameras.main.width-280, 20, 'sound_on').setInteractive().setScale(0.2);
						
						// Click the sound icon or press M to toggle mute (muting only works after the cutscene)
						this.soundButton.on('pointerdown', () => 
						{
							this.switchMute();
						});
						this.input.keyboard.on('keydown-M', () => 
						{
							this.switchMute();
						});
						
						// Create the levelSelect and attach the keydwon-ESC after the cutscene (esc only works after the main-menu/cutscene)
						this.levelSelect = new LevelSelect(this);
						this.input.keyboard.on('keydown-ESC', this.handleEscape, this);
						this.loadCurrentLevel();
					},
				});
			},
		});
	}
	
	/**
	 * Prepares and displays a sentence along with its associated cutscene image.
	 * @param {number} index - The index of the sentence to display.
	 */
	prepareSentenceDisplay(index) 
	{
		// If there's already text displayed, remove it
		if (this.currentSentenceText) 
		{
			this.currentSentenceText.destroy();
		}
		if (this.currentCutsceneImage) 
		{
			this.currentCutsceneImage.destroy();
		}
		
		const cutsceneKey = `cutscene_${index + 1}`; // All the images have the key cutscene_(number)
		this.currentCutsceneImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, cutsceneKey).setAlpha(0).setDepth(10000);
		
		// Add the new sentence text but make it invisible initially
		this.currentSentenceText = this.add.text(100, 100, this.sentences[index], {
			font: '18px Arial',
			fill: '#ffffff',
			wordWrap: { width: 600 },
			stroke: '#000000',
			strokeThickness: 3,
		}).setAlpha(0).setDepth(10001);
		
		// Fade in the current sentence
		this.tweens.add({
			targets: [this.currentSentenceText, this.currentCutsceneImage],
			alpha: 1,
			duration: 250, 
		});
	}
	
	/**
	 * Toggles the escape menu's visibility, handling the game's pause state and menu interactions.
	 */
	handleEscape()
	{
		// Checks for the current state of the escape menu and other overlays,
		// then toggles visibility or navigates accordingly.
		// If instructions is showing, and escape is hit, remove everything.
		if(this.instructions.background.visible)
		{
			this.instructions.hide();
			this.escMenuOpen = false;
			this.escMenu.hide();
			this.levelSelect.hide();
			return;
		}
		// If you're at a level select because you beat a level, you must choose a level.
		if(this.levelSelect.background.visible && this.level.shapes.length === 0)
		{
			return;
		}
		
		// Toggle the escape menu logic.
		this.escMenuOpen = !this.escMenuOpen;
		if(this.escMenuOpen)
		{
			this.escMenu.create();
		}
		else
		{
			this.escMenu.hide();
		}
		// Make sure the level select is hidden.
		this.levelSelect.hide();
	}
	
	/**
	 * Fades out the current sentence and associated cutscene image, then progresses to display the next sentence.
	 * This method creates a fade-out animation for the text and image, smoothly transitioning out before moving to the next part of the cutscene.
	 */
	fadeOutCurrentSentence() {
		// Create a tween for fading out the current sentence text and cutscene image.
		this.tweens.add({
			targets: [this.currentSentenceText, this.currentCutsceneImage], // The objects to apply the fade-out effect to.
			alpha: 0, // End the fade with full transparency, making the objects invisible.
			duration: 250, // The duration of the fade effect in milliseconds.
			onComplete: () => {
				// Increment the current sentence index to move to the next sentence and display it.
				this.displaySentence(++this.currentSentenceIndex);
			}
		});
	}

	/**
	 * Handles the termination of the intangible state of the cursor in the game. This method resets the intangible flags,
	 * updates the intangible UI text, and checks all shapes to apply any necessary interactions post-intangibility.
	 */
	finishIntangible() {
		this.level.intangible = false; // Reset the intangible flag indicating the cursor is no longer intangible.
		if (this.level.intangibleActive) {
			// If the intangible power-up can be activated again, update the UI text to prompt the cursor.
			this.intangibleText.setText('Press E to become Intangible');
		} else {
			// Clear the UI text if the intangible power-up is not available.
			this.intangibleText.setText('');
		}
		// Perform a check on all shapes in case interactions were missed while intangible.
		this.level.checkAllShapes();
	}
	
	/**
	 * Concludes the slow time effect in the game. This method resets the slowtime state,
	 * restores the game's time scale to normal, and updates the slowtime UI text accordingly.
	 */
	finishSlowtime() {
		this.level.slowtime = false; // Reset the slowtime flag indicating slow motion is no longer in effect.
		this.setSlowtimeFactor(1); // Restore the game's time scale to normal speed.
		if (this.level.slowtimeActive) {
			// If the slowtime power-up can be activated again, update the UI text to prompt the player.
			this.slowtimeText.setText('Press S to Slow Time');
		} else {
			// Clear the UI text if the slowtime power-up is not available.
			this.slowtimeText.setText('');
		}
	}
	
    /**
     * Loads the current level, resetting score and handling level setup.
     */
    loadCurrentLevel() 
	{		
		this.levelText.setText('Level: ' + (this.currentLevelIndex + 1));
		this.time.removeAllEvents();
        
        this.score = 0; // Reset score for the current level.
		this.level.clearShapesNoSound();
		this.level.shapes = this.level.shapes.filter(shape => !shape.toBeRemoved); // Clean up shapes.
        this.level.loadLevel(this.levels[this.currentLevelIndex]); // Load level data.
        this.loadLevelStartTime = this.time.now; // Capture the start time. (used for debugging)
    }
	
    /**
     * Proceeds to the next level or triggers the win screen based on game progress.
     */
    loadNextLevel() 
	{
		// Sets the achieved score for all levels less difficult. The purpose is that if they complete it on insane, they can definitely do it on easy, medium, and hard
		// This saves the player from having to play through the entire game on every difficulty, and can instead play on the highest difficulty and if it's too hard, switch to a lower difficulty
		for(let currIndex = 0; currIndex <= this.difficultyIndex; ++currIndex)
		{
			if(this.achievedScores[currIndex][this.currentLevelIndex])
			{
				this.achievedScores[currIndex][this.currentLevelIndex] = Math.max(this.achievedScores[currIndex][this.currentLevelIndex], this.score);
			}
			else
			{
				this.achievedScores[currIndex].push(this.score);
			}
			// See if we got the max score
			if (this.achievedScores[currIndex].length === this.maxScores.length && this.achievedScores[currIndex].every((val, index) => val === this.maxScores[index])) {
				this.unlockAchievement("Max-" + currIndex);
			}
		}
        this.currentLevelIndex += 1; // Move to next level.
		if(this.currentLevelIndex === this.levels.length) { // Check if all levels are completed.
			this.displayWinScreen(); // Display win screen.
			// Unlock for every easier difficulty
			for(let currIndex = 0; currIndex <= this.difficultyIndex; ++currIndex)
			{
				this.unlockAchievement("Win-" + currIndex);
			}
			return;
		}
        
		// show the level select and allow selection of the next level
		this.levelSelect.show();
    }

    /**
	 * Adds animation and display logic for the winning screen after completing all levels.
	 */
	displayWinScreen() {
		// Create a bright background to highlight the win state.
		let brightBackground = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0xffffff).setOrigin(0, 0);
		brightBackground.alpha = 0; // Start transparent.

		// Animate the background to become fully bright.
		this.tweens.add({
			targets: brightBackground,
			alpha: 1,
			duration: 500, // Half a second to full brightness.
			hold: 500, // Hold full brightness for half a second.
			ease: 'Linear',
			onComplete: () => {
				this.showWinText(brightBackground); // Show winning text after background is bright.
			}
		});
	}

	/**
	 * Creates a fade-in and fade-out effect (blackout) over the entire game screen based on specified parameters.
	 * This method is used for the black specified in levels that adds challenge by removing visibility.
	 * @param {Array} fadeArray - An array of parameters for each fade effect, including delay before starting, duration, and repeat count.
	 */
	animateBlackout(fadeArray) {
		// Check if there's at least one set of fade parameters to process.
		if (fadeArray.length === 0) return; // Exit the method if the fade array is empty.

		// Create a black rectangle that covers the entire game screen to use for the fade effect.
		this.blackBackground = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000).setOrigin(0, 0).setDepth(10000);
		this.blackBackground.alpha = 0; // Start with the rectangle being fully transparent.

		// Defines a function to initiate a fade animation based on given parameters.
		const initiateFade = (delayBeforeStart, durationOfFade, repeat) => {
			if (this.fadeTween) {
				// If there's an existing fade tween, stop it before starting a new one.
				this.fadeTween.stop();
				this.fadeTween = null;
			}
			// Schedule the fade tween to start after the specified delay.
			this.time.delayedCall(delayBeforeStart, () => {
				// Create a new tween for fading the black rectangle in and out.
				this.fadeTween = this.tweens.add({
					targets: this.blackBackground, // The black rectangle.
					alpha: 1, // Fade to full opacity.
					ease: 'Linear', // Use a linear easing for the fade.
					duration: durationOfFade, // Duration for the fade to reach full opacity.
					repeat: repeat, // Number of times to repeat the fade in/out.
					yoyo: true, // Automatically reverse the tween, creating a fade-out effect.
					repeatDelay: 1000, // Delay between repeats.
					hold: 250, // How long to hold the fade at full opacity before starting the yoyo effect.
					onComplete: () => {
						// Once the fade is complete, reset and remove the black rectangle.
						this.blackBackground.alpha = 0;
						this.blackBackground.destroy();
					},
				});
			});
		};

		// Iterate over each set of fade parameters in the array and initiate the fade animation.
		fadeArray.forEach(([delayBeforeFade, durationOfFade, repeat]) => {
			initiateFade(delayBeforeFade, durationOfFade, repeat);
		});
	}

	/**
	 * Shows "YOU WIN" text and animates it to the center of the screen.
	 * @param {Phaser.GameObjects.Rectangle} brightBackground - The bright background object.
	 */
	showWinText(brightBackground) {
		let winText = this.add.text(this.sys.game.config.width / 2, 0, 'YOU WIN', {
			fontSize: '64px',
			fill: '#000',
			fontStyle: 'bold'
		}).setOrigin(0.5, 0.5);

		// Animate the win text to "slam" down from the top to the center.
		this.tweens.add({
			targets: winText,
			y: this.sys.game.config.height / 2,
			duration: 1000,
			ease: 'Bounce.easeOut', // Creates a bounce effect.
			onComplete: () => {
				// Fade out the win text after a delay, then reset for a new game.
				this.tweens.add({
					targets: winText,
					alpha: 0,
					delay: 2000, // 2 seconds delay before fading.
					duration: 1000, // Fade duration.
					ease: 'Linear',
					onComplete: () => {
						brightBackground.destroy(); // Clean up the bright background.
						this.levelSelect.show(); // Go back to the level select screen.
					}
				});
			}
		});
	}

	/**
	 * Unlocks the specified achievement and updates the display accordingly.
	 * @param {string} achievementName - The name of the achievement to unlock.
	 */
	unlockAchievement(achievementName) {
		if (this.achievements.hasOwnProperty(achievementName) && !this.achievements[achievementName]) {
			this.achievements[achievementName] = true; // Mark the achievement as obtained.
			this.updateAchievementsDisplay(achievementName); // Update the achievements display.
		} else {
			console.warn("Achievement isn't implemented or already unlocked.");
		}
	}

	/**
	 * Updates the display to show which achievements have been obtained.
	 * @param {string} achievement - The name of the achievement that was unlocked.
	 */
	updateAchievementsDisplay(achievement) {
		const achievementElement = document.getElementById(achievement);
		achievementElement.textContent += " [OBTAINED]"; // add [OBTAINED] to the HTML text.
	}

}
export default GameScene;
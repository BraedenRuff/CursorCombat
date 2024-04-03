/**
 * Class Name: HealthBar
 * Description: Manages the health bar display and animations within the game scene. It handles showing, hiding,
 * decreasing, and refilling the health bar based on game events and player actions.
 * Expected Inputs: Commands to show, hide, decrease, or refill the health bar, triggered by game events, particularly if it's on screen or not.
 * Expected Outputs: Visual updates to the health bar to reflect current health status or game state changes.
 * Called By: Level class when an area is on the screen and when it's off.
 * Will Call: Phaser library methods for graphical display and tweening for animations.
 * @class
 * @author Braeden Ruff
 */
class HealthBar
{
	/**
     * Constructs the health bar with initial settings.
	 * @constructor
     * @param {Phaser.Scene} scene - The current game scene to which the health bar belongs.
     */
    constructor(scene) {
        this.scene = scene; // Reference to the Phaser game scene for adding graphical elements.
        // Create and configure the health bar's background graphics.
        this.healthBarBackground = this.scene.add.graphics();
        this.healthBarBackground.fillStyle(0x000000, 1); // Black color for background.
        this.healthBarBackground.fillRect(50, this.scene.cameras.main.height - 50, 200, 20); // Position and dimensions.
        this.healthBarBackground.setAlpha(0); // Initially hidden.

        // Create and configure the health bar's fill graphics.
        this.healthBarFill = this.scene.add.graphics();
        this.healthBarFill.fillStyle(0x00FF00, 1); // Green color for fill.
        this.healthBarFill.fillRect(50, this.scene.cameras.main.height - 50, 200, 20); // Match background position and dimensions.
        this.healthBarFill.setAlpha(0); // Initially hidden.
        
        this.dying = true; // Indicates whether the health bar is in a "decreasing" state.
    }

    /**
     * Hides the health bar with a fade-out animation.
     */
    hideHealthBar() {
        // Do nothing if the health bar is already fully transparent.
        if (!this.healthBarBackground.alpha === 0) {
            return;
        }

        // Fade out the health bar background.
        this.scene.tweens.add({
            targets: this.healthBarBackground,
            alpha: 0,
            ease: 'Linear',
            duration: 500,
        });

        // Fade out the health bar fill and reset it once fully hidden.
        this.scene.tweens.add({
            targets: this.healthBarFill,
            alpha: 0,
            ease: 'Linear',
            duration: 500,
            onComplete: () => {
                this.refillAndPauseHealthBar(); // Reset the health bar fill once hidden.
            }
        });
		this.refillAndPauseHealthBar();
    }
	
	/**
	 * This method hides the healthbar instantly and stops depleting
	 */
	hideHealthBarInstant()
	{
		this.refillAndPauseHealthBar();
		this.healthBarFill.setAlpha(0);
		this.healthBarBackground.setAlpha(0);
	}
    /**
     * Shows the health bar with a fade-in animation.
     */
    showHealthBar() {
        // Do nothing if the health bar is already fully visible.
        if (this.healthBarBackground.alpha === 1) {
            return;
        }
        
        this.decreaseHealthBar(); // Start decreasing health bar to show depletion over time.

        // Fade in the health bar background.
        this.scene.tweens.add({
            targets: this.healthBarBackground,
            alpha: 1,
            ease: 'Linear',
            duration: 500,
        });

        // Fade in the health bar fill.
        this.scene.tweens.add({
            targets: this.healthBarFill,
            alpha: 1,
            ease: 'Linear',
            duration: 500,
        });
    }

    /**
     * Decreases the health bar fill over time, simulating health depletion.
     */
    decreaseHealthBar() {
        this.dying = true; // Mark the health bar as depleting.

        // If an existing tween is running, stop it before starting a new one.
        if (this.dyingTween) {
            this.dyingTween.stop();
            this.dyingTween = null;
        }

        // Animate the decrease of the health bar fill.
        this.dyingTween = this.scene.tweens.add({
            targets: this.healthBarFill,
            scaleX: 0, // Target zero scale to fully deplete the health bar.
            ease: 'Linear',
            duration: 4000, // Duration for complete depletion.
            onUpdate: tween => {
                const scale = tween.getValue();
                this.healthBarFill.scaleX = scale; // Dynamically update the scale.
                // Adjust the fill's position to deplete from right to left.
                this.healthBarFill.x = 50 * (1 - scale);
            },
            onComplete: () => {
                // Once depleted, remove all shapes and reset the score.
                this.scene.level.clearShapesNoSound();
                this.scene.score = 0; // Reset score.
            }
        });
    }

    /**
     * Stops any ongoing health depletion and refills the health bar to full.
     */
    refillAndPauseHealthBar() {
        this.dying = false; // Stop health depletion.
        
        // If there's an ongoing depletion animation, stop it.
        if (this.dyingTween) {
            this.dyingTween.stop();
            this.dyingTween = null;
        }

        // Refill the health bar to full and reset its position.
        this.healthBarFill.scaleX = 1;
        this.healthBarFill.x = 0;
    }
}
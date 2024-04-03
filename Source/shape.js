/**
 * Class Name: Shape
 * Description: This class serves as the base for all drawable shapes in the game. It provides common properties and methods
 * that are shared across different types of shapes, such as triangles, squares, and custom architecture shapes. It handles
 * the basic physics properties like position, velocity, and angular velocity, as well as graphical properties including scaling
 * and rotation. It supports animations for movement and scaling.
 * 
 * Expected Inputs:
 * - scene: The current Phaser scene instance where the shape will be added.
 * - x, y: Initial position coordinates of the shape.
 * - velocityX, velocityY: Initial velocity of the shape for movement.
 * - angularVelocity: The velocity at which the shape rotates.
 * 
 * Expected Outputs/Results:
 * - An instance of the Shape class ready to be used in the game, with methods to update its state and render it on the scene.
 * 
 * Called by:
 * - GameScene and Level class when creating new shapes.
 * 
 * Will call:
 * - Phaser's graphics system for rendering.
 * - Phaser's tweens system for animations.
 * 
 * Additional Notes:
 * - This class is abstract and meant to be extended by specific shape classes (e.g., Triangle, Square).
 * - Static ID management is used to assign unique identifiers to each shape instance for easier management and debugging.
 * @class 
 * @author Braeden Ruff
 */

class Shape {
    static staticId = 0;

	/**
	 * The constructor for the shape class
	 * @constructor
	 * @param {Phaser.Scene} scene - The current Phaser scene instance.
	 * @param {number} x - Initial x-coordinate.
	 * @param {number} y - Initial y-coordinate.
	 * @param {number} velocityX - Initial horizontal velocity.
	 * @param {number} velocityY - Initial vertical velocity.
	 * @param {number} angularVelocity - Velocity of rotation.
	 */
    constructor(scene, x, y, velocityX, velocityY, angularVelocity) {
        this.scene = scene; // Reference to the Phaser scene for rendering.
        this.x = x; // X-coordinate of the shape's position.
        this.y = y; // Y-coordinate of the shape's position.
        this.velocityX = velocityX; // Horizontal velocity for movement.
        this.velocityY = velocityY; // Vertical velocity for movement.
        this.angularVelocity = angularVelocity; // Rate of rotation.
        
        // Additional properties for advanced movement and animation.
        this.secondVelocityX = 0; // Secondary horizontal velocity for complex movement patterns.
        this.secondVelocityY = 0; // Secondary vertical velocity for complex movement patterns.
        this.circularVelocityX = 0; // Horizontal velocity component for circular movement.
        this.circularVelocityY = 0; // Vertical velocity component for circular movement.
        
        this.graphics = null; // Graphics object for rendering. Set in derived classes.
        this.scaleFactor = 1; // Current scale factor for the shape.
		this.spriteScaleFactor = 1; // Current scale factor for the sprite.
        this.movementTween = null; // Tween for movement animations.
        this.growingTween = null; // Tween for scaling animations.
		this.velocityTween = null; // Tween for velocity change animations.
        this.rotation = 0; // Current rotation angle in radians.
        this.id = Shape.staticId++; // Unique identifier for the shape.
        this.toBeRemoved = false; // Flag to mark the shape for removal.
		this.dying = false; // Flag to mark if the shape is going through it's dying animation.
    }

    /**
     * To be implemented in subclasses -> creates the graphics object
	 * @abstract
     */
    createGraphics() {
        throw new Error("Method 'createGraphics()' must be implemented.");
    }
	
	/**
     * Regularly updates each shape in the level and checks for level clearing conditions.
     * @param {number} time - The current time.
     * @param {number} delta - The time elapsed since the last update.
     */
    update(time, delta) {
        // Calculate movement since the last frame
        const deltaX = ((this.velocityX * this.scene.difficultyAdjustment + this.secondVelocityX + this.circularVelocityX) * delta * this.scene.slowtimeFactor) / 1000; // Convert velocity to units per ms and multiply by delta
        const deltaY = ((this.velocityY * this.scene.difficultyAdjustment + this.secondVelocityY + this.circularVelocityY) * delta * this.scene.slowtimeFactor) / 1000; // Convert velocity to units per ms and multiply by delta
        const deltaAngle = (this.angularVelocity * delta * this.scene.slowtimeFactor * this.scene.difficultyAdjustment) / 1000; // Convert angular velocity to degrees per ms and multiply by delta
		
        // Update position and rotation
        this.x += deltaX; // Assuming no horizontal movement for simplicity
        this.y += deltaY;
        this.rotation = this.rotation + deltaAngle; // Ensure rotation is defined and increment it

        // Update graphics to reflect new position and rotation
        this.updateGraphics();
    }
	
    /**
	 * Updates the graphical representation of the shape to reflect its current state.
	 * This includes position, rotation, and scale adjustments.
	 */
	updateGraphics() {
		if (this.graphics) {
			this.graphics.setPosition(this.x, this.y); // Update the position of the shape.
			this.graphics.setRotation(this.rotation); // Apply rotation to the shape.
			this.graphics.setScale(this.scaleFactor); // Adjust the scale of the shape.
		}
		if (this.centerSprite) {
			// Update the position of the center sprite to match the shape.
			this.centerSprite.setPosition(this.x, this.y);
			// Apply the same rotation to the center sprite as the shape.
			this.centerSprite.setRotation(this.rotation); // Assuming rotation is in degrees, convert to radians for Phaser
			this.centerSprite.setScale(this.scaleFactor * this.spriteScaleFactor); // The sprite scaleFactor and the sprite scale have to remain the same ratio
		}
		if (this.armored_sprite)
		{
			this.armored_sprite.setRotation(this.rotation); // Apply same rotation
			let newX = this.x + Math.sin(this.rotation) * 8 * this.scaleFactor; // 8 is the distance from the center, math out where it should be
			let newY = this.y - Math.cos(this.rotation) * 8 * this.scaleFactor; 
			this.armored_sprite.x = newX;
			this.armored_sprite.y = newY;
			this.armored_sprite.setScale(this.scaleFactor * this.spriteScaleFactor); // The sprite scaleFactor and the sprite scale have to remain the same ratio
		}
	}
    
	/**
	 * Initiates scaling animations for the shape based on specified parameters.
	 * @param {Array} growingParamsArray - An array of parameters for scaling animations.
	 * Each element is an array containing delay before start, growth speed, and final size.
	 */
	animateScale(growingParamsArray) {
		if (!this.graphics) return; // Exit if there's no graphics object to animate.

		const initiateGrowing = (growParams, delayBeforeStart = 0) => {
			if (growParams.length !== 2) {
				throw new Error("Not Implemented"); // Validate growParams format.
			}
			const [growSpeed, endSize] = growParams; // Destructure growth parameters.
			
			this.scene.time.delayedCall(delayBeforeStart, () => { // Delay animation start if specified.
				if (this.growingTween) {
					this.growingTween.stop(); // Stop any existing growing animation.
					this.growingTween = null;
				}
				// Create a new tween for scaling.
				this.growingTween = this.scene.tweens.add({
					targets: this.graphics,
					scaleX: endSize,
					scaleY: endSize,
					ease: 'Linear',
					duration: growSpeed / this.scene.difficultyAdjustment,
					repeat: 0,
					yoyo: false,
					onUpdate: () => {
						this.scaleFactor = this.graphics.scaleX; // Update scaleFactor during animation.
					},
					onComplete: () => {
						this.scaleFactor = endSize; // Ensure scaleFactor matches end size after completion.
					}
				});
			});
		};

		growingParamsArray.forEach(([delayBeforeMovement, growParams]) => {
			initiateGrowing(growParams, delayBeforeMovement / this.scene.difficultyAdjustment); // Initiate each scaling animation.
		});
	}
	
	/**
	 * Animates the object's velocity change over time based on provided parameters.
	 * This method allows for dynamic changes in velocity, useful for creating movement patterns.
	 * @param {Array} velocityArray - An array containing velocity change parameters: delay before change, new velocities (X and Y), and duration to change velocities.
	 */
	animateVelocities(velocityArray) {
		if (!this.graphics) return; // Ensure there is a graphics object to apply animations to.
		if (velocityArray.length === 0) return; // Ensure there are parameters to process.

		// Defines a function to initiate the velocity change animation.
		const initiateMovement = (velocityParams, delayBeforeStart = 0) => {
			// Validate that the parameters array has the correct format.
			if (velocityParams.length !== 3) {
				throw new Error("Not Implemented"); // Improper format error.
			}
			// Destructure the velocity parameters for easier access.
			const [newVelocityX, newVelocityY, durationOfChange] = velocityParams;

			// Delay the start of the animation if specified.
			this.scene.time.delayedCall(delayBeforeStart, () => {
				if (this.velocityTween) {
					// If an animation is already in progress, stop it before starting a new one.
					this.velocityTween.stop();
					this.velocityTween = null;
				}
				// Create a new tween animation for changing velocity.
				this.velocityTween = this.scene.tweens.add({
					targets: this,
					props: {
						velocityX: { from: this.velocityX, to: newVelocityX },
						velocityY: { from: this.velocityY, to: newVelocityY }
					},
					ease: 'Linear', // Use linear interpolation for a smooth transition.
					duration: durationOfChange / this.scene.difficultyAdjustment, // Adjust duration based on game difficulty.
				});
			});
		};

		// Iterate over each set of velocity change parameters and initiate the animation.
		velocityArray.forEach(([delayBeforeMovement, velocityParams]) => {
			initiateMovement(velocityParams, delayBeforeMovement / this.scene.difficultyAdjustment);
		});
	}
	
	/**
	 * Initiates movement animations for the shape based on specified parameters.
	 * @param {Array} movementParamsArray - An array of parameters for movement animations.
	 * Each element is an array containing duration, repeat interval, and movement speeds in X and Y directions.
	 */
	animateMovement(movementParamsArray) {
		if (!this.graphics) return; // Exit if there's no graphics object to animate.
		if (movementParamsArray.length === 0) return; // Exit if there are no movement parameters.

		const initiateMovement = (params, delayBeforeStart = 0) => {
			if (params.length !== 4) {
				throw new Error("Not Implemented"); // Validate movement parameters format.
			}
			const [durationOfMovement, repeatInterval, movementSpeedX, movementSpeedY] = params;

			this.scene.time.delayedCall(delayBeforeStart, () => { // Delay animation start if specified.
				if (this.movementTween) {
					this.movementTween.stop(); // Stop any existing movement animation.
					this.movementTween = null;
				}
				this.secondVelocityX = 0;
				this.secondVelocityY = 0;
				// Create a new tween for movement.
				this.movementTween = this.scene.tweens.add({
					targets: this,
					props: {
						secondVelocityX: { from: this.secondVelocityX - movementSpeedX * this.scene.difficultyAdjustment, to: this.secondVelocityX + movementSpeedX * this.scene.difficultyAdjustment },
						secondVelocityY: { from: this.secondVelocityY - movementSpeedY * this.scene.difficultyAdjustment, to: this.secondVelocityY + movementSpeedY * this.scene.difficultyAdjustment }
					},
					ease: 'Linear',
					duration: durationOfMovement / this.scene.difficultyAdjustment,
					yoyo: true, // Allow back-and-forth animation.
					repeat: repeatInterval === -1 ? -1 : repeatInterval - 1 // Set repeat interval.
				});
			});
		};
		movementParamsArray.forEach(([delayBeforeMovement, movementParams]) => {
			initiateMovement(movementParams, delayBeforeMovement / this.scene.difficultyAdjustment); // Initiate each movement animation.
		});
	}
	
	/**
	 * Performs the animation and logic for the object's death. This includes fading out the object
	 * and marking it for removal from the game. Optionally, plays a sound effect if the object is visible.
	 */
	performDeathAnimation() {
		if (this.dying) 
		{
			return; // Prevents re-triggering the death animation if already in progress.
		}
		// Play a sound effect if the object is within the visible game area.
		if (this.y <= this.scene.sys.game.config.height + 50) 
		{
			this.scene.sound.play('pop');
		}
		this.graphics.setDepth(-1); // on pointer over only triggers on the top shape, move it down so other shapes can trigger
		this.dying = true; // Mark the object as dying to prevent duplicate animations.

		const fadeTargets = []; // Initialize an array to hold targets for the fade-out animation.
		// Add the object's graphical components to the fadeTargets array if they exist.
		if (this.graphics) fadeTargets.push(this.graphics);
		if (this.centerSprite) fadeTargets.push(this.centerSprite);
		if (this.armored_sprite) fadeTargets.push(this.armored_sprite);

		// Create a tween for the fade-out animation.
		this.scene.tweens.add({
			targets: fadeTargets,
			alpha: 0, // Fade to fully transparent.
			ease: 'Linear', // Use linear interpolation for a smooth fade.
			duration: 250, // Duration of the fade effect in milliseconds.
			onComplete: () => {
				// Once the animation completes, mark the object for removal and destroy its components.
				this.toBeRemoved = true;
				if (this.graphics) this.graphics.destroy();
				if (this.centerSprite) this.centerSprite.destroy();
				if (this.armored_sprite) this.armored_sprite.destroy();
			}
		});
	}


	/**
	 * Initiates circular movement animations for the shape based on specified parameters.
	 * @param {Array} movementParams - Parameters for circular movement including delay before start, duration, radius, and speed.
	 */
	animateCircularMovement(movementParams) {
		if (!this.graphics) return; // Exit if there's no graphics object to animate.
		if (movementParams.length === 0) return; // No circular movement.
		if (movementParams.length !== 5) {
			throw new Error("Not Implemented"); // Validate circular movement parameters format.
		}
		const [delayBeforeStart, duration, radius, speed, startAngel] = movementParams;

		let angVel = 2 * Math.PI / (speed / 1000 / this.scene.difficultyAdjustment); // Calculate angular velocity for complete circle.
		
		let elapsed = 0; // Initialize elapsed time.
		this.scene.time.delayedCall(delayBeforeStart / this.scene.difficultyAdjustment, () => {
			this.scene.time.addEvent({
			delay: 20, // Update interval for smoother circular motion.
			callback: () => {
				elapsed += 20; // Increment elapsed time.

				let currentAngle = angVel * (elapsed / 1000) + startAngel; // Calculate current angle.

				// Update velocity components based on circular motion.
				this.circularVelocityX = radius * angVel * Math.cos(currentAngle);
				this.circularVelocityY = radius * angVel * Math.sin(currentAngle);

				if (elapsed >= duration / this.scene.difficultyAdjustment && duration !== -1) {
					this.circularVelocityX = 0; // Reset velocities if duration is exceeded.
					this.circularVelocityY = 0;
				}
			},
			callbackScope: this,
			loop: true // Continue updating until stopped.
			});
		});
	}
}
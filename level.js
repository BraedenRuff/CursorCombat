/**
 * Class Name: Level
 * Description: Manages the game level, including loading level data, spawning shapes,
 * handling interactions with shapes, and determining if a level has been cleared or failed.
 * Expected Inputs: Level data array upon loading a new level.
 * Expected Outputs: Dynamically updates the game state based on user interactions and the game's logic.
 * Called By: GameScene class or any other class responsible for managing game levels.
 * Will Call: Shape classes (Triangle, StealthTriangle, ArmoredTriangle, Square, Architecture, Clear-Friendlies, SlowTime, Intangible) for spawning and managing individual game objects, and callback to scene for some methods.
 * @class
 * @author Braeden Ruff
 */

class Level {
    /**
     * Initializes a new instance of the Level class.
	 * @constructor
     * @param {Phaser.Scene} scene - The current Phaser scene.
     */
    constructor(scene) {
        this.scene = scene; // Reference to the current Phaser scene
        this.shapes = []; // Array to hold all shapes spawned in the level
        this.levelText = null; // Placeholder for any text related to the level
        this.levelPassableScore = 0; // Score required to pass the level
        this.squaresSpared = true; // Flag to check if squares are spared
        this.architectureSpared = true; // Flag to check if architecture shapes are spared
        this.trianglesSpared = true; // Flag to check if triangles are spared
		this.showAreaHP = false; // Flag to showAreaHPbar
		this.intangibleActive = false; // Flag indicating whether you can become intangible
		this.intangible = false; // Flag indicating whether you are currently intangible
		this.slowtimeActive = false; // Flag indicating whether you can slow time
		this.slowtime = false; // Flag indicating whether time is slowed down
    }

    /**
     * Loads the level with the provided data, setting up shapes and level-specific properties.
     * @param {Array} levelData - An array of data representing different shapes and their properties.
     */
    loadLevel(levelData) {
        
		// Reset relevant properties to their default states at the start of level loading.
        this.resetLevelState();		
		
		levelData.forEach((data) => {
            this.processLevelData(data);
        });
    }
	
	/**
     * Resets level state before loading new level data. Ensures the level starts with correct settings.
     */
    resetLevelState() {
        Shape.staticId = 0; // Reset the static ID for shapes. Only used to debug.
        this.squaresSpared = true; // Flag to check if squares are spared
        this.architectureSpared = true; // Flag to check if architecture shapes are spared
        this.trianglesSpared = true; // Flag to check if triangles are spared
        this.resetPowerUpsAndEffects();
		
		// Reset area data
        this.scene.healthBar.hideHealthBarInstant();
		this.showAreaHP = false;
		
		// Destroy the message text if it exists from a previous level
        if (this.messageText) {
            this.messageText.destroy();
            this.messageText = null;
        }
    }
	
	/**
     * Resets power-ups and visual effects, stopping any ongoing animations or effects.
     */
    resetPowerUpsAndEffects() {
        // Stop and reset animations and timers related to power-ups and effects.
		
        // Intangible block
		if(this.scene.intangibleEffectTweenIn) {
            this.scene.intangibleEffectTweenIn.stop();
            this.scene.intangibleEffectTweenIn = null;
        }
		if(this.scene.intangibleEffectTweenOut)
		{
			this.scene.intangibleEffectTweenOut.stop();
			this.scene.intangibleEffectTweenOut = null;
		}
		this.intangibleActive = false; // Ensure we don't bring power-ups from previous attempts or other levels
		this.scene.finishIntangible();
		
		// Slowtime block
		if (this.scene.slowtimeTimerEvent) {
			this.scene.slowtimeTimerEvent.remove();
			this.scene.slowtimeTimerEvent = null; // Clear the reference
		}
		this.slowtimeActive = false; // Ensure we don't bring power-ups from previous attempts or other levels
		this.scene.finishSlowtime();
		
		if(this.scene.fadeTween)
		{
			this.scene.fadeTween.stop();
			this.scene.blackBackground.alpha = 0;
			this.scene.fadeTween = null;
		}
    }
	
	/**
     * Processes a single entry in the level data array, creating shapes or setting properties accordingly.
     * @param {Array} data - A sub-array from the level data array, representing a shape or level property.
     */
    processLevelData(data) 
	{
        // Implementation of how each type of data entry is handled
        if (data.length === 1) // That's just min score.
		{
			// Handle level passable score setup
			this.levelPassableScore = data[0];
			// Format and display the score with padding based on levelPassableScore's length
			this.scene.scoreText.setText('Score: ' + this.scene.score.toString().padStart(this.levelPassableScore.toString().length, '0') + "/" + this.levelPassableScore);
		} 
		else if (data.length === 2) // This is only the black screen data currently
		{
			if(data[0] === 'black')
			{
				// Spawn architecture shapes with their properties
				this.scene.animateBlackout(data[1]);
			}
		} 
		else if (data.length === 3) // This is architecture
		{
			// Spawn architecture shapes with their properties
			const [shape, points, velocityY] = data;
			this.spawnArchitecture(points, velocityY);
		} 
		else if (data.length === 10) // This is any shape object
		{
			// Spawn regular shapes (triangle, square) with their properties
			const [shape, x, y, velocityX, velocityY, angularVelocity, velocityData, scaleData, movementData, movementCircularData] = data;
			this.spawnShape(shape, x, y, velocityX, velocityY, angularVelocity, velocityData, scaleData, movementData, movementCircularData);
		} else 
		{
			throw new Error("Not Implemented");
		}
    }
	
    /**
     * Spawns an architecture shape with given properties.
     * @param {Array} points - An array of points defining the architecture shape.
     * @param {number} velocityY - The vertical velocity of the architecture shape.
     */
    spawnArchitecture(points, velocityY) {
        this.architectureSpared = false; // Indicate that architecture shapes are present
        let shape = new Architecture(this.scene, points, velocityY);
        shape.createGraphics(points);
        this.shapes.push(shape);
        // Set up interaction handling for the architecture shape
        shape.graphics.on('pointerover', () => {
            this.handleShapeInteraction(shape, 'architecture');
        });
    }

    /**
     * Spawns a shape in the level based on the specified parameters.
     * @param {string} shapeType - The type of shape to spawn ('triangle', 'square').
     * @param {number} x - The x-coordinate for the shape's starting position.
     * @param {number} y - The y-coordinate for the shape's starting position.
     * @param {number} velocityX - The horizontal velocity of the shape.
     * @param {number} velocityY - The vertical velocity of the shape.
     * @param {number} angularVelocity - The angular velocity of the shape for rotation.
     * @param {array} scaleData - Data for scaling the shape.
     * @param {array} movementData - Data for linear movement animation.
     * @param {array} movementCircularData - Data for circular movement animation.
     */
    spawnShape(shapeType, x, y, velocityX, velocityY, angularVelocity, velocityData, scaleData, movementData, movementCircularData) {
        let shape;
        // Determines the type of shape to spawn and initializes it.
        if (shapeType === 'triangle') 
		{
			this.trianglesSpared = false;
            shape = new Triangle(this.scene, x, y, velocityX, velocityY, angularVelocity);
        } 
		else if (shapeType === 'square')
		{
			this.squaresSpared = false; //make sure there is some squares
			shape = new Square(this.scene, x, y, velocityX, velocityY, angularVelocity);
		}
		else if (shapeType === 'area')
		{
			shape = new Area(this.scene, x, y, velocityX, velocityY, angularVelocity);
		}
		else if (shapeType === 'clear-friendlies')
		{
			shape = new ClearFriendlies(this.scene, x, y, velocityX, velocityY, angularVelocity);
		}
		else if (shapeType === 'intangible')
		{
			shape = new Intangible(this.scene, x, y, velocityX, velocityY, angularVelocity);
		}
		else if (shapeType === 'slowtime')
		{
			shape = new SlowTime(this.scene, x, y, velocityX, velocityY, angularVelocity);
		}
		else if (shapeType.startsWith('armored_')) 
		{
			this.trianglesSpared = false;
			shape = new ArmoredTriangle(this.scene, x, y, velocityX, velocityY, angularVelocity);
		} 
		else if (shapeType.startsWith('stealth')) 
		{
			this.trianglesSpared = false;
			shape = new StealthTriangle(this.scene, x, y, velocityX, velocityY, angularVelocity);
		}  
		else
		{
			console.log(shapeType);
			throw new Error("Not Implemented");
		}
		
        // Sets up the shape's graphics, movement, and interaction handling.
        shape.createGraphics();
		shape.animateVelocities(velocityData);
        shape.animateScale(scaleData);
        shape.animateMovement(movementData);
		shape.animateCircularMovement(movementCircularData);
		this.shapes.push(shape);
		if(shapeType === 'area')
		{
			shape.graphics.on('pointerout', () => {
				this.scene.healthBar.decreaseHealthBar();
			});
		}
		else if (shapeType.startsWith('armored_')) 
		{
			let healthPoints = parseInt(shapeType.charAt(shapeType.length - 1), 10); // Get the last character (it's a digit): indicates healthpoints
			shape.generateSprite(healthPoints);
			shape.graphics.on('pointerdown', () => {
				shape.takeDamage();
			});
		}
		shape.graphics.on('pointerover', () => {
			this.handleShapeInteraction(shape, shapeType);
		});
    }
	
	/**
     * Handles interaction with shapes when the mouse pointer hovers over them.
     * @param {Shape} shape - The shape that was interacted with.
     * @param {string} shapeType - The type of the shape.
     */
	handleShapeInteraction(shape, shapeType) 
	{
		const index = this.shapes.indexOf(shape);
        if (index > -1) 
		{
			if(shapeType === 'area')
			{
				// You're within the area.
				this.scene.healthBar.refillAndPauseHealthBar();
				return;
			}
			if(this.intangible)
			{
				// If you're intangible don't do anything.
				return;
			}
			if(shapeType === 'clear-friendlies')
			{
				// Grab the clear-friendlies upgrade and instantly clear the squares and architecture.
				this.shapes.forEach((shapeNew, index) => 
				{
					if((shapeNew instanceof Architecture || shapeNew instanceof Square) && !(shapeNew instanceof Area))
					{
						if(shapeNew.y > -300 * shape.scaleFactor * shape.scaleFactor)
						{
							shapeNew.y = this.scene.sys.game.config.height + 100;
							this.removeShape(shapeNew);
						}
					}
				});
			}
			else if(shapeType === 'intangible')
			{
				// Grab the intangible upgrade.
				this.intangibleActive = true;
				this.scene.intangibleText.setText('Press E to become Intangible');
			}
			else if(shapeType === 'slowtime')
			{
				// Grab the slowtime upgrade.
				this.slowtimeActive = true;
				if(!this.slowtime)
				{
					this.scene.slowtimeText.setText('Press S to Slow Time');
				}
			}
			else if (shapeType.startsWith('armored_')) 
			{
				return; // handled with the click not pointerover (see takeDamage()).
			}
			if(shape.dying)
			{
				return;
			}
			this.removeShape(shape);
			
			//console.log(shape.id); //used to debug which shape we're looking at
            
            // Adjusts score based on shape type and updates the score display.
			if(shapeType === 'triangle' || shapeType === 'stealth')
			{
				this.scene.score += 1;
			}
			if(shapeType === 'architecture' || shapeType === 'square')
			{
				this.scene.score -= 1;
			}

            this.scene.scoreText.setText('Score: ' + this.scene.score.toString().padStart(this.levelPassableScore.toString().length, '0') + "/" + this.levelPassableScore);
        }
    }
	/**
     * Marks a shape for removal from the level and performs death animation.
     * @param {Shape} shape - The shape to be removed.
     */
    removeShape(shape) {
        shape.performDeathAnimation();
    }

    /**
     * Checks if the level has been cleared based on the remaining shapes and the player's score.
     */
    checkLevelCleared() {
        if (this.shapes.length === 0) 
		{			
	
			// Clear any effects.
			if(this.scene.intangibleEffectTweenIn)
			{
				this.scene.intangibleEffectTweenIn.stop();
				this.scene.intangibleEffectTweenIn = null;
			}
			if(this.scene.intangibleEffectTweenOut)
			{
				this.scene.intangibleEffectTweenOut.stop();
				this.scene.intangibleEffectTweenOut = null;
			}
			if(this.scene.fadeTween)
			{
				this.scene.fadeTween.stop();
				this.scene.blackBackground.alpha = 0;
				this.scene.fadeTween = null;
			}
			
			// Get rid of the area.
			this.showAreaHP = false;
			this.scene.healthBar.hideHealthBarInstant();
            
			// Clear or fail setup.
			let cleared = this.scene.score >= this.levelPassableScore;
            const message = cleared ? 'Level Cleared!' : 'Level Failed';
            const color = cleared ? '#00FF00' : '#FF0000'; // Red for failed. Green for cleared.
			
			// Unlock achievements.
			if(!this.squaresSpared && !this.architectureSpared)
			{
				this.scene.unlockAchievement("Friendly-Fire");
				
				if(!this.trianglesSpared)
				{
					this.scene.unlockAchievement("Destructive");
				}
			}
			
			if(!cleared) // Failed the level, play the sound.
			{
				this.scene.sound.play('lose', {volume:0.2});
			}
			else // Won the level, play the sound.
			{
				this.scene.sound.play('win', {volume:0.2});
			}
			
			// Displays a message based on whether the level was cleared or failed.
            this.messageText = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, message, { fontSize: '40px', fill: color }).setOrigin(0.5);
            
			// Handles level clearing or retrying based on the outcome (after 2 seconds).
            const nextAction = cleared ? this.scene.loadNextLevel : this.scene.loadCurrentLevel;
            this.scene.time.delayedCall(2000, nextAction, [], this.scene);
        }
    }
    /**
     * Regularly updates each shape in the level and checks for level clearing conditions.
     * @param {number} time - The current time.
     * @param {number} delta - The time elapsed since the last update.
     */
    update(time, delta) {
        // Updates each shape and checks for removal based on position or interaction.
		let onlyArchitecture = true; // Some architecture doesn't move and the level is only cleared if there are no shapes. This flag stops that. We will also clear if there is only an area remaining. 
		let wontEnd = true; // Some shapes go up or sideways and won't touch the deathplane (this.scene.sys.game.config.height + 50)
        this.shapes.forEach((shape) => {
			shape.update(time, delta);
			if(!(shape instanceof Architecture || shape instanceof Area)) // Not architecture.
			{
				onlyArchitecture = false;
			}
			else if(shape instanceof Architecture && shape.velocityY > 0) // is architecture and going down.
			{
				//will end eventually.
				onlyArchitecture = false;
			}
			// if not dying kill it if below death plane.
            if (!shape.dying) {
                if (shape.y > this.scene.sys.game.config.height + 50) {
                    // Marks the shape for removal if it goes beyond the death plane.
                    this.removeShape(shape);
                    // Updates flags based on the types of shapes remaining.
                    if(shape instanceof Square) { this.squaresSpared = true; }
                    if(shape instanceof Architecture) { this.architectureSpared = true; }
                    if(shape instanceof Triangle || shape instanceof StealthTriangle || shape instanceof ArmoredTriangle) { this.trianglesSpared = true; }
					if(shape instanceof Area) { this.scene.healthBar.hideHealthBar(); }
                }
				// If the area is on the screen, we will show the healthBar 
				if (shape instanceof Area)
				{
					if (shape.y > 0 && !this.showAreaHP)
					{
						this.scene.healthBar.showHealthBar();
						this.showAreaHP = true;
					}
				}
            }
        });
		
		// delete everything
		if(onlyArchitecture)
		{
			this.architectureSpared = true;
			this.clearShapesNoSound();
		}
        // Filters out shapes marked for removal and checks if the level is cleared.
        const originalLength = this.shapes.length;
        this.shapes = this.shapes.filter(shape => !shape.toBeRemoved);
		// if it changed the newLength could be 0, but if it's 0 I only want to call one time
        if (this.shapes.length < originalLength) {
            this.checkLevelCleared();
        }
    }
	
	/**
	 * Checks each shape within the level to determine if the player's pointer is interacting with it.
	 * This method iterates over all shapes and checks for pointer collision based on the shape's geometry.
	 * If an interaction is detected, it handles the interaction according to the type of shape.
	 * This is used by intangible since if you stop being intangible while over an object it won't register a shape interaction
	 */
	checkAllShapes() {		
		let pointer = this.scene.input.activePointer; // Get the current position of the player's pointer.
		
		this.shapes.forEach((shape, index) => {
			let shapeGraphics = shape.graphics; // The graphics object associated with the shape.
			
			if (shapeGraphics.geom) { // Ensure the shape has a geometry for collision detection.
				let containsPointer = false; // Flag to indicate if the pointer is within the shape.
				let shapeType = ''; // String to hold the type of shape for interaction handling.
				
				// Adjust pointer coordinates relative to shape position.
				let x = pointer.x - shape.x;
				let y = pointer.y - shape.y;
				
				// Determine if the pointer is over the shape based on the shape geometry.
				if (shape instanceof Triangle) {
					containsPointer = Phaser.Geom.Triangle.Contains(shapeGraphics.geom, x, y);
					shapeType = 'triangle';
				} else if (shape instanceof Area) {
					containsPointer = Phaser.Geom.Rectangle.Contains(shapeGraphics.geom, x, y);
					shapeType = 'area';
				} else if (shape instanceof Square) {
					containsPointer = Phaser.Geom.Triangle.Contains(shapeGraphics.geom, x, y);
					shapeType = 'square';
				} else if (shape instanceof Architecture) {
					containsPointer = Phaser.Geom.Polygon.Contains(shapeGraphics.geom, x, y);
					shapeType = 'architecture';
				} else if (shape instanceof ClearFriendlies) {
					containsPointer = Phaser.Geom.Polygon.Contains(shapeGraphics.geom, x, y);
					shapeType = 'clear-friendlies';
				} else if (shape instanceof Intangible) {
					containsPointer = Phaser.Geom.Polygon.Contains(shapeGraphics.geom, x, y);
					shapeType = 'intangible';
				} else if (shape instanceof SlowTime) {
					containsPointer = Phaser.Geom.Polygon.Contains(shapeGraphics.geom, x, y);
					shapeType = 'slowtime';
				} 
				//don't worry about ArmoredTriangle, it doesn't need this

				if (containsPointer) {
					// Handle the interaction based on the detected shape type.
					this.handleShapeInteraction(shape, shapeType);
				}
			}
		});
	}

	/**
	 * Removes all shapes from the level without playing the removal sound effects.
	 * This method is typically used for clearing the level of shapes silently, for instance,
	 * when transitioning between levels or resetting the level state.
	 */
	clearShapesNoSound() {
		this.shapes.forEach((shape) => {
			shape.y = this.scene.sys.game.config.height + 100; // Move shape off-screen.
			if (!shape.toBeRemoved) {
				// Remove the shape if it has not already been marked for removal.
				this.removeShape(shape);
			}
		});
	}
}
export {Level};
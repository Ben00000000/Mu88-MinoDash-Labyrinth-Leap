const character = document.getElementById('character');
let frameIndex = 0;
let characterPositionX = 0; // Set the initial position on the left side
let characterPositionY = 0; // Set the initial vertical position
let isMoving = false;
let isFacingLeft = false;
let isJumping = false;
let isInAir = false;
let gravity = 5500; // Adjust the gravity force as needed
const enemy = document.getElementById('enemy');
let enemyFrameIndex = 0;
let enemyPositionX = window.innerWidth; // Start from the right side
let enemyPositionY = 0; // Set the initial vertical position
let enemyIsMoving = true; // Enemy always moves
let enemyFrames = [];
let lives = 6;

const idleFrameUrls = Array.from({ length: 18 }, (_, index) =>
  `https://raw.githubusercontent.com/Ben00000000/minagame/main/0_Minotaur_Idle_${String(index).padStart(3, '0')}.png`
);

const runningRightFrameUrls = Array.from({ length: 12 }, (_, index) =>
  `https://raw.githubusercontent.com/Ben00000000/minagame/main/0_Minotaur_Running_${String(index).padStart(3, '0')}.png`
);

const runningLeftFrameUrls = Array.from({ length: 12 }, (_, index) =>
  `https://raw.githubusercontent.com/Ben00000000/minagame/main/runningleft%20(${index + 1}).png`
);

const jumpingFrameUrls = Array.from({ length: 6 }, (_, index) =>
  `https://raw.githubusercontent.com/Ben00000000/minagame/main/0_Minotaur_Jump%20Loop_${String(index).padStart(3, '0')}.png`
);

const idleLeftFrameUrls = Array.from({ length: 18 }, (_, index) =>
  `https://raw.githubusercontent.com/Ben00000000/minagame/main/idleleft%20(${index + 1}).png`
);

const jumpLeftFrameUrls = Array.from({ length: 6 }, (_, index) =>
  `https://raw.githubusercontent.com/Ben00000000/minagame/main/jumpleft%20(${index + 1}).png`
);

const enemyRunningFrameUrls = Array.from({ length: 12 }, (_, index) =>
  `https://raw.githubusercontent.com/Ben00000000/minagame/main/0_Minotaur_Run%20Slashing_${String(index).padStart(3, '0')}.png`
);

const livesFrameUrls = Array.from({ length: 6 }, (_, index) =>
  `https://raw.githubusercontent.com/Ben00000000/minagame/main/livesframe${index + 1}.png`
);

const enemy2FrameUrls = Array.from({ length: 12 }, (_, index) =>
  `https://raw.githubusercontent.com/Ben00000000/minagame/main/enemy2%20(${index + 1}).png`
);

const livesFrameImages = [];
const idleFrameImages = [];
const idleLeftFrameImages = [];
const runningRightFrameImages = [];
const runningLeftFrameImages = [];
const jumpingFrameImages = [];
const jumpLeftFrameImages = [];


// Function to preload frames before starting the animation
function preloadFrames(urls, frameImages) {
  for (const url of urls) {
    const img = new Image();
    img.src = url;
    frameImages.push(img);
  }
}

// Function to update character frame
function updateCharacterFrame() {
  let frames;
  if (isJumping) {
    frames = isFacingLeft ? jumpLeftFrameImages : jumpingFrameImages;
  } else if (isMoving) {
    frames = isFacingLeft ? runningLeftFrameImages : runningRightFrameImages;
  } else {
    frames = isFacingLeft ? idleLeftFrameImages : idleFrameImages;
  }

  character.style.backgroundImage = `url('${frames[frameIndex % frames.length].src}')`;
}

// Function to update character position
function updateCharacterPosition() {
  character.style.left = `${characterPositionX}px`;
  character.style.bottom = `${characterPositionY}px`;
}

// Function to simulate gravity
function applyGravity() {
    // Adjust the character's vertical position based on gravity
    characterPositionY = Math.max(0, characterPositionY - gravity / 60); // Update position more frequently
    updateCharacterPosition();

    // Check if the character has reached the ground
    if (characterPositionY <= 0 && !isJumping) {
        characterPositionY = 0;
    }
}


// Function to animate character
function animateCharacter() {
  frameIndex = (frameIndex + 1) % (isJumping ? jumpingFrameImages.length : (isMoving ? (isFacingLeft ? runningLeftFrameImages.length : runningRightFrameImages.length) : idleFrameImages.length));
  updateCharacterFrame();

  if (!isJumping) {
    // Apply gravity if not jumping
    applyGravity();
  }

  // Decrease the offset for both sides
  const offset = 100; // Adjust this value based on your requirements

  const characterLeft = characterPositionX + offset;
  const characterRight = characterPositionX + character.offsetWidth - offset;

  const enemyLeft = enemyPositionX;
  const enemyRight = enemyPositionX + enemy.offsetWidth;

  let enemyCollided = false;

  // Check for collision on the right side of the character
  if (characterRight >= enemyLeft && characterPositionY === enemyPositionY && characterPositionX < enemyPositionX) {
    // Collision detected on the right side of the character
    // Perform actions or display a message as needed
    showCollisionText();
    enemyCollided = true;
  }

  // Check for collision on the left side of the character
  if (characterLeft <= enemyRight && characterPositionY === enemyPositionY && characterPositionX > enemyPositionX) {
    // Collision detected on the left side of the character
    // Perform actions or display a message as needed
    showCollisionText();
    enemyCollided = true;
  }

  // You can replace the alert with your desired logic to handle the collision
  if (enemyCollided) {
    // Additional logic for handling the collision
  }
}


let isGameActive = true;

// Function to initiate jump
function jump() {
  if (isGameActive && !isJumping && characterPositionY === 0) {
    isJumping = true;
    isInAir = true;

    // Reduce the initial delay before the jump animation starts
    // Adjust the timeout value as needed (e.g., 500 milliseconds)
    setTimeout(() => {
      // No need to set isJumping to false here, it will be handled by applyGravity
    }, 500);

    const jumpHeight = 40;
    const jumpDuration = 500;

    const screenHeight = window.innerHeight;

    const startTime = Date.now();
    const jumpInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < jumpDuration) {
        const jumpProgress = 1 - Math.abs(elapsed / jumpDuration - 0.5) * 2;
        const newPositionY = Math.max(0, characterPositionY + jumpHeight * jumpProgress);
        characterPositionY = Math.min(newPositionY, screenHeight - 50);
        updateCharacterPosition();
      } else {
        clearInterval(jumpInterval);
        isJumping = false;
        isInAir = false;
      }
    }, 20);
  }
}




let isJumpKeyDown = false; // Flag to track if jump key is pressed


// Handle keyboard and button input
document.addEventListener('keydown', handleKeyPress);
document.addEventListener('keyup', handleKeyRelease);

function handleKeyPress(event) {
  if ((event.code === 'ArrowLeft' || event.key === 'a') && !isMoving) {
    isMoving = true;
    isFacingLeft = true;
    moveCharacterLeft();
  } else if ((event.code === 'ArrowRight' || event.key === 'd') && !isMoving) {
    isMoving = true;
    isFacingLeft = false;
    moveCharacterRight();
  } else if ((event.code === 'ArrowUp' || event.key === 'w') && !isJumpKeyDown) {
    isJumpKeyDown = true;
    jump();
  }
}

function handleKeyRelease(event) {
  if ((event.code === 'ArrowLeft' || event.key === 'a') && isMoving) {
    isMoving = false;
    stopCharacter();
  } else if ((event.code === 'ArrowRight' || event.key === 'd') && isMoving) {
    isMoving = false;
    stopCharacter();
  } else if ((event.code === 'ArrowUp' || event.key === 'w') && isJumpKeyDown) {
    isJumpKeyDown = false;
  }
}

function moveCharacterLeft() {
  updateCharacterPosition();
  animationInterval = setInterval(() => {
    characterPositionX -= 5; // Adjust the speed as needed
    updateCharacterPosition();
  }, 20);
}

function moveCharacterRight() {
  updateCharacterPosition();
  animationInterval = setInterval(() => {
    characterPositionX += 5; // Adjust the speed as needed
    updateCharacterPosition();
  }, 20);
}

function stopCharacter() {
  clearInterval(animationInterval);
}

// Preload frames before starting the animation
preloadFrames(idleFrameUrls, idleFrameImages);
preloadFrames(idleLeftFrameUrls, idleLeftFrameImages);
preloadFrames(runningRightFrameUrls, runningRightFrameImages);
preloadFrames(runningLeftFrameUrls, runningLeftFrameImages);
preloadFrames(jumpingFrameUrls, jumpingFrameImages);
preloadFrames(jumpLeftFrameUrls, jumpLeftFrameImages);
preloadFrames(enemyRunningFrameUrls, enemyFrames);
preloadFrames(livesFrameUrls, livesFrameImages);

// Set the initial position and update the character frame
updateCharacterPosition();
updateCharacterFrame();

// Set the interval to update the frame every 100 milliseconds (adjust as needed)
let animationInterval = setInterval(animateCharacter, 100);

function updateEnemyFrame() {
  enemy.style.backgroundImage = `url('${enemyFrames[enemyFrameIndex % enemyFrames.length].src}')`;
}

function updateEnemyPosition() {
  enemy.style.left = `${enemyPositionX}px`;
  enemy.style.bottom = `${enemyPositionY}px`;
}

let score = 0; // Initialize score
// Function to create and update the score display
function updateScoreDisplay() {
  // Check if the game is active before updating the score display
  if (isGameActive) {
    const scoreDisplay = document.getElementById('score-display');

  }
}

// Function to animate enemy
function resetEnemy() {
  // Reset the enemy position when a collision occurs
  enemyPositionX = window.innerWidth;
  enemyPositionY = 0;

  // Toggle between enemy2 frames and enemyRunning frames
  if (isUsingEnemy2Frames) {
    enemyFrames = [];
    preloadFrames(enemyRunningFrameUrls, enemyFrames);
  } else {
    enemyFrames = [];
    preloadFrames(enemy2FrameUrls, enemyFrames);
  }

  isUsingEnemy2Frames = !isUsingEnemy2Frames;

  // Ensure the enemy starts within the screen boundaries
  if (enemyPositionX + enemy.offsetWidth >= window.innerWidth) {
    enemyPositionX = window.innerWidth - enemy.offsetWidth;
  }

  // Update the enemy position
  updateEnemyPosition();
}


// Function to animate enemy
function animateEnemy() {
  const mainMenu = document.getElementById('main-menu'); // Replace 'main-menu' with the actual ID or class of your main menu

  // Check if the game is active, the main menu is not visible, and enemy is within screen boundaries
  if (isGameActive && (!mainMenu || mainMenu.style.display === 'none') && enemyPositionX >= -enemy.offsetWidth) {
    enemyFrameIndex = (enemyFrameIndex + 1) % enemyFrames.length;
    updateEnemyFrame();

    if (enemyIsMoving) {
      // Adjust the speed based on the current score
      const speedMultiplier = 1 + score * 0.1; // You can adjust the multiplier as needed

      // Calculate the new position without updating it yet
      const newEnemyPositionX = enemyPositionX - 20 * speedMultiplier; // Adjust the base speed as needed

      // Check if the new position is valid (not beyond the left edge of the screen)
      if (newEnemyPositionX + enemy.offsetWidth >= 0) {
        enemyPositionX = newEnemyPositionX;

        // Update the enemy position, ensuring it stays within the screen boundaries
        updateEnemyPosition();
      } else {
      score++;
        // Reset enemy position only if it has gone completely outside the left edge of the screen
        resetEnemy();
      }
    }
  }
}







// Preload enemy frames before starting the animation
preloadFrames(enemyRunningFrameUrls, enemyFrames);

// Set the initial position and update the enemy frame
updateEnemyPosition();
updateEnemyFrame();

// Set the interval to update the frame every 100 milliseconds (adjust as needed)
let enemyAnimationInterval = setInterval(animateEnemy, 100);


function getBoundingBox(element, hitboxScale = 0.005) {
  const rect = element.getBoundingClientRect();
  const width = rect.width * hitboxScale;
  const height = rect.height * hitboxScale;
  const offsetX = (rect.width - width) / 2;
  const offsetY = (rect.height - height) / 2;

  return {
    top: rect.top + offsetY,
    right: rect.right - offsetX,
    bottom: rect.bottom - offsetY,
    left: rect.left + offsetX
  };
}



let isDamaged = false;



function showCollisionText() {
  const collisionText = document.getElementById('collision-text');

    // Check if the player has already been damaged by the current enemy
    if (isGameActive && !isDamaged) {
      // Decrement lives
      lives--;

      // Update the lives display
      updateLivesDisplay();

      // Set the isDamaged flag to true
      isDamaged = true;
    }

    // Hide the collision text after 500 milliseconds
    setTimeout(() => {
      collisionText.style.display = 'none';

      // Check if there are no more lives
      if (lives <= 0) {
        gameOver();
      } else {
        // Reset isDamaged flag for the next collision
        isDamaged = false;

        // Reset enemy position
        resetEnemy();
      }
    }, 500);
  }

let isUsingEnemy2Frames = false;

function resetEnemy() {
  // Reset the enemy position when a collision occurs
  enemyPositionX = window.innerWidth;

  // Toggle between enemy2 frames and enemyRunning frames
  if (isUsingEnemy2Frames) {
    enemyFrames = [];
    preloadFrames(enemyRunningFrameUrls, enemyFrames);
  } else {
    enemyFrames = [];
    preloadFrames(enemy2FrameUrls, enemyFrames);
  }

  isUsingEnemy2Frames = !isUsingEnemy2Frames;

  // Ensure the enemy starts within the screen boundaries
  const maxWidth = window.innerWidth - enemy.offsetWidth;
  enemyPositionX = Math.min(maxWidth, enemyPositionX);

  // Update the enemy position
  updateEnemyPosition();
}





function updateLivesDisplay() {
  const livesDisplay = document.getElementById('lives-display');
  if (!livesDisplay) {
    // Create the lives display element if it doesn't exist
    const newLivesDisplay = document.createElement('div');
    newLivesDisplay.id = 'lives-display';
    newLivesDisplay.style.position = 'fixed';
    newLivesDisplay.style.top = '50px'; // Adjust the top position as needed
    newLivesDisplay.style.left = '50%';
    newLivesDisplay.style.transform = 'translateX(-50%)';
    newLivesDisplay.style.color = 'white';
    newLivesDisplay.style.fontSize = '24px';
    document.body.appendChild(newLivesDisplay);

    // Update the lives display
    newLivesDisplay.innerHTML =  getLivesImageTag();
  } else {
    // Update the existing lives display
    livesDisplay.innerHTML =  getLivesImageTag();
  }
}

function getLivesImageTag() {
  // Get the appropriate image tag for the current lives count
  const livesImageIndex = Math.max(0, lives - 1); // Ensure index is within bounds
  return `<img src="https://raw.githubusercontent.com/Ben00000000/minagame/main/${livesImageIndex + 1}.png" alt="Heart" style="vertical-align: middle; width: 100px; height: 40px;">`;
}

// Event listeners for buttons
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const jumpButton = document.getElementById('jump-button');

leftButton.addEventListener('mousedown', () => handleKeyPress({ code: 'ArrowLeft' }));
leftButton.addEventListener('mouseup', () => handleKeyRelease({ code: 'ArrowLeft' }));
rightButton.addEventListener('mousedown', () => handleKeyPress({ code: 'ArrowRight' }));
rightButton.addEventListener('mouseup', () => handleKeyRelease({ code: 'ArrowRight' }));
jumpButton.addEventListener('mousedown', () => handleKeyPress({ code: 'ArrowUp' }));
jumpButton.addEventListener('mouseup', () => handleKeyRelease({ code: 'ArrowUp' }));

// Adjust the jump button event for touch devices
jumpButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  handleKeyPress({ code: 'ArrowUp' });
});

jumpButton.addEventListener('touchend', (event) => {
  event.preventDefault();
  handleKeyRelease({ code: 'ArrowUp' });
});

function gameOver() {
  if (isGameActive) {
    // Freeze the game by clearing animation intervals
    clearInterval(animationInterval);
    clearInterval(enemyAnimationInterval);

    // Disable event listeners
    document.removeEventListener('keydown', handleKeyPress);
    document.removeEventListener('keyup', handleKeyRelease);

    // Disable button event listeners
    leftButton.removeEventListener('mousedown', () => handleKeyPress({ code: 'ArrowLeft' }));
    leftButton.removeEventListener('mouseup', () => handleKeyRelease({ code: 'ArrowLeft' }));
    rightButton.removeEventListener('mousedown', () => handleKeyPress({ code: 'ArrowRight' }));
    rightButton.removeEventListener('mouseup', () => handleKeyRelease({ code: 'ArrowRight' }));
    jumpButton.removeEventListener('mousedown', () => handleKeyPress({ code: 'ArrowUp' }));
    jumpButton.removeEventListener('mouseup', () => handleKeyRelease({ code: 'ArrowUp' }));
    jumpButton.removeEventListener('touchstart', (event) => {
        event.preventDefault();
        handleKeyPress({ code: 'ArrowUp' });
    });
    jumpButton.removeEventListener('touchend', (event) => {
        event.preventDefault();
        handleKeyRelease({ code: 'ArrowUp' });
    });

    // Display the game over overlay
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const finalScoreDisplay = document.getElementById('final-score');
    const highScoreDisplay = document.getElementById('high-score');
    const restartButton = document.getElementById('restart-button');

    const finalScore = score;
    const previousHighScore = getHighScore();

    // Update the final score display
    finalScoreDisplay.textContent = 'Final Score: ' + finalScore;

    // Check if the player achieved a new high score
    if (finalScore > previousHighScore) {
        setHighScore(finalScore);
        highScoreDisplay.textContent = 'New High Score: ' + finalScore;
    } else {
        highScoreDisplay.textContent = 'High Score: ' + previousHighScore;
    }

    gameOverOverlay.style.display = 'flex';

    // Add event listener for the restart button
    restartButton.addEventListener('click', restartGame);
  }
}

function getHighScore() {
    return localStorage.getItem('highScore') || 0;
}

// Function to set the high score in localStorage
function setHighScore(newHighScore) {
    localStorage.setItem('highScore', newHighScore);
}

function restartGame() {
isGameActive = true;
    // Reset score
    score = 0;

    // Reset character position
    characterPositionX = 0;
    characterPositionY = 0;
    updateCharacterPosition();

    // Reset enemy position
    enemyPositionX = window.innerWidth;
    enemyPositionY = 0;
    updateEnemyPosition();

    // Reset other game-related variables
    isMoving = false;
    isFacingLeft = false;
    isJumping = false;
    isInAir = false;
    isDamaged = false;
    lives = 6;

    // Update displays
    updateScoreDisplay();
    updateLivesDisplay();

 // Allow all buttons
 document.addEventListener('keydown', handleKeyPress);
 document.addEventListener('keyup', handleKeyRelease);

 // Allow button event listeners
 leftButton.addEventListener('mousedown', () => handleKeyPress({ code: 'ArrowLeft' }));
 leftButton.addEventListener('mouseup', () => handleKeyRelease({ code: 'ArrowLeft' }));
 leftButton.addEventListener('touchstart', () => handleKeyPress({ code: 'ArrowLeft' }));
 leftButton.addEventListener('touchend', () => handleKeyRelease({ code: 'ArrowLeft' }));

 rightButton.addEventListener('mousedown', () => handleKeyPress({ code: 'ArrowRight' }));
 rightButton.addEventListener('mouseup', () => handleKeyRelease({ code: 'ArrowRight' }));
 rightButton.addEventListener('touchstart', () => handleKeyPress({ code: 'ArrowRight' }));
 rightButton.addEventListener('touchend', () => handleKeyRelease({ code: 'ArrowRight' }));

 jumpButton.addEventListener('mousedown', () => handleKeyPress({ code: 'ArrowUp' }));
 jumpButton.addEventListener('mouseup', () => handleKeyRelease({ code: 'ArrowUp' }));
 jumpButton.addEventListener('touchstart', (event) => {
     event.preventDefault();
     handleKeyPress({ code: 'ArrowUp' });
 });
 jumpButton.addEventListener('touchend', (event) => {
     event.preventDefault();
     handleKeyRelease({ code: 'ArrowUp' });
 });


    // Hide the game over overlay
    const gameOverOverlay = document.getElementById('game-over-overlay');
    gameOverOverlay.style.display = 'none';

    // Start the game again (call your initialization logic)
    // (Add your game start logic here)

    // Set the interval to update the frame every 100 milliseconds (adjust as needed)
    animationInterval = setInterval(animateCharacter, 100);
    enemyAnimationInterval = setInterval(animateEnemy, 100);
}

function updateCharacterPosition() {
  // Ensure character stays within the horizontal boundaries of the screen
  const maxWidth = window.innerWidth - character.offsetWidth;
  characterPositionX = Math.max(0, Math.min(maxWidth, characterPositionX));

  // Ensure character stays within the vertical boundaries of the screen
  const maxHeight = window.innerHeight - character.offsetHeight;
  characterPositionY = Math.max(0, Math.min(maxHeight, characterPositionY));

  character.style.left = `${characterPositionX}px`;
  character.style.bottom = `${characterPositionY}px`;
}


document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleTouchEnd);

function handleTouchStart(event) {
  const touch = event.touches[0];
  handleKeyPress(touch);
}

function handleTouchEnd(event) {
  const touch = event.changedTouches[0];
  handleKeyRelease(touch);
}

// Touch event handling for buttons
leftButton.addEventListener('touchstart', (event) => {
    event.preventDefault();
    handleKeyPress({ code: 'ArrowLeft' });
});

leftButton.addEventListener('touchend', (event) => {
    event.preventDefault();
    handleKeyRelease({ code: 'ArrowLeft' });
});

rightButton.addEventListener('touchstart', (event) => {
    event.preventDefault();
    handleKeyPress({ code: 'ArrowRight' });
});

rightButton.addEventListener('touchend', (event) => {
    event.preventDefault();
    handleKeyRelease({ code: 'ArrowRight' });
});

jumpButton.addEventListener('touchstart', (event) => {
    event.preventDefault();
    handleKeyPress({ code: 'ArrowUp' });
});

jumpButton.addEventListener('touchend', (event) => {
    event.preventDefault();
    handleKeyRelease({ code: 'ArrowUp' });
});

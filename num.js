document.addEventListener('DOMContentLoaded', startGame);

const MAX_CHANCES = 10;
let secretNumber;
let chancesLeft;
let gameActive;

// DOM Elements
const guessInput = document.getElementById('guessInput');
const checkButton = document.getElementById('checkButton');
const restartButton = document.getElementById('restartButton');
const hintText = document.getElementById('hintText');
const chancesText = document.getElementById('chancesText');

function startGame() {
    // 1. Initialize game state
    secretNumber = Math.floor(Math.random() * 100) + 1; // Number between 1 and 100
    chancesLeft = MAX_CHANCES;
    gameActive = true;

    // 2. Reset DOM elements
    guessInput.value = '';
    guessInput.disabled = false;
    checkButton.disabled = false;
    checkButton.classList.remove('hidden');
    restartButton.classList.add('hidden');

    hintText.textContent = 'Start guessing!';
    hintText.className = 'hint-text'; // Reset classes
    chancesText.textContent = You have ${chancesLeft} chances;

    // 3. Attach event listeners (only on start to avoid duplicates)
    checkButton.removeEventListener('click', handleGuess);
    checkButton.addEventListener('click', handleGuess);
    restartButton.removeEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    
    // Allow 'Enter' key to check the guess
    guessInput.removeEventListener('keypress', handleEnterKey);
    guessInput.addEventListener('keypress', handleEnterKey);
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevents form submission if applicable
        handleGuess();
    }
}


function handleGuess() {
    if (!gameActive) return;

    const guess = parseInt(guessInput.value);

    // Input validation
    if (isNaN(guess) || guess < 1 || guess > 100) {
        hintText.textContent = 'Please enter a valid number between 1 and 100.';
        return;
    }

    // Decrement chances
    chancesLeft--;
    chancesText.textContent = You have ${chancesLeft} chances;

    // Game logic
    if (guess === secretNumber) {
        // Win condition
        hintText.innerHTML = Congratulations! You guessed the number ${secretNumber}! 🎉;
        hintText.classList.add('win');
        endGame(true);
    } else if (chancesLeft === 0) {
        // Lose condition
        hintText.innerHTML = Game Over! The number was ${secretNumber}. 😥;
        hintText.classList.add('lose');
        endGame(false);
    } else if (guess < secretNumber) {
        // Too Low
        hintText.innerHTML = 'Your Guess is Low 👇';
    } else {
        // Too High
        hintText.innerHTML = 'Your Guess is High 👆';
    }

    // Clear input for next guess
    guessInput.value = '';
    guessInput.focus();
}

function endGame(isWin) {
    gameActive = false;
    guessInput.disabled = true;
    checkButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
    
    if (isWin) {
        chancesText.textContent = It took you ${MAX_CHANCES - chancesLeft} guesses!;
    } else {
        chancesText.textContent = 'Better luck next time!';
    }
}

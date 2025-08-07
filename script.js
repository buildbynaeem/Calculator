// Calculator JavaScript with Event Listeners and Multiple Functions

// Global variables to store calculator state
let currentInput = '';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

// Get display element
const display = document.getElementById('display');

// Initialize calculator on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial display
    updateDisplay('0');
    
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyboardInput);
    
    // Add button press animation to all buttons
    const buttons = document.querySelectorAll('.buttons-grid button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('button-pressed');
            setTimeout(() => {
                this.classList.remove('button-pressed');
            }, 100);
        });
    });
});

/**
 * Updates the calculator display
 * @param {string} value - The value to display
 */
function updateDisplay(value) {
    display.value = value;
}

/**
 * Appends a number to the current input
 * @param {string} number - The number to append
 */
function appendNumber(number) {
    // If we should reset display (after calculation), clear current input
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple leading zeros
    if (currentInput === '0' && number === '0') {
        return;
    }
    
    // Replace leading zero with the new number
    if (currentInput === '0' && number !== '0') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    
    updateDisplay(currentInput);
}

/**
 * Appends a decimal point to the current input
 */
function appendDecimal() {
    // If we should reset display, start with "0."
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    // If current input is empty, start with "0."
    if (currentInput === '') {
        currentInput = '0';
    }
    
    // Only add decimal if there isn't one already
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay(currentInput);
    }
}

/**
 * Appends an operator to the calculation
 * @param {string} op - The operator to append
 */
function appendOperator(op) {
    // If there's a previous calculation pending, calculate it first
    if (currentInput !== '' && previousInput !== '' && operator !== '') {
        calculateResult();
    }
    
    // If current input is empty but we have a previous result, use it
    if (currentInput === '' && previousInput !== '') {
        currentInput = previousInput;
    }
    
    // If current input is still empty, don't proceed
    if (currentInput === '') {
        return;
    }
    
    // Store the current state
    previousInput = currentInput;
    operator = op;
    currentInput = '';
    shouldResetDisplay = true;
    
    // Update display to show the previous input
    updateDisplay(previousInput);
}

/**
 * Calculates and displays the result
 */
function calculateResult() {
    // Check if we have all necessary components
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    // Perform calculation based on operator
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            // Handle division by zero
            if (current === 0) {
                updateDisplay('Error');
                clearAll();
                return;
            }
            result = prev / current;
            break;
        case '%':
            // Handle modulo by zero
            if (current === 0) {
                updateDisplay('Error');
                clearAll();
                return;
            }
            result = prev % current;
            break;
        default:
            return;
    }
    
    // Format result to handle floating point precision
    result = Math.round(result * 100000000) / 100000000;
    
    // Update display and reset state
    updateDisplay(result.toString());
    currentInput = result.toString();
    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
}

/**
 * Calculates the square of the current number
 */
function calculateSquare() {
    if (currentInput === '') {
        return;
    }
    
    const number = parseFloat(currentInput);
    const result = number * number;
    
    // Format result
    const formattedResult = Math.round(result * 100000000) / 100000000;
    
    updateDisplay(formattedResult.toString());
    currentInput = formattedResult.toString();
    shouldResetDisplay = true;
}

/**
 * Toggles the sign of the current number
 */
function toggleSign() {
    if (currentInput === '' || currentInput === '0') {
        return;
    }
    
    if (currentInput.startsWith('-')) {
        currentInput = currentInput.substring(1);
    } else {
        currentInput = '-' + currentInput;
    }
    
    updateDisplay(currentInput);
}

/**
 * Clears all calculator data (AC function)
 */
function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    updateDisplay('0');
}

/**
 * Handles keyboard input for calculator
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboardInput(event) {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/.%='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }
    
    // Handle different key types
    if ('0123456789'.includes(key)) {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if ('+-*/%'.includes(key)) {
        appendOperator(key);
    } else if (key === '=' || key === 'Enter') {
        calculateResult();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        // Implement backspace functionality
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            if (currentInput === '' || currentInput === '-') {
                updateDisplay('0');
                currentInput = '';
            } else {
                updateDisplay(currentInput);
            }
        }
    }
}

// Additional utility functions for enhanced functionality

/**
 * Formats large numbers with commas (optional enhancement)
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Validates if input is a valid number
 * @param {string} input - The input to validate
 * @returns {boolean} - True if valid number
 */
function isValidNumber(input) {
    return !isNaN(parseFloat(input)) && isFinite(input);
}

// Error handling for edge cases
window.addEventListener('error', function(event) {
    console.error('Calculator error:', event.error);
    clearAll();
    updateDisplay('Error');
    setTimeout(() => {
        updateDisplay('0');
    }, 2000);
});

// Console log for debugging (can be removed in production)
console.log('Calculator initialized successfully!');
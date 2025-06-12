document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const prevOperandElement = document.getElementById('prev-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const numberButtons = document.querySelectorAll('[data-number]');
    const operatorButtons = document.querySelectorAll('[data-operator]');
    const clearButton = document.getElementById('clear');
    const deleteButton = document.getElementById('delete');
    const equalsButton = document.getElementById('equals');

    // Calculator state
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let shouldResetDisplay = false;

    // Functions
    function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        
        if (operation != null) {
            prevOperandElement.textContent = `${previousOperand} ${operation}`;
        } else {
            prevOperandElement.textContent = '';
        }
    }

    function appendNumber(number) {
        if (shouldResetDisplay) {
            currentOperand = '';
            shouldResetDisplay = false;
        }
        
        // Prevent multiple decimal points
        if (number === '.' && currentOperand.includes('.')) return;
        
        // Replace 0 with number unless it's a decimal point
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
    }

    function chooseOperation(op) {
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            compute();
        }
        
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    clear();
                    currentOperand = 'Error';
                    shouldResetDisplay = true;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Format the result
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        shouldResetDisplay = true;
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }

    function deleteNumber() {
        if (currentOperand === '0' || shouldResetDisplay) return;
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    // Event listeners for buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.getAttribute('data-number'));
            updateDisplay();
        });
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.getAttribute('data-operator'));
            updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => {
        compute();
        updateDisplay();
    });

    clearButton.addEventListener('click', () => {
        clear();
        updateDisplay();
    });

    deleteButton.addEventListener('click', () => {
        deleteNumber();
        updateDisplay();
    });

    // Keyboard support
    document.addEventListener('keydown', event => {
        if (/^\d$/.test(event.key)) {
            appendNumber(event.key);
            updateDisplay();
        } else if (event.key === '.') {
            appendNumber('.');
            updateDisplay();
        } else if (event.key === '+' || event.key === '-') {
            chooseOperation(event.key);
            updateDisplay();
        } else if (event.key === '*') {
            chooseOperation('×');
            updateDisplay();
        } else if (event.key === '/') {
            event.preventDefault(); // Prevent browser search
            chooseOperation('÷');
            updateDisplay();
        } else if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            compute();
            updateDisplay();
        } else if (event.key === 'Backspace') {
            deleteNumber();
            updateDisplay();
        } else if (event.key === 'Escape') {
            clear();
            updateDisplay();
        }
    });

    // Initialize display
    updateDisplay();
});

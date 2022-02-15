'use strict'
import './styles.css';

let buttons = document.querySelectorAll('.btn');
let screen = document.querySelector('.calculator-screen');
let clearButton = document.querySelector('.btn-danger');
let currentResult;
let operator = '';
let operand = '';
let calculated = false;
let waitingForInput = false;
let operatorLast = true;

initiateButtons();
initiateKeys();

function initiateButtons() {
  buttons.forEach((button) => {
    if (button.className.includes('operator')) {
      button.onclick = () => operatorClicked(button.value);
    } else {
      switch(button.value) {
        case 'clear':
          button.onclick = () => clear();
          break;
        case '=':
          button.onclick = () => equals();
          break;
        default:
          button.onclick = () => inputClicked(button.value);
      }
    }
  });
}

function initiateKeys() {
  document.addEventListener('keypress', event => {
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'].includes(event.key)) {
      inputClicked(event.key);
    } else if (['+', '-', '*', '/'].includes(event.key)) {
      operatorClicked(event.key);
    } else if (['c', 'C', 'Escape'].includes(event.key)) {
      clear();
    } else if (event.key === 'Backspace') {
      removeLast();
    } else if (event.key === 'Enter') {
      equals();
    }
  });
}

function calculate() {
  switch(operator) {
    case '+':
      return currentResult + parseFloat(operand);
    case '-':
      return currentResult - parseFloat(operand);
    case '*':
      return currentResult * parseFloat(operand);
    case '/':
      return currentResult / parseFloat(operand);
    default:
      return 0;
  }
}

function operatorClicked(value) {
  if (operatorLast && value === '-') {
    inputClicked(value);
  } else if (operand && operand !== '-') {
    if (!calculated) {
      equals();
    }
    operator = value;
    operatorLast = true;
    waitingForInput = true;
  }
}

function clear() {
  if (screen.value.toString().length === 0) {
    currentResult = undefined;
    operator = '';
    clearButton.classList.add('disabled');
  } else {
    clearButton.textContent = 'CE';
  }
  screen.value = '';
  operand = '';
  operatorLast = true;
}

function removeLast() {
  if (!calculated) {
    const length = screen.value.toString().length - 1;
    screen.value = screen.value.toString().substr(0, length);
    operand = screen.value;
  }
}

function equals() {
  if (screen.value && !operatorLast) {
    if (currentResult === undefined || operator === '') {
      currentResult = parseFloat(screen.value);
    } else {
      currentResult = calculate();
    }
    waitingForInput = true;
    screen.value = currentResult.toString().length > 11 ? currentResult.toExponential(6) : currentResult;
    calculated = true;
  }
}

function inputClicked(input) {
  calculated = false;
  operatorLast = false;

  if (waitingForInput) {
    screen.value = '';
    waitingForInput = false;
  }

  const current = screen.value.toString();

  if (current.length === 0) {
    clearButton.textContent = 'C';
    clearButton.classList.remove('disabled');
  }

  if (input === '0' && (current === '0' || current === '-0')) {
    return;
  }

  if ((!isNaN(input) || input === '-' || (input === '.' && !current.includes('.'))) && current.length <= 10) {
    screen.value = screen.value + input;
    operand = screen.value;
  }
}

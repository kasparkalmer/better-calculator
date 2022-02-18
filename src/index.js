'use strict'
import './styles.css';

class Calculator {
  constructor() {
    this.lastCalculation = undefined;
    this.currentInput = '';
  }

  operator(operator) {
    if (operator === '-' && this.currentInput.length === 0) {
      return this.input(operator);
    } else if (!isNaN(this.currentInput)) {
      return this.newCalculation(operator);
    }
  }

  newCalculation(operator) {
    if (isNaN(this.currentInput)) {
      return this.currentInput;
    }

    if (this.lastCalculation && this.lastCalculation.operand2) {
      this.lastCalculation = new Calculation(this.lastCalculation, operator);
      this.lastCalculation.operand2 = this.currentInput;
    } else if (this.lastCalculation) {
      this.lastCalculation.operand2 = this.currentInput;
      this.lastCalculation = new Calculation(this.lastCalculation, operator);
    } else {
      this.lastCalculation = new Calculation(this.currentInput, operator);
    }

    this.currentInput = '';
    return this.lastCalculation.getResult();
  }

  equals() {
    if (this.lastCalculation.operand2) {
      const newCalculation = new Calculation(this.lastCalculation, this.lastCalculation.operator);
      newCalculation.operand2 = this.lastCalculation.operand2;
      this.lastCalculation = newCalculation;
    } else {
      this.lastCalculation.operand2 = this.currentInput;
      this.currentInput = '';
    }
    return this.lastCalculation.getResult();
  }

  input(input) {
    if (input === '0' && (this.currentInput === '0' || this.currentInput === '-0')) {
      return this.currentInput;
    }

    if ((!isNaN(input) || input === '-'
        || (input === '.' && !this.currentInput.includes('.')))
        && this.currentInput.length <= 10) {
      this.currentInput = this.currentInput + input;
    }

    return this.currentInput;
  }

  clear() {
    this.currentInput = '';
    return this.currentInput;
  }

  clearEverything() {
    this.lastCalculation = undefined;
    this.currentInput = '';
    return this.currentInput;
  }

  removeLast() {
    const inputLength = this.currentInput.length

    if (inputLength) {
      this.currentInput = this.currentInput.substr(0, inputLength - 1);
      return this.currentInput;
    }

    return this.lastCalculation.getResult();
  }
}

class Calculation {
  constructor(operand1, operator) {
    this.operand1 = operand1;
    this.operator = operator;
    this.operand2;
  }

  get operand1() {
    return this._operand1 instanceof Calculation ? this._operand1.getResult() : this._operand1;
  }

  set operand1(value) {
    if (value instanceof Calculation) {
      this._operand1 = value;
    } else if (!isNaN(value)) {
      this._operand1 = parseFloat(value);
    } else {
      alert('INTERNAL ERROR! Please refresh the page.');
    }
  }

  get operator() {
    return this._operator;
  }

  set operator(value) {
    if (['+', '-', '*', '/'].includes(value)) {
      this._operator = value;
    } else {
      alert('INTERNAL ERROR! Please refresh the page.');
    }
  }

  getResult() {
    if (this.operand2) {
      switch(this.operator) {
        case '+':
          return this.operand1 + parseFloat(this.operand2);
        case '-':
          return this.operand1 - parseFloat(this.operand2);
        case '*':
          return this.operand1 * parseFloat(this.operand2);
        case '/':
          return this.operand1 / parseFloat(this.operand2);
        default:
          return 0;
      }
    } else {
      return this.operand1;
    }
  }
}

class CalculatorUI {
  constructor() {
    this.calculator = new Calculator();

    this.screen = document.querySelector('.calculator-screen');
    this.clearButton = document.querySelector('.btn-danger');

    this.initiateButtons();
    this.initiateKeys();
  }

  initiateButtons() {
    let buttons = document.querySelectorAll('.btn');

    buttons.forEach((button) => {
      if (button.className.includes('operator')) {
        button.onclick = () => this.operatorClicked(button.value);
      } else {
        switch(button.value) {
          case 'clear':
            button.onclick = () => this.clearClicked();
            break;
          case '=':
            button.onclick = () => this.equalsClicked();
            break;
          default:
            button.onclick = () => this.inputClicked(button.value);
        }
      }
    });
  }

  initiateKeys() {
    document.addEventListener('keypress', event => {
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'].includes(event.key)) {
        this.inputClicked(event.key);
      } else if (['+', '-', '*', '/'].includes(event.key)) {
        this.operatorClicked(event.key);
      } else if (['c', 'C', 'Escape'].includes(event.key)) {
        this.clearClicked();
      } else if (event.key === 'Backspace') {
        this.backspaceClicked();
      } else if (event.key === 'Enter') {
        this.equalsClicked();
      }
    });
  }
  
  operatorClicked(operator) {
    this.setScreen(this.calculator.operator(operator));
  }
  
  clearClicked() {
    if (this.clearButton.textContent === 'C') {
      this.screen.value = this.calculator.clear();
      this.clearButton.textContent = 'CE';
    } else {
      this.screen.value = this.calculator.clearEverything();
      this.clearButton.classList.add('disabled');
    }
  }
  
  backspaceClicked() {
    this.screen.value = this.calculator.removeLast();
  }
  
  equalsClicked() {
    this.setScreen(this.calculator.equals());
  }
  
  inputClicked(input) {
    this.screen.value = this.calculator.input(input);
    if (this.screen.value) {
      this.clearButton.textContent = 'C';
      this.clearButton.classList.remove('disabled');
    }
  }

  setScreen(value) {
    this.screen.value = value.toString().length > 11 ? value.toExponential(6) : value;
  }
}

new CalculatorUI();

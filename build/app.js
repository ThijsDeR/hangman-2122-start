const wordList = ['word', 'sheeesh', 'depression'];
const canvas = document.querySelector('canvas#stageCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 200;
canvas.height = 200;
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const hangmanStages = [
    [],
    [
        { startX: canvas.width * 0.1, startY: canvas.height * 0.925, endX: canvas.width * 0.9, endY: canvas.height * 0.925, size: canvas.height * 0.05, color: 'white' }
    ],
    [
        { startX: canvas.width * 0.125, startY: canvas.height * 0.925, endX: canvas.width * 0.125, endY: canvas.height * 0.075, size: canvas.width * 0.05, color: 'white' }
    ],
    [
        { startX: canvas.width * 0.1, startY: canvas.height * 0.1, endX: canvas.width * 0.525, endY: canvas.height * 0.1, size: canvas.height * 0.05, color: 'white' },
        { startX: canvas.width * 0.5, startY: canvas.height * 0.1, endX: canvas.width * 0.5, endY: canvas.height * 0.2, size: canvas.height * 0.025, color: 'white' }
    ],
    [
        { startX: canvas.width * 0.5, startY: canvas.height * 0.2, endX: canvas.width * 0.5, endY: canvas.height * 0.3, size: canvas.height * 0.1, color: 'red' }
    ],
    [
        { startX: canvas.width * 0.5, startY: canvas.height * 0.3, endX: canvas.width * 0.5, endY: canvas.height * 0.45, size: canvas.height * 0.035, color: 'red' }
    ],
    [
        { startX: canvas.width * 0.5, startY: canvas.height * 0.425, endX: canvas.width * 0.6, endY: canvas.height * 0.325, size: canvas.height * 0.025, color: 'red' },
        { startX: canvas.width * 0.5, startY: canvas.height * 0.425, endX: canvas.width * 0.4, endY: canvas.height * 0.325, size: canvas.height * 0.025, color: 'red' }
    ],
    [
        { startX: canvas.width * 0.5, startY: canvas.height * 0.45, endX: canvas.width * 0.6, endY: canvas.height * 0.5, size: canvas.height * 0.025, color: 'red' },
        { startX: canvas.width * 0.5, startY: canvas.height * 0.45, endX: canvas.width * 0.4, endY: canvas.height * 0.5, size: canvas.height * 0.025, color: 'red' }
    ],
    [
        { startX: canvas.width * 0.6, startY: canvas.height * 0.325, endX: canvas.width * 0.4, endY: canvas.height * 0.225, size: canvas.height * 0.025, color: 'red' },
        { startX: canvas.width * 0.4, startY: canvas.height * 0.325, endX: canvas.width * 0.3, endY: canvas.height * 0.225, size: canvas.height * 0.025, color: 'red' }
    ],
];
class Game {
    word;
    wordState;
    attemptsLeft;
    gameOver;
    wordFound;
    constructor() {
        this.restart();
    }
    restart() {
        this.word = wordList[randomNumber(0, wordList.length - 1)];
        this.wordState = [...'_'.repeat(this.word.length)];
        this.attemptsLeft = 8;
        this.gameOver = false;
        this.wordFound = false;
        writeAlphabetToTheDom();
        this.writeWordToDom(undefined);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    checkLetter(letter) {
        if (!this.gameOver) {
            if (this.word.includes(letter)) {
                this.word.split('').forEach((character, index) => {
                    if (character === letter) {
                        this.wordState[index] = letter;
                    }
                });
                this.writeWordToDom(true);
                if (!this.wordState.includes("_")) {
                    this.wordFound = true;
                    this.gameOver = true;
                    this.endGame(true);
                }
            }
            else {
                this.attemptsLeft -= 1;
                this.writeWordToDom(false);
                if (this.attemptsLeft === 0) {
                    this.gameOver = true;
                    this.endGame(false);
                }
            }
        }
    }
    writeWordToDom(state) {
        if (state === true || state === undefined) {
            const lettersUl = document.querySelector('ul#letters');
            lettersUl.innerHTML = '';
            this.wordState.forEach((character) => {
                const charElement = document.createElement('li');
                charElement.innerHTML = character;
                lettersUl.append(charElement);
            });
        }
        if (state === false || state === undefined) {
            const attempsLeftSpan = document.querySelector('span#attempt');
            attempsLeftSpan.innerHTML = `${this.attemptsLeft}`;
            hangmanStages[8 - this.attemptsLeft].forEach((canvasLine) => {
                ctx.beginPath();
                ctx.strokeStyle = canvasLine.color;
                ctx.lineWidth = canvasLine.size;
                ctx.moveTo(canvasLine.startX, canvasLine.startY);
                ctx.lineTo(canvasLine.endX, canvasLine.endY);
                ctx.stroke();
                ctx.closePath();
            });
        }
    }
    endGame(isWon) {
        const lettersUl = document.querySelector('ul#letters');
        lettersUl.innerHTML = '';
        const textElement = document.createElement('li');
        if (isWon) {
            textElement.innerHTML = `YOU WON`;
        }
        else {
            textElement.innerHTML = `YOU LOOOOOOOOOOOOOOOSE`;
        }
        const restartButton = document.createElement('button');
        restartButton.innerHTML = 'Restart';
        restartButton.addEventListener('click', () => {
            game.restart();
        });
        lettersUl.append(textElement, restartButton);
        this.disableKeyboard();
    }
    disableKeyboard() {
        const keyboardKeys = document.querySelectorAll('#keyboard > div');
        Array.from(keyboardKeys).forEach((key) => {
            key.classList.add('idle');
        });
    }
}
const game = new Game();
function writeAlphabetToTheDom() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const keyboard = document.querySelector('#keyboard');
    keyboard.innerHTML = '';
    alphabet.forEach((element) => {
        const divKey = document.createElement('div');
        divKey.id = element;
        divKey.classList.add('key');
        divKey.innerHTML = element;
        const keyEventListener = divKey.addEventListener('click', () => {
            if (!divKey.classList.contains('idle')) {
                game.checkLetter(element);
                divKey.classList.add('idle');
            }
        });
        keyboard.append(divKey);
    });
}
function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function init() {
    writeAlphabetToTheDom();
}
window.addEventListener('load', init);
//# sourceMappingURL=app.js.map
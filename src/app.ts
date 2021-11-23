// Global variables
const wordList = ['word', 'sheeesh', 'depression']
const canvas = document.querySelector('canvas#stageCanvas')! as HTMLCanvasElement
const ctx = canvas.getContext('2d')

canvas.width = 200
canvas.height = 200

ctx.fillStyle = 'black'
ctx.fillRect(0, 0, canvas.width, canvas.height)

const hangmanStages = [
  [

  ],
  [
    {startX: canvas.width * 0.1, startY: canvas.height * 0.925, endX: canvas.width * 0.9, endY: canvas.height * 0.925, size: canvas.height * 0.05, color: 'white'}
  ],
  [
    {startX: canvas.width * 0.125, startY: canvas.height * 0.925, endX: canvas.width * 0.125, endY: canvas.height * 0.075, size: canvas.width * 0.05, color: 'white'}
  ],
  [
    {startX: canvas.width * 0.1, startY: canvas.height * 0.1, endX: canvas.width * 0.525, endY: canvas.height * 0.1, size: canvas.height * 0.05, color: 'white'},
    {startX: canvas.width * 0.5, startY: canvas.height * 0.1, endX: canvas.width * 0.5, endY: canvas.height * 0.2, size: canvas.height * 0.025, color: 'white'}
  ],
  [
    {startX: canvas.width * 0.5, startY: canvas.height * 0.2, endX: canvas.width * 0.5, endY: canvas.height * 0.3, size: canvas.height * 0.1, color: 'red'}
  ],
  [
    {startX: canvas.width * 0.5, startY: canvas.height * 0.3, endX: canvas.width * 0.5, endY: canvas.height * 0.45, size: canvas.height * 0.035, color: 'red'}
  ],
  [
    {startX: canvas.width * 0.5, startY: canvas.height * 0.425, endX: canvas.width * 0.6, endY: canvas.height * 0.325, size: canvas.height * 0.025, color: 'red'},
    {startX: canvas.width * 0.5, startY: canvas.height * 0.425, endX: canvas.width * 0.4, endY: canvas.height * 0.325, size: canvas.height * 0.025, color: 'red'}
  ],
  [
    {startX: canvas.width * 0.5, startY: canvas.height * 0.45, endX: canvas.width * 0.6, endY: canvas.height * 0.5, size: canvas.height * 0.025, color: 'red'},
    {startX: canvas.width * 0.5, startY: canvas.height * 0.45, endX: canvas.width * 0.4, endY: canvas.height * 0.5, size: canvas.height * 0.025, color: 'red'}
  ],
  [
    {startX: canvas.width * 0.6, startY: canvas.height * 0.325, endX: canvas.width * 0.4, endY: canvas.height * 0.225, size: canvas.height * 0.025, color: 'red'},
    {startX: canvas.width * 0.4, startY: canvas.height * 0.325, endX: canvas.width * 0.3, endY: canvas.height * 0.225, size: canvas.height * 0.025, color: 'red'}
  ],
  

]
class Game{
  lettersInDom: HTMLElement
  attemptsInDom: HTMLElement

  word: string;
  wordState: string[];
  attemptsLeft: number;
  gameOver: boolean;
  wordFound: boolean;
  constructor(){
    this.lettersInDom = document.querySelector('ul#letters')
    this.attemptsInDom = document.querySelector('span#attempt')
    this.restart()
  }

  restart(){
    this.word = wordList[randomNumber(0, wordList.length - 1)]
    this.wordState = [...'_'.repeat(this.word.length)]
    this.attemptsLeft = 8
    this.gameOver = false
    this.wordFound = false
    writeAlphabetToTheDom()
    this.writeWordToDom(undefined)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  checkLetter(letter: string){
    if(!this.gameOver){
      if(this.word.includes(letter)){
        this.word.split('').forEach((character, index) => {
          if(character === letter){
            this.wordState[index] = letter
          }
        })
        this.writeWordToDom(true)
        if(!this.wordState.includes("_")){
          this.wordFound = true
          this.gameOver = true
          this.endGame(true)
        }
        
      }
      else{
        this.attemptsLeft -= 1
        this.writeWordToDom(false)
        if(this.attemptsLeft === 0){
          this.gameOver = true
          this.endGame(false)
        }
      }
    }
  }

  writeWordToDom(state: boolean | undefined){
    if(state === true || state === undefined){

      this.lettersInDom.innerHTML = ''
  
      this.wordState.forEach((character) => {
        const charElement = document.createElement('li')
        charElement.innerHTML = character
        this.lettersInDom.append(charElement)
      })
    }

    if(state === false || state === undefined){

      this.attemptsInDom.innerHTML = `${this.attemptsLeft}`
      
        
        hangmanStages[8 - this.attemptsLeft].forEach((canvasLine) => {

          ctx.beginPath()
          ctx.strokeStyle = canvasLine.color
          ctx.lineWidth = canvasLine.size
          ctx.moveTo(canvasLine.startX, canvasLine.startY)
          ctx.lineTo(canvasLine.endX, canvasLine.endY)
          ctx.stroke()
          ctx.closePath()
        
        })
        
      
      // const stageImageContainer = document.querySelector('div#stageImageContainer')
      // stageImageContainer.innerHTML = ''
  
      // const stageImage = document.createElement('img')
      // stageImage.src = `./assets/Renewed_Hangman/Hangman_Stage_${10 - this.attemptsLeft}.png`
      // stageImageContainer.append(stageImage)
    }
    

  }

  
  endGame(isWon: boolean){
    this.lettersInDom.innerHTML = ''

    const textElement = document.createElement('li')
    if(isWon){
      textElement.innerHTML = `YOU WON`
    } else {
      textElement.innerHTML = `YOU LOOOOOOOOOOOOOOOSE`
    }

    const restartButton = document.createElement('button')
    restartButton.innerHTML = 'Restart'
    restartButton.addEventListener('click', () => {
      game.restart()
    })
    this.lettersInDom.append(textElement, restartButton)
    this.disableKeyboard()
  }

  disableKeyboard(){
    const keyboardKeys = document.querySelectorAll('#keyboard > div')! as NodeListOf<HTMLDivElement>
    Array.from(keyboardKeys).forEach((key) => {
      key.classList.add('idle')
    })
  }
}

const game = new Game()

/**
 * Function to write the alphabet keyboard to the DOM
 */
function writeAlphabetToTheDom() {
  const alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const keyboard: HTMLDivElement = document.querySelector('#keyboard');
  keyboard.innerHTML = ''

  alphabet.forEach((element) => {
    const divKey: HTMLDivElement = document.createElement('div');
    divKey.id = element;
    divKey.classList.add('key');
    divKey.innerHTML = element;
    const keyEventListener = divKey.addEventListener('click', () => {
      if(!divKey.classList.contains('idle')){
        game.checkLetter(element)
        divKey.classList.add('idle')
      }
    })
    keyboard.append(divKey);
  });
}


/**
 * Returns a random number between min and max
 * @param {number} min - lower boundary
 * @param {number} max - upper boundary
 * @returns {number} random number
 */
function randomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Function to initialize the programme
 */
function init() {
  // write the alphabet keyboard to the DOM
  writeAlphabetToTheDom();
}

window.addEventListener('load', init);
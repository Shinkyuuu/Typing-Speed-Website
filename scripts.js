const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const quoteDisplayElem = document.getElementById('quoteDisplay');
const quoteInputElem = document.getElementById('quoteInput');
const timerElem = document.getElementById('timer');
let timerStart = false;
var timer;

function resetOnTab() {
    var key = window.event.keyCode;
    if (key == 9) {
        event.preventDefault();
        renderNewQuote();
    }
}

quoteInputElem.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElem.querySelectorAll('span');
    const arrayValue = quoteInputElem.value.split('');
    let correct = true;
    
    if (timerStart == false && arrayValue != null) {
        timerStart = true;
        setTimer();
    }

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == characterSpan.innerText) { // Correct  
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else if (character == null) { // Empty  
            characterSpan.classList.remove('incorrect');
            characterSpan.classList.remove('correct');
            correct = false;
        } else { // Incorrect  
            characterSpan.classList.add('incorrect');
            characterSpan.classList.remove('correct');
            correct = false;
        }
    })

    if (correct == true) renderNewQuote();
})

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content);
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElem.innerText = '';
    quoteInputElem.value = null;
    timerElem.innerText = 0;
    clearInterval(timer);
    timerStart = false;

    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElem.appendChild(characterSpan);
    })

    console.log(quote);
}

let startTime;
function setTimer() {
    startTime = new Date();
    timer = setInterval(startTimer, 1000);
}

function startTimer() {
    currentTime = Math.floor((new Date() - startTime) / 1000);
    timerElem.innerText = currentTime;
    console.log(currentTime);
}

renderNewQuote();
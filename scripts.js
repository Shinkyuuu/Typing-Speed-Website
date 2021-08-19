const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const containerElem = document.getElementById('container')
const quoteDisplayElem = document.getElementById('quoteDisplay');
const quoteInputElem = document.getElementById('quoteInput');
const timerElem = document.getElementById('timer');
const caretElem = document.getElementById('caret');
var timerStart = false;
var startTime;
var timer;

// When user presses "Tab", reset the quote.
function resetOnTab() {
    let key = window.event.keyCode;
    if (key == 9) {
        event.preventDefault();
        renderNewQuote();
    }
}

// Begin the timer
function setTimer() {
    startTime = new Date();
    timer = setInterval(timerFunc, 1000);
}

// Timer logic
function timerFunc() {
    currentTime = Math.floor((new Date() - startTime) / 1000);
    timerElem.innerText = currentTime;
}

// Listen for user typing.
quoteInputElem.addEventListener('input', () => {
    let arrayQuote = quoteDisplayElem.querySelectorAll('span');
    arrayQuote = Array.from(arrayQuote);
    const arrayValue = quoteInputElem.value.split('');
    let correct = true;
    
    // Turn timer on at the start of attempt.
    if (timerStart == false) {
        timerStart = true;
        setTimer();
    }

    // For each character, check if correct, incorrect, or unfilled.
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
    });

    // If whole quote is correct, give the user a new quote.
    if (correct == true) renderNewQuote();

    // Insert caret before most recent character.
    document.getElementById('a'+arrayValue.length).parentNode.insertBefore(caretElem, 
        quoteDisplayElem.querySelector("#a"+ arrayValue.length));
});

// Get a random quote from API.
function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content);
}

// Create a new quote and split it into divs/spans.
async function renderNewQuote() {
    const quote = await getRandomQuote();

    // Setup the quote display and text input.
    quoteDisplayElem.innerText = '';
    quoteInputElem.value = null;

    // Setup timer.
    timerElem.innerText = 0;
    clearInterval(timer);
    timerStart = false;

    // quote.split('').forEach((character, index) => {
    //     const characterSpan = document.createElement('span');
    //     characterSpan.id = 'a' + index;
    //     characterSpan.innerText = character;
    //     quoteDisplayElem.appendChild(characterSpan);
    // })

    // quote.split(' ').forEach((word) => {
    //     const wordDiv = document.createElement('div');
    //     wordDiv.classList.add("word");
    //     word.split('').forEach((character, index) => {
    //         const characterSpan = document.createElement('span');
    //         characterSpan.id = 'a'+index;
    //         characterSpan.innerText = character;
    //         wordDiv.appendChild(characterSpan);
    //     })

    //     quoteDisplayElem.appendChild(wordDiv);
    //     const space = document.createElement('span');
    //     space.innerText = ' ';
    //     quoteDisplayElem.appendChild(space);
    // })

    splitQuote(quote);

    // Place caret before the first word.
    quoteDisplayElem.firstElementChild.insertBefore(caretElem,
        document.getElementById("a0"));
}

 // Split the quote.
function splitQuote(quote) {
    let quoteList = quote.split(' ');
    let characterCount = 0;

    // Create a div for each word then split the word into characters, then create a span for each character.
    // Add an empty space after each word.
    for (let i = 0; i < quoteList.length; i++) {
        const characterSpace = document.createElement('span');
        const wordDiv = document.createElement('div');
        wordDiv.classList.add("word");

        quoteList[i].split('').forEach((character) => {
            const characterSpan = document.createElement('span');
            characterSpan.id = 'a'+characterCount;
            characterSpan.innerText = character;

            // Add character to word.
            wordDiv.appendChild(characterSpan);

            characterCount+=1;
        });

        // Add word to quote.
        quoteDisplayElem.appendChild(wordDiv);

        // Create the space character and add to quote.
        characterSpace.id = 'a'+characterCount;
        characterSpace.innerText = ' ';
        quoteDisplayElem.appendChild(characterSpace);
        
        characterCount+=1;
    }

    // The last space character is unneccesary.
    quoteDisplayElem.removeChild(quoteDisplayElem.lastChild);
    characterCount-=1;
}

// When user enters page, focus the text box.
function ready() {
    quoteInputElem.focus();
}


renderNewQuote();

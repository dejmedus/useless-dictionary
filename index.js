const formEl = document.getElementById('form');
const defEl = document.getElementById('definition');

formEl.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(e.target);
    const word = formData.get('word');

    // set defEl to the definition of a word similar to the form input word
    (async () => {
        let definition = await fetchRandomWord(word);
        defEl.innerText = definition;
    })()
})

async function fetchRandomWord(word) {
    const firstLetter = word[0].toLowerCase();
    const wordLength = word.length;
    try {
        // while randomWord is equal to the form input word...
        let randomWord = [word];
        while (randomWord[0] == word) {
            // ...fetch random word that is the same length and starts with the same letter 
            const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${wordLength}&letter=${firstLetter}`)
            randomWord = await response.json();

            //  get definition of random word
            return await fetchDefinition(randomWord);
        }
    }
    catch {
        // if random word of same length/first letter cannot be found
        // get an entirely random fallback word and fetch its definition
        randomWord = await fetchFallbackWord()
        return await fetchDefinition(randomWord);
    }
}

async function fetchDefinition(word) {
    try {
        // fetch definition array
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        // choose one random definition
        const randomDefinition = arrRandom(arrRandom(data[0].meanings).definitions)

        // if that random definition is undefined, try a different random word
        if (randomDefinition == undefined) {
            return await fetchRandomWord(word[0])
        }
        return randomDefinition.definition
    }
    catch {
        // if a definition cannot be found, try a different random word
        return await fetchRandomWord(word[0])
    }
}

async function fetchFallbackWord() {
    try {
        // fetch a random word
        const response = await fetch(`https://random-word-api.vercel.app/api?words=1`)
        return await response.json();
    }
    catch {
        // if all fails, use provided word
        return 'mistake'
    }
}

function arrRandom(arr) {
    // get random array element
    return arr[getRandom(arr.length)]
}

function getRandom(len) {
    // get random number
    return Math.round(Math.random() * len);
}


const formEl = document.getElementById('form');
const defEl = document.getElementById('definition');

formEl.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(e.target);
    const word = formData.get('word');

    (async () => {
        let definition = await getUselessDefinition(word);
        defEl.innerText = definition !== undefined ? definition : 'No results...'
    })()
})

async function getUselessDefinition(word) {
    const definitions = await fetchAntonymDefinitions(word)
    return definitions[getRandom(definitions.length)]
}

async function fetchAntonymDefinitions(word) {
    // fetch word
    const noResults = ['No results...'];
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        const data = await response.json();

        if (data.title == 'No Definitions Found') {
            return noResults
        }

        // fetch list of antonyms
        for (let i = 0; i < data[0].meanings.length; i++) {
            const antonym_list = data[0].meanings[i].antonyms;

            if (antonym_list.length > 0) {
                for (let j = 0; i < antonym_list.length; j++) {
                    // get antonym definitions array
                    try {
                        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${antonym_list[i]}`);
                        const data = await response.json();
                        return data[0].meanings[0].definitions.map(def => def.definition)
                    }
                    catch {
                        console.log('Could not find the definition of ', antonym_list[i]);
                    }

                }
            }
        }
        return noResults
    }
    catch {
        return noResults
    }
}

function getRandom(len) {
    return Math.round(Math.random() * len);
}
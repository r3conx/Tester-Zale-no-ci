document.addEventListener('DOMContentLoaded', () => {
    initializeDependencies();
    document.getElementById('testButton').addEventListener('click', runTest);
    document.getElementById('generateStringButton').addEventListener('click', generateString);
});

let dynamicDependencies = {};

function initializeDependencies() {
    updateDynamicDependencies();
}


function updateDynamicDependencies() {
    removeDynamicDependencies();
    const input = document.getElementById('inputStrings').value
    const strings = input.split(',');
    const currentStrings = document.getElementById('inputStrings').value.split(',');
        const newDynamicDependencies = generateDynamicSumDependencies(strings);
    console.log("aha");
        Object.entries(newDynamicDependencies).forEach(([depName, func]) => {
            const result = func(strings);
            console.log(result);
            if (result.every(res => res)) {
                addDependency(`Dynamiczna: ${depName}`, depName, true);
            }
        });
    
}







function runTest() {
    updateDynamicDependencies();
    const input = document.getElementById('inputStrings').value;
    const strings = input.split(',');
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const newDynamicDependencies = generateDynamicSumDependencies(strings);

    Object.entries(newDynamicDependencies).forEach(([depName, func]) => {
        const result = func(strings);
        const resultText = result.every(res => res) ? 'Spełnia zależność' : 'Nie spełnia zależności';
        resultsDiv.innerHTML += `<p>Zależność: ${depName} - ${resultText}</p>`;
    });
}







function removeDynamicDependencies() {
    const dynamicDeps = document.querySelectorAll('.dynamic-dependency');
    dynamicDeps.forEach(dep => {
        const depName = dep.id.replace('dep-', '');
        delete window[depName];
        delete dynamicDependencies[depName];
        dep.remove();
    });
}

function addDependency(name, funcName, isFulfilled) {
    const list = document.getElementById('dependenciesList');
    const listItem = document.createElement('div');
    listItem.classList.add('dependency');
    listItem.id = 'dep-' + funcName;
    listItem.innerHTML = `<input type="checkbox" id="check-${funcName}" ${isFulfilled ? 'checked' : ''}><label for="check-${funcName}">${name}</label>`;
    list.appendChild(listItem);
    console.log(`Dodano zależność: ${name}`);
}


function generateString() {
    //updateDynamicDependencies();
    const selectedDependencies = getSelectedDependencies();
    const maxLength = Math.max(...(document.getElementById('inputStrings').value.split(',').map(s => s.length)));

    let generatedString = '';
    let attempts = 0;
    const maxAttempts = 10000;

    while(attempts < maxAttempts) {
        let candidate = generateRandomString(maxLength);
        if (testStringWithDependencies(candidate, selectedDependencies)) {
            generatedString = candidate;
            break;
        }
        attempts++;
    }

    if (generatedString) {
        document.getElementById('outputStrings').textContent = generatedString;
        console.log(`Udało się wygenerować string spełniający wybrane zależności po ${attempts} próbach.`);
        console.log(`Wygenerowany string: ${generatedString}`);
        console.log(`Wybrane zależności: ${selectedDependencies.map(dep => dep.name).join(', ')}`);
        console.log(`Wygenerowany string spełnia zależności: ${selectedDependencies.map(dep => dep.name).join(', ')}`);
    } else {
        console.log("Nie udało się wygenerować stringu spełniającego wybrane zależności.");
        console.log(`Próbowano ${attempts} razy.`);
    }
}

function getSelectedDependencies() {
    return Object.keys(dynamicDependencies)
        .filter(key => document.getElementById(`check-${key}`).checked)
        .map(key => dynamicDependencies[key]);
}

function generateRandomString(length) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
    }
    
    function testStringWithDependencies(string, dependencies) {
    return dependencies.every(dep => dep([string])[0]);
    }
    






    // Tutaj dodaj funkcję generateDynamicSumDependencies i inne funkcje pomocnicze
    function generateDynamicSumDependencies(strings) {
        let dynamicDependencies = {};
    
        for (let targetIndex = 0; targetIndex < strings[0].length; targetIndex++) {
            for (let sumStartIndex = 0; sumStartIndex < strings[0].length; sumStartIndex++) {
                for (let sumEndIndex = sumStartIndex; sumEndIndex < strings[0].length; sumEndIndex++) {
                    if (targetIndex !== sumStartIndex && targetIndex !== sumEndIndex) {
                        let depName = `sumOfDigitsAt${sumStartIndex}to${sumEndIndex}EqualsDigitAt${targetIndex}`;
                        dynamicDependencies[depName] = createSumCheckFunction(targetIndex, sumStartIndex, sumEndIndex);
                        dynamicDependencies[depName].name = depName; // Przypisanie nazwy
                    }
                }
            }
        }
    
        return dynamicDependencies;
    }
    


    
    
                    function createSumCheckFunction(targetIndex, sumStartIndex, sumEndIndex) {
                        return function(strings) {
                            return strings.map(string => {
                                if (string.length <= targetIndex || string.length <= sumStartIndex || string.length <= sumEndIndex) return false;
                                let sum = 0;
                                for (let i = sumStartIndex; i <= sumEndIndex; i++) {
                                    if (i !== targetIndex) {
                                        sum += parseInt(string[i], 10);
                                    }
                                }
                                return parseInt(string[targetIndex], 10) === sum % 10;
                            });
                        };
                    }
    


// Dodaj inne wymagane funkcje i zależności, jeśli są potrzebne beww

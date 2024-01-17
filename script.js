document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.getElementById('testButton');
    const generateStringButton = document.getElementById('generateStringButton');
    initializeDependencies();
    testButton.addEventListener('click', runTest);
    generateStringButton.addEventListener('click', generateString);
});


let dynamicDependencies = {};

function initializeDependencies() {
    updateDynamicDependencies();
}


function updateDynamicDependencies() {
    removeDynamicDependencies();
    const currentStrings = document.getElementById('inputStrings').value.split(',');
    if (currentStrings.length > 0 && currentStrings[0] !== "") {
        const newDynamicDependencies = generateDynamicSumDependencies(currentStrings);

        Object.entries(newDynamicDependencies).forEach(([depName, func]) => {
            const result = func(currentStrings);
            if (result.every(res => res)) { // Dodaj do listy tylko te zależności, które są spełnione
                dynamicDependencies[depName] = func;
                addDependency(`Dynamiczna: ${depName}`, depName, true);
            }
        });
    }
}

function runTest() {
    const input = document.getElementById('inputStrings').value;
    const strings = input.split(',');
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ``;
    resultsDiv.innerHTML += `
    Testy dla stringów: ${strings} <br>
    `;
    updateDynamicDependencies();
    const newDynamicDependencies = generateDynamicSumDependencies(strings);
    Object.entries(newDynamicDependencies).forEach(([depName, func]) => {
        const result = func(strings);
        const resultText = result.every(res => res) ? 'Spełnia zależność' : 'Nie spełnia zależności';
        let calcDetails = '';

        // Przykładowa logika do wyświetlania obliczeń dla każdej zależności
        if (depName.startsWith('sumOfDigitsAt')) {
            const [sumStart, sumEnd, target] = depName.match(/\d+/g).map(Number);
            calcDetails = strings.map(string => {
                const sumDigits = string.substring(sumStart, sumEnd + 1).split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
                return ` (${string.substring(sumStart, sumEnd + 1).split('').join('+')}=${sumDigits % 10}, target: ${string[target]})`;
            }).join(' ');
        }

        resultsDiv.innerHTML += `Zależność: ${depName} - ${resultText}${calcDetails}<br>`;
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
    listItem.classList.add('dependency', 'dynamic-dependency');
    listItem.id = 'dep-' + funcName;
    listItem.innerHTML = `<input type="checkbox" id="check-${funcName}" ${isFulfilled ? 'checked' : ''}><label for="check-${funcName}">${name}</label>`;
    list.appendChild(listItem);
}


function generateString() {
    const startTime = performance.now();
    const selectedDependencies = getSelectedDependencies();
    const maxLength = Math.max(...(document.getElementById('inputStrings').value.split(',').map(s => s.length)));

    let generatedString = '';
    let attempts = 0;
    const maxAttempts = 50000000;

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
        console.log('Czas generowania: ' + (performance.now() - startTime) + 'ms');
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
    return Array.from({ length: length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}

    
    function testStringWithDependencies(string, dependencies) {
    return dependencies.every(dep => dep([string])[0]);
    }
    

    // Tutaj dodaj funkcję generateDynamicSumDependencies i inne funkcje pomocnicze
    function generateDynamicSumDependencies(strings) {
        let dynamicDependencies = {};
    
        for (let targetIndex = 0; targetIndex < strings[0].length; targetIndex++) {
            for (let sumIndex1 = 0; sumIndex1 < strings[0].length; sumIndex1++) {
                for (let sumIndex2 = sumIndex1 + 1; sumIndex2 < strings[0].length; sumIndex2++) {
                    if (targetIndex !== sumIndex1 && targetIndex !== sumIndex2) {
                        let depName = `sumOfDigitsAt${sumIndex1}and${sumIndex2}EqualsDigitAt${targetIndex}`;
                        dynamicDependencies[depName] = createSumCheckFunction(targetIndex, [sumIndex1, sumIndex2]);
                    }
                }
            }
        }
    
        return dynamicDependencies;
    }
    
    
    function createSumCheckFunction(targetIndex, sumIndexes) {
        return function(strings) {
            return strings.map(string => {
                if (string.length <= targetIndex || sumIndexes.some(index => index >= string.length)) return false;
                let sum = sumIndexes.reduce((acc, index) => acc + parseInt(string[index], 10), 0);
                return parseInt(string[targetIndex], 10) === (sum % 10);
            });
        };
    }
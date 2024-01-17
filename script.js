let dynamicDependencies = {}; // Globalna zmienna na zależności
let generateDynamicDependencies; // Deklaracja funkcji generateDynamicDependencies
const inputStrings = document.getElementById('inputStrings'); // Przeniesione do zadeklarowanych zmiennych

document.addEventListener('DOMContentLoaded', () => {
    // Import modułu dependencyManager.js jako skrypt
    const script = document.createElement('script');
    script.src = 'dependencyManager.js';
    script.onload = () => {
        // Po załadowaniu modułu, możesz korzystać z funkcji zależności
        initializeDependencies();

        // Reszta kodu po załadowaniu modułu
        const testButton = document.getElementById('testButton');
        const generateStringButton = document.getElementById('generateStringButton');
        const resultsDiv = document.getElementById('results');
        const outputStrings = document.getElementById('outputStrings');
        const functionCheckboxes = document.querySelectorAll('#functionSelection input[type="checkbox"]');
        functionCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateDynamicDependencies();
            });
        });

        initializeDependencies();
        testButton.addEventListener('click', runTest);
        generateStringButton.addEventListener('click', generateString);
    };
    document.head.appendChild(script);
});

// Reszta kodu





function initializeDependencies() {
    updateDynamicDependencies();
    const selectedFunctions = getSelectedFunctions();

    selectedFunctions.forEach(funcName => {
        if (window[funcName]) { // Użyj window[funcName] zamiast dependencyManager[funcName]
            dynamicDependencies = {
                ...dynamicDependencies,
                ...window[funcName](strings), // Użyj window[funcName]
            };
        }
    });

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

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ``;
    resultsDiv.innerHTML += `
    Testy dla stringów: ${strings} <br>
    `;
    updateDynamicDependencies();

    const selectedFunctions = getSelectedFunctions();
    const dynamicDependencies = generateDynamicDependencies(strings, selectedFunctions);

    Object.entries(dynamicDependencies).forEach(([depName, func]) => {
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

function getSelectedFunctions() {
    const functionCheckboxes = document.querySelectorAll('#functionSelection input[type="checkbox"]');
    const selectedFunctions = [];

    functionCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedFunctions.push(checkbox.value);
        }
    });

    return selectedFunctions;
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
    //updateDynamicDependencies();
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
}

// Dodaj inne wymagane funkcje i zależności, jeśli są potrzebne
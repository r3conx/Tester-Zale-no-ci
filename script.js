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

// Logika dla sumowania
if (depName.startsWith('sumOfDigitsAt')) {
    const [sumStart, sumEnd, target] = depName.match(/\d+/g).map(Number);
    calcDetails = strings.map(string => {
        let sumDigits = 0;
        let startIndex = Math.min(sumStart, sumEnd);
        let endIndex = Math.max(sumStart, sumEnd);
        for (let i = startIndex; i <= endIndex; i++) {
            sumDigits += parseInt(string[i], 10);
        }
        return ` (${string.substring(startIndex, endIndex + 1).split('').join('+')}=${sumDigits % 10}, target: ${string[target]})`;
    }).join(' ');
}

// Logika dla mnożenia
else if (depName.startsWith('productOfDigitsAt')) {
    const [prodStart, prodEnd, target] = depName.match(/\d+/g).map(Number);
    calcDetails = strings.map(string => {
        let productDigits = 1;
        let startIndex = Math.min(prodStart, prodEnd);
        let endIndex = Math.max(prodStart, prodEnd);
        for (let i = startIndex; i <= endIndex; i++) {
            productDigits *= parseInt(string[i], 10);
        }
        return ` (${string.substring(startIndex, endIndex + 1).split('').join('*')}=${productDigits % 10}, target: ${string[target]})`;
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
        outputStrings.innerHTML += `<h1>${generatedString}</h><br>`;
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
            for (let index1 = 0; index1 < strings[0].length; index1++) {
                for (let index2 = 0; index2 < strings[0].length; index2++) {
                    if (targetIndex !== index1 && targetIndex !== index2) {
                        if (index1 !== index2) {
                            // Zależności dla sumowania
                            let sumDepNameSpecific = `sumOfDigitsAt${index1}and${index2}EqualsDigitAt${targetIndex}`;
                            dynamicDependencies[sumDepNameSpecific] = createSumCheckFunction(targetIndex, [index1, index2], false);
    
                            let sumDepNameRange = `sumOfDigitsAt${index1}to${index2}EqualsDigitAt${targetIndex}`;
                            dynamicDependencies[sumDepNameRange] = createSumCheckFunction(targetIndex, index1, index2, true);
    
                            // Zależności dla mnożenia
                            let mulDepNameSpecific = `productOfDigitsAt${index1}and${index2}EqualsDigitAt${targetIndex}`;
                            dynamicDependencies[mulDepNameSpecific] = createProductCheckFunction(targetIndex, [index1, index2], false);
    
                            let mulDepNameRange = `productOfDigitsAt${index1}to${index2}EqualsDigitAt${targetIndex}`;
                            dynamicDependencies[mulDepNameRange] = createProductCheckFunction(targetIndex, index1, index2, true);
                        }
                    }
                }
            }
        }
    
        return dynamicDependencies;
    }
    
    
    
    
    function createSumCheckFunction(targetIndex, sumStartIndex, sumEndIndex, isRange) {
        return function(strings) {
            return strings.map(string => {
                if (string.length <= targetIndex || sumStartIndex >= string.length || sumEndIndex >= string.length) return false;
                let sum = 0;
                if (isRange) {
                    // Sumowanie w zakresie
                    for (let i = sumStartIndex; i <= sumEndIndex; i++) {
                        sum += parseInt(string[i], 10);
                    }
                } else {
                    // Sumowanie na konkretnych indeksach
                    sum = parseInt(string[sumStartIndex], 10) + parseInt(string[sumEndIndex], 10);
                }
                return parseInt(string[targetIndex], 10) === (sum % 10);
            });
        };
    }
    
    
    function createProductCheckFunction(targetIndex, sumStartIndex, sumEndIndex, isRange) {
        return function(strings) {
            return strings.map(string => {
                if (string.length <= targetIndex || sumStartIndex >= string.length || sumEndIndex >= string.length) return false;
                let product = 1; // Rozpoczynamy od 1, bo jest to element neutralny mnożenia
                if (isRange) {
                    for (let i = sumStartIndex; i <= sumEndIndex; i++) {
                        product *= parseInt(string[i], 10);
                    }
                } else {
                    product = parseInt(string[sumStartIndex], 10) * parseInt(string[sumEndIndex], 10);
                }
                return parseInt(string[targetIndex], 10) === (product % 10);
            });
        };
    }
    
    
    
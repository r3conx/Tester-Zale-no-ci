document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.getElementById('testButton');
    const generateStringButton = document.getElementById('generateStringButton');
    initializeDependencies();
    testButton.addEventListener('click', runTest);
    generateStringButton.addEventListener('click', generateString);
});

let results = [];
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
    results.length = 0;
    let zal = 0;
    //zapisz czas rozpoczęcia testu
    const startTime2 = performance.now();
    const input = document.getElementById('inputStrings').value;
    const strings = input.split(',');
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ``;
    resultsDiv.innerHTML += `

    `;
    updateDynamicDependencies();
    const newDynamicDependencies = generateDynamicSumDependencies(strings);

    Object.entries(newDynamicDependencies).forEach(([depName, func]) => {
        const result = func(strings);
        const resultText = result.every(res => res) ? '✅' : '❌';
        let calcDetails = '';



// Logika dla sumowania
if (depName.startsWith('sumOfDigitsAt')) {
    const indexes = depName.match(/\d+/g).map(Number);
    const target = indexes.pop(); // Ostatni element to target

    calcDetails = strings.map(string => {
        let sumDigits = 0;
        let sumParts = [];

        if (depName.includes('to')) {
            // Sumowanie w zakresie
            for (let i = indexes[0]; i <= indexes[1]; i++) {
                sumDigits += parseInt(string[i], 10);
                sumParts.push(string[i]);
            }
        } else {
            // Sumowanie konkretnych indeksów
            sumParts = indexes.map(index => {
                sumDigits += parseInt(string[index], 10);
                return string[index];
            });
        }

        return ` (${sumParts.join('+')}=${sumDigits % 10}, target: ${string[target]})`;
    }).join(' ');
}


// Logika dla mnożenia
else if (depName.startsWith('productOfDigitsAt')) {
    const [index1, index2, target] = depName.match(/\d+/g).map(Number);
    calcDetails = strings.map(string => {
        let productDigits = 1;
        if (depName.includes('and')) {
            // Dla konkretnych par cyfr (np. productOfDigitsAt0and2)
            productDigits = parseInt(string[index1], 10) * parseInt(string[index2], 10);
            return ` (${string[index1]}*${string[index2]}=${productDigits % 10}, target: ${string[target]})`;
        } else {
            // Dla zakresu cyfr (np. productOfDigitsAt0to2)
            for (let i = index1; i <= index2; i++) {
                productDigits *= parseInt(string[i], 10);
            }
            return ` (${string.substring(index1, index2 + 1).split('').join('*')}=${productDigits % 10}, target: ${string[target]})`;
        }
    }).join(' ');
}



results.push(`Zależność: ${depName} ${resultText}${calcDetails}<br>`);





    zal++;
    });
    //zapisz czas zakończenia testu
    const endTime2 = performance.now();

    //wyświetl wynik testu w div czas
    document.getElementById('czas').innerHTML = `
    Testy dla stringów: ${strings}<br>
    Czas testu: ${(endTime2 - startTime2).toFixed(1)}ms

    </br>
    Zależności: ${zal}<br>

    `;

    countDependencies();
    resultsDiv.innerHTML = results.join('');
}


//na podstawie tablicy results zlicz spełnione i niespełnione zależności
function countDependencies() {
    let fulfilled = 0;
    let notFulfilled = 0;
    results.forEach(result => {
        if (result.includes('✅')) {
            fulfilled++;
        } else {
            notFulfilled++;
        }
    });

    //wyświetl wynik testu w div zależności
    document.getElementById('czas').innerHTML += `
    ✅: ${fulfilled}<br>
    ❌: ${notFulfilled}<br>
    `;
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
        outputStrings.innerHTML = `<h1>${generatedString}</h1><br>`;
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

            // Przykład: Dodaj zależność sumy dla każdej pary indeksów
    for (let i = 0; i < strings[0].length - 1; i++) {
        for (let j = i + 1; j < strings[0].length; j++) {
            let sumCheckFunction = createSumCheckFunction(j, [i, j - 1]);
            addDependency(sumCheckFunction);
        }
    }
    
        for (let targetIndex = 0; targetIndex < strings[0].length; targetIndex++) {
            for (let index1 = 0; index1 < strings[0].length; index1++) {
                for (let index2 = index1 + 1; index2 < strings[0].length; index2++) {
                    if (targetIndex !== index1 && targetIndex !== index2) {
                        // Zależności dla sumowania
                        let sumDepName = `sumOfDigitsAt${index1}and${index2}EqualsDigitAt${targetIndex}`;
                        dynamicDependencies[sumDepName] = createSumCheckFunction(targetIndex, [index1, index2], false);
    
                        if (index2 - index1 > 1) {
                            let sumDepNameRange = `sumOfDigitsAt${index1}to${index2}EqualsDigitAt${targetIndex}`;
                            dynamicDependencies[sumDepNameRange] = createSumCheckFunction(targetIndex, [index1, index2], true);
                        }
    
                        // Sumowanie z przerwą
                        for (let skip = 1; skip < index2 - index1; skip++) {
                            let sumIndexes = [];
                            for (let i = index1; i <= index2; i++) {
                                if (i !== index1 + skip) {
                                    sumIndexes.push(i);
                                }
                            }
                            let sumDepNameSkip = `sumOfDigitsAt${sumIndexes.join('and')}EqualsDigitAt${targetIndex}`;
                            dynamicDependencies[sumDepNameSkip] = createSumCheckFunction(targetIndex, sumIndexes);
                        }
    
                        // Zależności dla mnożenia
                        let mulDepName = `productOfDigitsAt${index1}and${index2}EqualsDigitAt${targetIndex}`;
                        dynamicDependencies[mulDepName] = createProductCheckFunction(targetIndex, [index1, index2], false);
    
                        if (index2 - index1 > 1) {
                            let mulDepNameRange = `productOfDigitsAt${index1}to${index2}EqualsDigitAt${targetIndex}`;
                            dynamicDependencies[mulDepNameRange] = createProductCheckFunction(targetIndex, [index1, index2], true);
                        }

                        // Mnożenie z przerwą
                        for (let skip = 1; skip < index2 - index1; skip++) {
                            let mulIndexes = [];
                            for (let i = index1; i <= index2; i++) {
                                if (i !== index1 + skip) {
                                    mulIndexes.push(i);
                                }
                            }
                            let mulDepNameSkip = `productOfDigitsAt${mulIndexes.join('and')}EqualsDigitAt${targetIndex}`;
                            dynamicDependencies[mulDepNameSkip] = createProductCheckFunction(targetIndex, mulIndexes);
                        }






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

    
    
function createProductCheckFunction(targetIndex, mulIndexes, isRange) {
    return function(strings) {
        return strings.map(string => {
            if (string.length <= targetIndex || mulIndexes.some(index => index >= string.length)) return false;
            let product = 1;
            if (isRange) {
                for (let i = 0; i < mulIndexes.length; i++) {
                    product *= parseInt(string[mulIndexes[i]], 10);
                }
            } else {
                product = parseInt(string[mulIndexes[0]], 10) * parseInt(string[mulIndexes[1]], 10);
            }
            return parseInt(string[targetIndex], 10) === (product % 10);
        });
    };
}


function createPowerCheckFunction(baseIndex, exponent, targetIndex) {
    return function(strings) {
        return strings.map(string => {
            if (string.length <= Math.max(baseIndex, targetIndex)) return false;
            let base = parseInt(string[baseIndex], 10);
            let expectedValue = Math.pow(base, exponent);
            return parseInt(string[targetIndex], 10) === expectedValue % 10;
        });
    };
}



    
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
    
        for (let targetIndex = 0; targetIndex < strings[0].length; targetIndex++) {
            for (let index1 = 0; index1 < strings[0].length; index1++) {
                for (let index2 = index1 + 1; index2 < strings[0].length; index2++) {
                    if (targetIndex !== index1 && targetIndex !== index2) {
                        // Zależności dla sumowania
                        let sumDepName = `sumOfDigitsAt${index1}and${index2}EqualsDigitAt${targetIndex}`;
                        dynamicDependencies[sumDepName] = createSumCheckFunction(targetIndex, index1, index2, false);
    
                        if (index1 + 1 !== index2) {
                            let sumDepNameRange = `sumOfDigitsAt${index1}to${index2}EqualsDigitAt${targetIndex}`;
                            dynamicDependencies[sumDepNameRange] = createSumCheckFunction(targetIndex, index1, index2, true);
                        }
    
                        // Zależności dla mnożenia
                        let mulDepName = `productOfDigitsAt${index1}and${index2}EqualsDigitAt${targetIndex}`;
                        dynamicDependencies[mulDepName] = createProductCheckFunction(targetIndex, index1, index2, false);
    
                        if (index1 + 1 !== index2) {
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
    
    
    function createProductCheckFunction(targetIndex, sumIndexes, isRange) {
        return function(strings) {
            return strings.map(string => {
                if (string.length <= targetIndex) return false;
                let product = 1;
    
                if (Array.isArray(sumIndexes)) {
                    if (isRange && Math.abs(sumIndexes[0] - sumIndexes[1]) > 1) {
                        // Dla zakresu, jeśli różnica między indeksami jest większa niż 1
                        const startIndex = Math.min(sumIndexes[0], sumIndexes[1]);
                        const endIndex = Math.max(sumIndexes[0], sumIndexes[1]);
                        for (let i = startIndex; i <= endIndex; i++) {
                            if (i >= string.length) return false;
                            product *= parseInt(string[i], 10);
                        }
                    } else {
                        // Dla pojedynczych indeksów lub krótkich zakresów
                        for (const index of sumIndexes) {
                            if (index >= string.length) return false;
                            product *= parseInt(string[index], 10);
                        }
                    }
                } else {
                    // W przypadku braku tablicy sumIndexes, nie ma zależności
                    return false;
                }
    
                // Sprawdź, czy cyfra jedności wyniku iloczynu jest równa cyfrze docelowej na pozycji 0
                return parseInt(string[targetIndex], 10) === parseInt(product.toString()[0], 10);
            });
        };
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
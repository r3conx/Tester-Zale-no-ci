document.addEventListener('DOMContentLoaded', () => {
    initializeDependencies();
    document.getElementById('testButton').addEventListener('click', runTest);
    document.getElementById('generateStringButton').addEventListener('click', generateString);
});

let dynamicDependencies = {};

function initializeDependencies() {
    addDependency('Trzecia Cyfra Sumy Dwóch Pierwszych', 'thirdDigitIsSumOfFirstTwo');
    addDependency('Suma Wszystkich Cyfr', 'sumOfAllDigits');
    addDependency('Cyfra Jedności Iloczynu Pierwszych Dwóch Cyfr', 'unitDigitOfFirstTwoMultiplication');
    addDependency('Różnica Między Pierwszą a Ostatnią Cyfrą', 'differenceBetweenFirstAndLastDigit');
    updateDynamicDependencies();
}

function updateDynamicDependencies() {
    removeDynamicDependencies();
    const currentStrings = document.getElementById('inputStrings').value.split(',');
    const newDynamicDependencies = window.findSumDependencies(currentStrings);
    
    Object.entries(newDynamicDependencies).forEach(([depName, func]) => {
        dynamicDependencies[depName] = func;
        addDependency(`Dynamiczna Zależność ${depName}`, depName);
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

function addDependency(name, funcName) {
    const list = document.getElementById('dependenciesList');
    const listItem = document.createElement('div');
    listItem.classList.add('dependency');
    if (funcName.startsWith('dynamicDep')) {
        listItem.classList.add('dynamic-dependency');
    }
    listItem.id = 'dep-' + funcName;
    listItem.innerHTML = `<input type="checkbox" id="check-${funcName}" checked><label for="check-${funcName}">${name}</label>`;
    list.appendChild(listItem);
}

function getDynamicDependencies() {
    return Object.keys(dynamicDependencies)
                 .filter(key => document.getElementById(`check-${key}`).checked)
                 .map(key => dynamicDependencies[key])
                 .filter(func => typeof func === 'function');
}





function generateString() {
    updateDynamicDependencies();
    const inputStrings = document.getElementById('inputStrings').value.split(',');

    const selectedStaticDependencies = Array.from(document.querySelectorAll('.dependency:not(.dynamic-dependency) input:checked'))
                                             .map(dep => window[dep.id.replace('check-', '')])
                                             .filter(dep => typeof dep === 'function');

    const selectedDynamicDependencies = getDynamicDependencies();

    const allSelectedDependencies = selectedStaticDependencies.concat(selectedDynamicDependencies);

    if (allSelectedDependencies.length === 0) {
        alert('Wybierz przynajmniej jedną zależność.');
        return;
    }

    let generatedString = '';
    let isStringValid;
    let attempts = 0;
    const limit = 1000000;

    do {
        generatedString = generateRandomString(inputStrings[0].length);
        isStringValid = allSelectedDependencies.every(dependency => 
            dependency([generatedString])[0]
        );
        attempts++;
    } while (!isStringValid && attempts < limit);

    if (attempts === limit) {
        console.log("Nie udało się wygenerować ciągu po", limit, "próbach.");
        return;
    }

    document.getElementById('outputStrings').value = generatedString;
    console.log("Wygenerowany ciąg:", generatedString);
    console.log("Wygenerowano ciąg po", attempts, "próbach.");
}

function generateRandomString(length) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}



function runTest() {
    removeDynamicDependencies();
    const input = document.getElementById('inputStrings').value;
    const strings = input.split(',');
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const dependencies = [
        window.thirdDigitIsSumOfFirstTwo,
        window.sumOfAllDigits,
        window.unitDigitOfFirstTwoMultiplication,
        window.differenceBetweenFirstAndLastDigit
    ];

    updateDynamicDependencies();

    dependencies.forEach(dependency => {
        if (typeof dependency === 'function') {
            const result = dependency(strings);
            resultsDiv.innerHTML += `<p>Zależność: ${result}</p>`;
        }
    });
}





// Przykładowa funkcja zależności
window.thirdDigitIsSumOfFirstTwo = function(strings) {
    return strings.map(string => {
        if (string.length < 3) return false;
        const sum = parseInt(string[0]) + parseInt(string[1]);
        return parseInt(string[2]) === sum % 10;
    });
};


window.sumOfAllDigits = function(strings) {
    return strings.map(string => {
        return string.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    });
};


window.unitDigitOfFirstTwoMultiplication = function(strings) {
    return strings.map(string => {
        if (string.length < 2) return false;
        const product = parseInt(string[0], 10) * parseInt(string[1], 10);
        return product % 10;
    });
};


window.differenceBetweenFirstAndLastDigit = function(strings) {
    return strings.map(string => {
        if (string.length < 2) return false;
        const firstDigit = parseInt(string[0], 10);
        const lastDigit = parseInt(string[string.length - 1], 10);
        return Math.abs(firstDigit - lastDigit);
    });
};


window.findSumDependencies = function(strings) {
    console.log("Analizowane stringi:", strings);
    const length = strings[0].length;

    if (!strings.every(string => string.length === length)) {
        console.error('Błąd: Stringi mają różne długości');
        return {};
    }

    let stringDependencies = strings.map(string => {
        let deps = new Set();
        
        // Sprawdzanie sumy cyfr na określonych pozycjach
        for (let i = 0; i < length; i++) {
            for (let j = i + 1; j < length; j++) {
                let sum = (parseInt(string[i], 10) + parseInt(string[j], 10)) % 10;
                deps.add(`sum${i}${j}:${sum}`);
            }
        }

        // Sprawdzanie sumy od dwóch do pięciu cyfr porównanej z inną cyfrą
        for (let sumLength = 2; sumLength <= 5; sumLength++) {
            for (let start = 0; start <= length - sumLength - 1; start++) {
                for (let comparePos = start + sumLength; comparePos < length; comparePos++) {
                    let sum = 0;
                    for (let pos = start; pos < start + sumLength; pos++) {
                        sum += parseInt(string[pos], 10);
                    }
                    if (sum % 10 === parseInt(string[comparePos], 10)) {
                        deps.add(`multiSum${start}to${start + sumLength - 1}isUnit${comparePos}`);
                    }
                }
            }
        }

        return Array.from(deps);
    });

    let commonDeps = stringDependencies[0].filter(dep => 
        stringDependencies.every(deps => deps.includes(dep))
    );

    console.log("Wspólne zależności:", commonDeps);

    let dynamicDepFunctions = {};

    commonDeps.forEach((dep, index) => {
        if (dep.startsWith('multiSum')) {
            dynamicDepFunctions[`dynamicDep${index + 1}`] = createMultiSumFunc(dep);
        } else {
            let [funcName, result] = dep.split(':');
            result = parseInt(result, 10);

            let dynamicFunc = function(testStrings) {
                return testStrings.map(string => {
                    let [i, j] = funcName.substring(3).split('').map(Number);
                    let sum = (parseInt(string[i], 10) + parseInt(string[j], 10)) % 10;
                    return sum === result;
                });
            };

            dynamicDepFunctions[`dynamicDep${index + 1}`] = dynamicFunc;
        }
    });

    return dynamicDepFunctions;
};

function createMultiSumFunc(dep) {
    let parts = dep.match(/multiSum(\d+)to(\d+)isUnit(\d+)/).slice(1).map(Number);
    return function(testStrings) {
        return testStrings.map(string => {
            let sum = 0;
            for (let i = parts[0]; i <= parts[1]; i++) {
                sum += parseInt(string[i], 10);
            }
            return sum % 10 === parseInt(string[parts[2]], 10);
        });
    };
}




function sumDigits(string, start, end) {
    let sum = 0;
    for (let i = start; i <= end; i++) {
        sum += parseInt(string[i], 10);
    }
    return sum;
}

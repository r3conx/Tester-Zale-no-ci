document.addEventListener('DOMContentLoaded', () => {
    initializeDependencies();
    document.getElementById('testButton').addEventListener('click', runTest);
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
    let maxSatisfiedDependencies = 0;
    let attempts = 0;
    const limit = 10000000;
    const length = inputStrings[0].length;

    for (let i = 0; i < limit; i++) {
        let tempString = generateRandomString(length);
        let satisfiedCount = allSelectedDependencies.filter(dep => dep([tempString])[0]).length;
        attempts++;
        if (satisfiedCount > maxSatisfiedDependencies) {
            generatedString = tempString;
            maxSatisfiedDependencies = satisfiedCount;
            console.log("Nowy rekord:", generatedString, " -", maxSatisfiedDependencies, "zależności spełnionych.");
        }

        if (maxSatisfiedDependencies === allSelectedDependencies.length) {
            break;
        }
    }

    if (maxSatisfiedDependencies === 0) {
        console.log("Nie udało się wygenerować ciągu spełniającego jakiekolwiek zależności.");
        return;
    }

    document.getElementById('outputStrings').value = generatedString;
    console.log("Wygenerowany ciąg:", generatedString, " po", attempts, "próbach.");
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

        for (let i = 0; i < length; i++) {
            for (let j = i + 1; j < length; j++) {
                let sum = parseInt(string[i], 10) + parseInt(string[j], 10);

                // Nowa logika do obsługi większej liczby sum
                let remainingDigits = [];
                for (let k = 0; k < length; k++) {
                    if (k !== i && k !== j) {
                        remainingDigits.push(k);
                    }
                }

                function findCombinations(arr, n, sum, result) {
                    if (n === 0) {
                        if (sum % 10 === parseInt(string[arr[0]], 10)) {
                            deps.add(`sumOf${i}${j}...equals${arr[0]}`);
                        }
                        return;
                    }

                    for (let x = 0; x < remainingDigits.length; x++) {
                        let newSum = sum + parseInt(string[arr[x]], 10);
                        let newArr = arr.slice();
                        newArr.push(remainingDigits[x]);
                        findCombinations(newArr, n - 1, newSum, result);
                    }
                }

                for (let n = 2; n <= remainingDigits.length; n++) {
                    findCombinations([], n, sum, []);
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
        dynamicDepFunctions[`dynamicDep${index + 1}`] = createDynamicFunction(dep, length);
    });

    return dynamicDepFunctions;
};




function createDynamicFunction(dep, length) {
    let match = dep.match(/sumOf(\d+)(\d+)equals(\d+)/);
    if (match) {
        let firstIndex = parseInt(match[1], 10);
        let secondIndex = parseInt(match[2], 10);
        let targetIndex = parseInt(match[3], 10);

        return function(testStrings) {
            return testStrings.map(string => {
                let sum = parseInt(string[firstIndex], 10) + parseInt(string[secondIndex], 10);
                return sum % 10 === parseInt(string[targetIndex], 10);
            });
        };
    }
}

function sumDigits(string, start, end) {
    let sum = 0;
    for (let i = start; i <= end; i++) {
        sum += parseInt(string[i], 10);
    }
    return sum;
}

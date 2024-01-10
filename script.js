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

    // Pobierz zaznaczone stałe zależności
    const selectedStaticDependencies = Array.from(document.querySelectorAll('.dependency:not(.dynamic-dependency) input:checked'))
                                             .map(dep => window[dep.id.replace('check-', '')])
                                             .filter(dep => typeof dep === 'function');

    // Pobierz zaznaczone dynamiczne zależności
    const selectedDynamicDependencies = getDynamicDependencies();
    console.log("Wybrane dynamiczne zależności:", selectedDynamicDependencies);
    // Połącz stałe i dynamiczne zależności
    const allSelectedDependencies = selectedStaticDependencies.concat(selectedDynamicDependencies);

    if (allSelectedDependencies.length === 0) {
        alert('Wybierz przynajmniej jedną zależność.');
        return;
    }

    const dependencyResults = allSelectedDependencies.map(dependency => dependency(inputStrings));

    const commonDependencies = allSelectedDependencies.filter((_, index) => 
        dependencyResults[index].every(result => result === dependencyResults[index][0]));

    let generatedString = '';
    let isStringValid;
    let attempts = 0;
    const limit = 10000;

    do {
        generatedString = generateRandomString(inputStrings[0].length);
        isStringValid = commonDependencies.every(dependency => 
            dependency([generatedString])[0] === dependency(inputStrings)[0]);
        attempts++;
    } while (!isStringValid && attempts < limit);

    if (attempts === limit) {
        console.log("Nie udało się wygenerować ciągu po", limit, "próbach.");
        return;
    }

    document.getElementById('outputStrings').value = generatedString;
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
    let dependencies = [];
    const length = strings[0].length;

    if (!strings.every(string => string.length === length)) {
        console.error('Błąd: Stringi mają różne długości');
        return {};
    }

    let stringDependencies = strings.map(string => {
        let deps = [];
        for (let startPos = 0; startPos < length - 1; startPos++) {
            for (let endPos = startPos + 1; endPos < length; endPos++) {
                let sum = sumDigits(string, startPos, endPos) % 10;
                deps.push(`sum${startPos}${endPos}:${sum}`);
            }
        }
        console.log(`Zależności dla stringa ${string}:`, deps);
        return deps;
    });

    let commonDeps = stringDependencies[0].filter(dep => 
        stringDependencies.every(deps => deps.includes(dep))
    );

    console.log("Wspólne zależności:", commonDeps);

    let dynamicDepFunctions = {};

    commonDeps.forEach((dep, index) => {
        let [funcName, result] = dep.split(':');
        result = parseInt(result, 10);

        let dynamicFunc = function(testStrings) {
            return testStrings.map(string => {
                let [startPos, endPos] = funcName.substring(3).split('').map(Number);
                let sum = sumDigits(string, startPos, endPos) % 10;
                return sum === result;
            });
        };

        dynamicDepFunctions[`dynamicDep${index + 1}`] = dynamicFunc;
    });

    return dynamicDepFunctions;
};

function sumDigits(string, start, end) {
    let sum = 0;
    for (let i = start; i <= end; i++) {
        sum += parseInt(string[i], 10);
    }
    return sum;
}

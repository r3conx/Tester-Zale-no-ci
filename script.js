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

    // Dodaj nowe dynamiczne zależności do listy dynamicznych zależności
    selectedDynamicDependencies = getDynamicDependencies();
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
            console.log(dependency);
            console.log(dynamicDeps);

            console.log(dependency(strings));
            console.log(dependencies);
            console.log(dynamicDependencies);
            const result = dependency(strings);
            resultsDiv.innerHTML += `<p>Zależność: ${result}</p>`;
        }
    });
    wypiszZaleznosci(strings);
}



function generateRandomString(length) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
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


// Dodaj bibliotekę math.js do swojego projektu, jeśli jej jeszcze nie masz:
// 

window.findSumDependencies = function(strings) {
    console.log("Analizowane stringi:", strings);
    const length = strings[0].length;

    if (!strings.every(string => string.length === length)) {
        console.error('Błąd: Stringi mają różne długości');
        return {};
    }

    let dynamicDepFunctions = {};

    // Przetwarzanie nowych dynamicznych zależności
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if (i !== j) {
                const sum = parseInt(strings[0][i], 10) + parseInt(strings[0][j], 10);
                const sumString = `${i}${j}equals${j}`;
                dynamicDepFunctions[`dynamicDep${sumString}`] = createDynamicFunction(sumString, length, sum);
            }
        }
    }

    // Logi z osobnymi zależnościami dla każdego stringu
    for (let i = 0; i < strings.length; i++) {
        const dependencies = Object.keys(dynamicDepFunctions).filter(dep => dep.includes(`dynamicDep${i}`));
        console.log(`Zależności dla stringu ${i + 1}:`, dependencies);
    }

    // Logi z wspólnymi zależnościami
    const commonDependencies = Object.keys(dynamicDepFunctions).filter(dep => {
        return strings.every((string, index) => {
            if (index === 0) return true; // Pomijamy pierwszy string
            const dynamicFunctionName = `dynamicDep${index}`;
            return dynamicDepFunctions[dep] === dynamicDepFunctions[dynamicFunctionName];
        });
    });
    console.log("Wspólne zależności:", commonDependencies);

    return dynamicDepFunctions;
};



function solveEquations(equations) {
    const n = equations.length;
    const augmentedMatrix = new Array(n);

    for (let i = 0; i < n; i++) {
        augmentedMatrix[i] = equations[i].slice();
        augmentedMatrix[i].push(0);
    }

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const factor = augmentedMatrix[j][i] / augmentedMatrix[i][i];
            for (let k = i; k <= n; k++) {
                augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
            }
        }
    }

    const solutions = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += augmentedMatrix[i][j] * solutions[j][0];
        }
        solutions[i] = [(augmentedMatrix[i][n] - sum) / augmentedMatrix[i][i]];
    }

    return solutions;
}

function createDynamicFunction(dep, length, sum) {
    let match = dep.match(/(\d+)(\d+)equals(\d+)/);
    if (match) {
        let firstIndex = parseInt(match[1], 10);
        let secondIndex = parseInt(match[2], 10);
        let targetIndex = parseInt(match[3], 10);

        return function(testStrings) {
            return testStrings.map(string => {
                let calculatedSum = parseInt(string[firstIndex], 10) + parseInt(string[secondIndex], 10);
                return calculatedSum % 10 === parseInt(string[targetIndex], 10) && calculatedSum === sum;
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


function wypiszZaleznosci(strings) {
    const dependencies = window.findSumDependencies(strings);
    let resultsHtml = '';

    Object.entries(dependencies).forEach(([depName, depFunc]) => {
        const result = depFunc(strings);
        result.forEach((res, index) => {
            if (res) {
                resultsHtml += `<p>Zależność dla pozycji ${index + 1} (${strings[index]}): ${depName}</p>`;
            }
        });
    });

    document.getElementById('wyniki').innerHTML = resultsHtml;
}


//elassssssssss
console.log("elo"); //ahaaaasdasdefg
document.addEventListener('DOMContentLoaded', () => {
    initializeDependencies();
    document.getElementById('testButton').addEventListener('click', runTest);
    document.getElementById('generateStringButton').addEventListener('click', generateString);
});

let dynamicDependencies = {};

function initializeDependencies() {
    updateDynamicDependencies();
}

// Modyfikacja funkcji updateDynamicDependencies
function updateDynamicDependencies() {
    removeDynamicDependencies();
    const currentStrings = document.getElementById('inputStrings').value.split(',');
    const newDynamicDependencies = generateDynamicSumDependencies(currentStrings);
    
    Object.entries(newDynamicDependencies).forEach(([depName, func]) => {
        dynamicDependencies[depName] = func;
        addDependency(`Dynamiczna: ${depName}`, depName);
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
    const selectedDependencies = getSelectedDependencies();
    const maxLength = Math.max(...inputStrings.map(s => s.length));
    
    let generatedString = '';
    let attempts = 0;
    const maxAttempts = 10000;  // Możesz dostosować limit prób

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
            console.log(dependency(strings));
            console.log(dependencies);
            console.log(selectedDynamicDependencies);
            const result = dependency(strings);
            resultsDiv.innerHTML += `<p>Zależność: ${result}</p>`;
        }
    });

    selectedDynamicDependencies.forEach(dependency2 => {
        if (typeof dependency2 === 'function') {
            console.log(dependency2, "1");
            console.log("2",dependency2(strings));
            console.log(dependencies,"3");
            console.log(selectedDynamicDependencies,"4");
            const result = dependency2(strings);
            resultsDiv.innerHTML += `<p>Zależność: ${result}</p>`;
        }
    });

}


function updateDynamicDependencies() {
    removeDynamicDependencies();
    const currentStrings = document.getElementById('inputStrings').value.split(',');
    const newDynamicDependencies = window.findSumDependencies(currentStrings);
    
    Object.entries(newDynamicDependencies).forEach(([depName, func]) => {
        dynamicDependencies[depName] = func;
        addDependency(`Dynamiczna: ${depName}`, depName);
    });

    // Dodaj nowe dynamiczne zależności do listy dynamicznych zależności
    selectedDynamicDependencies = getDynamicDependencies();
}


function generateRandomString(length) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

window.findSumDependencies = function(strings) {
    console.log("Analizowane stringi:", strings);
    const length = strings[0].length;

    if (!strings.every(string => string.length === length)) {
        console.error('Błąd: Stringi mają różne długości');
        return {};
    }

    let dynamicDepFunctions = {};

    // Przetwarzanie nowych dynamicznych zależności

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


window.generateDynamicSumDependencies = function(strings) {
    let dynamicDependencies = {};

    strings.forEach(string => {
        for (let i = 0; i < string.length; i++) {
            for (let j = 0; j < string.length; j++) {
                if (i !== j) {
                    let dependencyName = `sumOfDigitsAt${j}EqualsDigitAt${i}`;
                    dynamicDependencies[dependencyName] = createSumCheckFunction(i, j);
                }
            }
        }
    });

    return dynamicDependencies;
};

function createSumCheckFunction(targetIndex, sumStartIndex) {
    return function(strings) {
        return strings.map(string => {
            if (string.length <= targetIndex || string.length <= sumStartIndex) return false;
            let sum = 0;
            for (let k = sumStartIndex; k < string.length; k++) {
                if (k !== targetIndex) {
                    sum += parseInt(string[k], 10);
                }
            }
            return parseInt(string[targetIndex], 10) === sum % 10;
        });
    };
}



//elassssssssss
console.log("elo"); //ver
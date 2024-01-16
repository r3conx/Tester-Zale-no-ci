document.addEventListener('DOMContentLoaded', () => {
    initializeDependencies();
    document.getElementById('testButton').addEventListener('click', runTest);
});

let dynamicDependencies = {};

function initializeDependencies() {
    addDependency('Dynamiczna', 'generateDynamicSumDependencies');
    addDependency('Suma Wszystkich Cyfr', 'sumOfAllDigits');
    addDependency('Cyfra Jedności Iloczynu Pierwszych Dwóch Cyfr', 'unitDigitOfFirstTwoMultiplication');
    addDependency('Różnica Między Pierwszą a Ostatnią Cyfrą', 'differenceBetweenFirstAndLastDigit');
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
    const limit = 100000;
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
console.log("elo"); //ahaaaasdasdefg
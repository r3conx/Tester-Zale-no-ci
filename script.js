document.addEventListener('DOMContentLoaded', () => {
    initializeDependencies();
    document.getElementById('testButton').addEventListener('click', runTest);
    document.getElementById('generateStringButton').addEventListener('click', generateString);
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
            dynamicDependencies[depName] = func;
            addDependency(`Dynamiczna: ${depName}`, depName);
        });
    }
}


function runTest() {
    updateDynamicDependencies();
    const input = document.getElementById('inputStrings').value;
    const strings = input.split(',');
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const selectedDependencies = getSelectedDependencies();

    selectedDependencies.forEach(dependency => {
        if (typeof dependency === 'function') {
            var a = dependency(strings);
            console.log(a);
            const result = dependency(strings);
            if (result.every(res => res)) {
                const resultText = 'Spełnia zależność';
                
                resultsDiv.innerHTML += `<p>Zależność ${i}: ${resultText}</p>`;
            }
        }
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

function generateString() {
    //updateDynamicDependencies();
    const selectedDependencies = getSelectedDependencies();
    const maxLength = Math.max(...(document.getElementById('inputStrings').value.split(',').map(s => s.length)));

    let generatedString = '';
    let attempts = 0;
    const maxAttempts = 10000;

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
    
    // Tutaj dodaj funkcję generateDynamicSumDependencies i inne funkcje pomocnicze
    function generateDynamicSumDependencies(strings) {
    let dynamicDependencies = {};
    strings.forEach(string => {
        for (let i = 0; i < string.length; i++) {
            for (let j = 0; j < string.length; j++) {
                if (i !== j) {
                    let dependencyName = `suma ${j}=${i}`;
                    dynamicDependencies[dependencyName] = createSumCheckFunction(i, j);
                }
            }
        }
    });
    
    return dynamicDependencies;
}

function createSumCheckFunction(targetIndex, sumStartIndex) {
return function(strings) {
return strings.map(string => {
if (string.length <= targetIndex || string.length <= sumStartIndex) return false;
let sum = 0;
for (let k = sumStartIndex; k < string.length; k++) {
if (k !== targetIndex) {
sum += parseInt(string[k], 10);
console.log(sum,"sum");
console.log(string[k],"string[k]");
console.log(parseInt(string[k], 10),"parseInt(string[k], 10)");
}
}
console.log(parseInt(string[targetIndex], 10),"parseInt(string[targetIndex], 10)");
console.log(sum % 10,"sum % 10");
console.log(parseInt(string[targetIndex], 10) === sum % 10,"parseInt(string[targetIndex], 10) === sum % 10");
return parseInt(string[targetIndex], 10) === sum % 10;

});
};
}

// Dodaj inne wymagane funkcje i zależności, jeśli są potrzebne

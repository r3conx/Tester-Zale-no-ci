document.addEventListener('DOMContentLoaded', () => {
    initializeDependencies();
    document.getElementById('testButton').addEventListener('click', runTest);
    document.getElementById('generateStringButton').addEventListener('click', generateString);
});

let dynamicDependencies = {};

function initializeDependencies() {
    addDependency('Suma Pierwszych Dwóch Cyfr', 'sumOfFirstTwoDigits');
    addDependency('Suma Wszystkich Cyfr', 'sumOfAllDigits');
    // Dodaj więcej zależności tutaj
    updateDynamicDependencies();
}

function updateDynamicDependencies() {
    removeDynamicDependencies();
    const currentStrings = document.getElementById('inputStrings').value.split(',');
    const newDynamicDependencies = findSumDependencies(currentStrings);
    
    Object.entries(newDynamicDependencies).forEach(([depName, func]) => {
        dynamicDependencies[depName] = func;
        addDependency(`Dynamiczna: ${depName}`, depName);
    });

    selectedDynamicDependencies = getDynamicDependencies();
}

function addDependency(name, funcName) {
    const list = document.getElementById('dependenciesList');
    const listItem = document.createElement('div');
    listItem.classList.add('dependency');
    listItem.id = 'dep-' + funcName;
    listItem.innerHTML = '<input type="checkbox" id="check-${funcName}" checked> <label for="check-${funcName}">${name}</label>';
    list.appendChild(listItem);
    }
    
    function getDynamicDependencies() {
        return Object.keys(dynamicDependencies)
            .filter(key => document.getElementById('check-' + key).checked)
            .map(key => dynamicDependencies[key])
            .filter(func => typeof func === 'function');
    }
    
    function generateString() {
    updateDynamicDependencies();
    const inputStrings = document.getElementById('inputStrings').value.split(',');
    const selectedStaticDependencies = Array.from(document.querySelectorAll('.dependency:not(.dynamic-dependency) input:checked'))
    .map(dep => window[dep.id.replace('check-', '')])
    .filter(dep => typeof dep === 'function');

const allSelectedDependencies = selectedStaticDependencies.concat(selectedDynamicDependencies);

if (allSelectedDependencies.length === 0) {
    alert('Wybierz przynajmniej jedną zależność.');
    return;
}

// Implementacja generacji stringów
// Tu należy dodać logikę generowania stringów spełniających wybrane zależności
}

function runTest() {
removeDynamicDependencies();
const input = document.getElementById('inputStrings').value;
const strings = input.split(',');
const resultsDiv = document.getElementById('results');
resultsDiv.innerHTML = '';
const dependencies = [
    window.sumOfFirstTwoDigits,
    window.sumOfAllDigits,
    // Dodaj więcej zależności tutaj
];

updateDynamicDependencies();

dependencies.forEach(dependency => {
    if (typeof dependency === 'function') {
        const result = dependency(strings);
        resultsDiv.innerHTML += `<p>Zależność: ${result}</p>`;
    }
});

selectedDynamicDependencies.forEach(dependency2 => {
    if (typeof dependency2 === 'function') {
        const result = dependency2(strings);
        resultsDiv.innerHTML += `<p>Zależność: ${result}</p>`;
    }
});
}

function removeDynamicDependencies() {
    const dynamicDeps = document.querySelectorAll('.dynamic-dependency');

    dynamicDeps.forEach(dep => {
        const depName = dep.id.replace('dep-', '');
        delete window[depName]; // Usuń funkcję, jeśli została przypisana do obiektu window
        delete dynamicDependencies[depName]; // Usuń z obiektu dynamicDependencies
        dep.remove(); // Usuń element z DOM
    });
}

    
    function findSumDependencies(strings) {
    // Tutaj logika do znajdowania dynamicznych zależności
    // Na przykład: sprawdzenie sumy cyfr, porównanie cyfr itp.
    let dynamicDepFunctions = {};

    // Przykład dodania dynamicznej zależności
for (let i = 0; i < strings[0].length; i++) {
    dynamicDepFunctions[`sumOfDigitsAt${i}`] = createDynamicFunctionForSumAtPosition(strings, i);
}
return dynamicDepFunctions;

}

function createDynamicFunctionForSumAtPosition(strings, position) {
return function(testStrings) {
return testStrings.map(string => {
if (string.length <= position) return false;
// Implementacja konkretnej logiki zależności
const sum = parseInt(string[position], 10); // Przykładowa logika
return strings.every(s => parseInt(s[position], 10) === sum);
});
};
}

// Tutaj możesz dodać więcej funkcji do obsługi specyficznych zależności
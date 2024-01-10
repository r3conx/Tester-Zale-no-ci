document.addEventListener('DOMContentLoaded', () => {
    initializeDependencies();
    document.getElementById('testButton').addEventListener('click', runTest);
    document.getElementById('generateStringButton').addEventListener('click', generateString);
});

function initializeDependencies() {
    addDependency('Trzecia Cyfra Sumy Dwóch Pierwszych', 'thirdDigitIsSumOfFirstTwo');
    addDependency('Suma Wszystkich Cyfr', 'sumOfAllDigits');
    addDependency('Cyfra Jedności Iloczynu Pierwszych Dwóch Cyfr', 'unitDigitOfFirstTwoMultiplication');
    addDependency('Różnica Między Pierwszą a Ostatnią Cyfrą', 'differenceBetweenFirstAndLastDigit');

    // Dodaj obsługę dynamicznych zależności
    updateDynamicDependencies();
}

let dynamicDependencies = {};

function updateDynamicDependencies() {
    // Usuń istniejące dynamiczne zależności
    removeDynamicDependencies();

    // Dodaj nowe dynamiczne zależności na podstawie aktualnych stringów
    const currentStrings = document.getElementById('inputStrings').value.split(',');
    const newDynamicDependencies = window.findSumDependencies(currentStrings);
    newDynamicDependencies.forEach((func, index) => {
        const depName = `dynamicDep${index}`;
        addDependency(`Dynamiczna Zależność ${index + 1}`, depName);
        window[depName] = func;
    });
}



function removeDynamicDependencies() {
    const dynamicDeps = document.querySelectorAll('.dynamic-dependency');
    dynamicDeps.forEach(dep => {
        const depName = dep.id.replace('dep-', '');
        delete window[depName];
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
    listItem.innerHTML = `
        <input type="checkbox" id="check-${funcName}" checked>
        <label for="check-${funcName}">${name}</label>
    `;
    list.appendChild(listItem);
}




//GENERATOR
function getDynamicDependencies() {
    return Object.values(dynamicDependencies).filter(func => typeof func === 'function');
}


function generateString() {
    updateDynamicDependencies();
    const inputStrings = document.getElementById('inputStrings').value.split(',');

    // Pobierz zaznaczone stałe zależności
    const selectedStaticDependencies = Array.from(document.querySelectorAll('.dependency input:checked'))
                                             .map(dep => window[dep.id.replace('check-', '')])
                                             .filter(dep => typeof dep === 'function');

    // Pobierz zaznaczone dynamiczne zależności
    const selectedDynamicDependencies = getDynamicDependencies();

    // Połącz stałe i dynamiczne zależności
    const allSelectedDependencies = selectedStaticDependencies.concat(selectedDynamicDependencies);

    if (allSelectedDependencies.length === 0) {
        alert('Wybierz przynajmniej jedną zależność.');
        return;
    }

    // Analiza wyników zależności dla podanych stringów
    const dependencyResults = selectedDependencies.map(dependency => 
        dependency(inputStrings)
    );

    // Filtracja zależności, które mają wspólne wyniki dla wszystkich stringów
    const commonDependencies = selectedDependencies.filter((_, index) => 
        dependencyResults[index].every(result => result === dependencyResults[index][0])
    );

    let generatedString = '';
    let isStringValid;
    let attempts = 0;
    let limit = 10000;

    do {
        generatedString = generateRandomString(inputStrings[0].length);
        isStringValid = commonDependencies.every(dependency => 
            dependency([generatedString])[0] === dependency(inputStrings)[0]
        );
    } while (!isStringValid && attempts < limit);

    if (attempts === limit) {
        console.log("Nie udało się wygenerować ciągu po ", limit, " próbach.");
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

//GENERATOR



function runTest() {
    removeDynamicDependencies();
    const input = document.getElementById('inputStrings').value;
    const strings = input.split(',');
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Wyczyszczenie poprzednich wyników

    // Dodanie standardowych zależności
    const dependencies = [
        window.thirdDigitIsSumOfFirstTwo,
        window.sumOfAllDigits,
        window.unitDigitOfFirstTwoMultiplication,
        window.differenceBetweenFirstAndLastDigit
    ];

    // Dodaj dynamiczne zależności na podstawie aktualnych stringów
    const currentStrings = document.getElementById('inputStrings').value.split(',');
    const dynamicDependencies = window.findSumDependencies(currentStrings);
    dynamicDependencies.forEach((func, index) => {
        addDependency(`Dynamiczna Zależność ${index + 1}`, `dynamicDep${index}`);
        window[`dynamicDep${index}`] = func;
    });

    // Iteracja po wszystkich zależnościach
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
        return ['Błąd: Stringi mają różne długości'];
    }

    let stringDependencies = strings.map(string => {
        let deps = [];
        for (let startPos = 0; startPos < length - 1; startPos++) {
            for (let endPos = startPos + 1; endPos < length; endPos++) {
                let sum = sumDigits(string, startPos, endPos) % 10;
                deps.push(`${startPos}-${endPos}:${sum}`);
            }
        }
        console.log(`Zależności dla stringa ${string}:`, deps);
        return deps;
    });

    let commonDeps = stringDependencies[0].filter(dep => 
        stringDependencies.every(deps => deps.includes(dep))
    );

    console.log("Wspólne zależności:", commonDeps);
    return commonDeps.length > 0 ? commonDeps : ['Brak wspólnych zależności sum'];
};

function sumDigits(string, start, end) {
    let sum = 0;
    for (let i = start; i <= end; i++) {
        sum += parseInt(string[i], 10);
    }
    return sum;
}

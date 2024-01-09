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

    // Przykładowe stringi do inicjalizacji dynamicznych zależności
    const exampleStrings = ["1234", "1235"];
    const dynamicDependencies = window.findSumDependencies(exampleStrings);
    dynamicDependencies.forEach((func, index) => {
        addDependency(`Dynamiczna Zależność ${index + 1}`, `dynamicDep${index}`);
        window[`dynamicDep${index}`] = func;
    });
}



function addDependency(name, funcName) {
    const list = document.getElementById('dependenciesList');
    const listItem = document.createElement('div');
    listItem.classList.add('dependency');
    listItem.id = 'dep-' + funcName; // Użyto funcName jako ID
    listItem.innerHTML = `
        <input type="checkbox" id="check-${funcName}" checked>
        <label for="check-${funcName}">${name}</label>
    `;
    list.appendChild(listItem);
}


//GENERATOR


function generateString() {
    const inputStrings = document.getElementById('inputStrings').value.split(',');
    console.log(inputStrings[0].length);
    const selectedDependencies = Array.from(document.querySelectorAll('.dependency input:checked'))
                                      .map(dep => window[dep.id.replace('check-', '')]);

    if (selectedDependencies.length === 0) {
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

    document.getElementById('inputStrings').value += "," + generatedString;

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

    // Dodanie dynamicznych zależności
    const dynamicDependencies = window.findSumDependencies(strings);
    dynamicDependencies.forEach(func => {
        dependencies.push(func);
    });

    // Iteracja po wszystkich zależnościach
    dependencies.forEach(dependency => {
        const result = dependency(strings);
        resultsDiv.innerHTML += `<p>Zależność: ${result}</p>`;
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

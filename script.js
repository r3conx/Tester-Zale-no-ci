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
    const selectedDependencies = Array.from(document.querySelectorAll('.dependency input:checked'))
                                      .map(dep => window[dep.id.replace('check-', '')]);

    if (selectedDependencies.length === 0) {
        alert('Wybierz przynajmniej jedną zależność.');
        return;
    }

    let generatedString = '';
    let isStringValid;

    do {
		console.log(generatedString);
        generatedString = generateRandomString(5); // Generuje losowy ciąg 5 znaków
        isStringValid = selectedDependencies.every(dependency => dependency([generatedString])[0]);
    } while (!isStringValid);

    document.getElementById('inputStrings').value = generatedString;
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

    // Iteracja po wszystkich zaznaczonych zależnościach
    document.querySelectorAll('.dependency input:checked').forEach(dep => {
        const depName = dep.id.replace('check-', '');
        if(typeof window[depName] === "function") { // Sprawdzenie, czy funkcja istnieje
            const result = window[depName](strings);
            resultsDiv.innerHTML += `<p>Zależność ${depName}: ${result}</p>`;
        } else {
            console.error("Function not found:", depName); // Błąd, jeśli funkcja nie została znaleziona
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




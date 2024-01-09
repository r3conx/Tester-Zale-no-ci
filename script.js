document.addEventListener('DOMContentLoaded', () => {
    initializeDependencies();
    document.getElementById('testButton').addEventListener('click', runTest);
    document.getElementById('generateStringButton').addEventListener('click', generateString);
});

function initializeDependencies() {
    addDependency('Trzecia Cyfra Sumy Dwóch Pierwszych', 'thirdDigitIsSumOfFirstTwo');
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

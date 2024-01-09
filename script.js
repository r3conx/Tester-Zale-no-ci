// script.js
document.addEventListener('DOMContentLoaded', () => {
    initializeDependencies();
    document.getElementById('testButton').addEventListener('click', runTest);
    document.getElementById('generateStringButton').addEventListener('click', generateString);
});

function initializeDependencies() {
    addDependency('Trzecia Cyfra Sumy Dwóch Pierwszych', thirdDigitIsSumOfFirstTwo);
    enableDragAndDrop(); // Włączenie funkcji przeciągania i upuszczania
}

// Przykładowa zależność
function thirdDigitIsSumOfFirstTwo(strings) {
    return strings.map(string => {
        if (string.length < 3) return false;
        const sum = parseInt(string[0]) + parseInt(string[1]);
        return parseInt(string[2]) === sum % 10;
    });
}


function addDependency(name, func) {
    const list = document.getElementById('dependenciesList');
    const listItem = document.createElement('div');
    listItem.classList.add('dependency');
    listItem.id = 'dep-' + name; // Unikalne ID dla każdej zależności
    listItem.innerHTML = `
        <input type="checkbox" id="check-${name}" checked>
        <label for="check-${name}">${name}</label>
    `;
    listItem.querySelector('input').addEventListener('change', () => {
        if (document.getElementById('check-' + name).checked) {
            // Aktywacja zależności
        } else {
            // Dezaktywacja zależności
        }
    });
    list.appendChild(listItem);
}


function runTest() {
    const input = document.getElementById('inputStrings').value;
    const strings = input.split(',');
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Czyszczenie poprzednich wyników

    // Iteracja po wszystkich zależnościach
    document.querySelectorAll('.dependency input:checked').forEach(dep => {
        const depName = dep.id.replace('check-', '');
        // Wywołanie funkcji zależności
        const result = window[depName](strings);
        resultsDiv.innerHTML += `<p>Zależność ${depName}: ${result}</p>`;
    });
}


function generateString() {
    // Funkcja do generowania stringów na podstawie wybranych zależności
}

// Przykładowe funkcje zależności
function dependencyFunction(strings) {
    // Implementacja logiki zależności
}

function enableDragAndDrop() {
    const listItems = document.querySelectorAll('.dependency');
    listItems.forEach(item => {
        item.setAttribute('draggable', true);
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text', e.target.id);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    const droppedElement = document.getElementById(data);
    const dropZone = e.target;
    dropZone.parentNode.insertBefore(droppedElement, dropZone.nextSibling);
}

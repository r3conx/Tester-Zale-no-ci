// dependencyManager.js
function registerDependencyFunction(name, func) {
    dependencyFunctions[name] = func;
}
function generateDynamicDependencies(strings) {
    let dynamicDependencies = {};

    for (let targetIndex = 0; targetIndex < strings[0].length; targetIndex++) {
        for (let sumIndex1 = 0; sumIndex1 < strings[0].length; sumIndex1++) {
            for (let sumIndex2 = sumIndex1 + 1; sumIndex2 < strings[0].length; sumIndex2++) {
                if (targetIndex !== sumIndex1 && targetIndex !== sumIndex2) {
                    let depName = `sumOfDigitsAt${sumIndex1}and${sumIndex2}EqualsDigitAt${targetIndex}`;
                    dynamicDependencies[depName] = createSumCheckFunction(targetIndex, [sumIndex1, sumIndex2]);
                }
            }
        }
    }

    return dynamicDependencies;
}

function generateDynamicDifferenceDependencies(strings) {
    let dynamicDependencies = {};

    for (let targetIndex = 0; targetIndex < strings[0].length; targetIndex++) {
        for (let diffIndex1 = 0; diffIndex1 < strings[0].length; diffIndex1++) {
            for (let diffIndex2 = diffIndex1 + 1; diffIndex2 < strings[0].length; diffIndex2++) {
                if (targetIndex !== diffIndex1 && targetIndex !== diffIndex2) {
                    let depName = `differenceOfDigitsAt${diffIndex1}and${diffIndex2}EqualsDigitAt${targetIndex}`;
                    dynamicDependencies[depName] = createDifferenceCheckFunction(targetIndex, [diffIndex1, diffIndex2]);
                }
            }
        }
    }

    return dynamicDependencies;
}

function createSumCheckFunction(targetIndex, sumIndexes) {
    return function(strings) {
        return strings.map(string => {
            if (string.length <= targetIndex || sumIndexes.some(index => index >= string.length)) return false;
            let sum = sumIndexes.reduce((acc, index) => acc + parseInt(string[index], 10), 0);
            return parseInt(string[targetIndex], 10) === (sum % 10);
        });
    };
}

function createDifferenceCheckFunction(targetIndex, diffIndexes) {
    return function(strings) {
        return strings.map(string => {
            if (string.length <= targetIndex || diffIndexes.some(index => index >= string.length)) return false;
            let diff = diffIndexes.reduce((acc, index) => acc - parseInt(string[index], 10), 0);
            return parseInt(string[targetIndex], 10) === (diff % 10);
        });
    };
}

// Przypisz funkcje do globalnych zmiennych
window.generateDynamicDependencies = generateDynamicSumDependencies;
window.generateDynamicDifferenceDependencies = generateDynamicDifferenceDependencies;
const objectsEqualWithBuffer = (actual, expected, buffer, path = '') => {
    const differences = [];
  
    const compareArrays = (actualArray, expectedArray, path) => {
        actualArray.forEach((item, index) => {
            const currentPath = `${path}[${index}]`;
  
            if (Array.isArray(expectedArray[index])) {
                compareArrays(item, expectedArray[index], currentPath);
            } else if (typeof expectedArray[index] === 'object' && expectedArray[index] !== null) {
                differences.push(
                    ...objectsEqualWithBuffer(item, expectedArray[index], buffer, currentPath)
                );
            } else {
                const diff = Math.abs(item - expectedArray[index]);

                if (diff > buffer) {
                    differences.push(`${currentPath}: Actual: ${item}, Expected: ${expectedArray[index]}, Difference: ${diff}`);
                }
            }
      });
    }
  
    for (const key in expected) {
        const currentPath = path ? `${path}.${key}` : key;
  
        if (Array.isArray(expected[key])) {
            compareArrays(actual[key], expected[key], currentPath);
        } else if (typeof expected[key] === 'object' && expected[key] !== null) {
            differences.push(
                ...objectsEqualWithBuffer(actual[key], expected[key], buffer, currentPath)
            );
        } else {
            const diff = Math.abs(actual[key] - expected[key]);

            if (diff > buffer) {
                differences.push(`${currentPath}: Actual: ${actual[key]}, Expected: ${expected[key]}, Difference: ${diff}`);
            }
        }
    }
  
    return differences;
};

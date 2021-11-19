function validateCollectionName(name: string, minLength: number, maxLength: number): boolean {
    const regexString = `^([a-z][a-z0-9-_]{${minLength - 1},${maxLength - 1}})$`;
    const collectionNameRegex = new RegExp(regexString, 'g');

    return collectionNameRegex.test(name);
}

// TODO: Add tests and verify regex
function validatePath(path: string): boolean {
    return /^(?:[a-z]:)?[/\\]{0,2}(?:[./\\ ](?![./\\\n])|[^<>:"|?*./\\ \n])+$/i.test(path);
}

export const validators = {
    validateCollectionName,
    validatePath
}
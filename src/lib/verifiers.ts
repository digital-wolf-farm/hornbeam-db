// TODO: Added detailed info about failing reason instead of only boolean
function isFileContentValid(parsedContent: any): boolean {

    if (!isObject(parsedContent)) {
        return false;
    }

    for (let property in parsedContent) {
        if (parsedContent.hasOwnProperty(property)) {
            if (!Array.isArray(parsedContent[property])) {
                return false;
            }

            for (let entry of parsedContent[property]) {
                if (!isObject(entry)) {
                    return false;
                }
            }
        }
    }

    return true;
}

function isObject(data: any): boolean {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return false;
    }

    return true;
}

export const verifiers = {
    isFileContentValid
};

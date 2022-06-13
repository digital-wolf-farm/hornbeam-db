const isArray = (value: unknown): boolean => {
    return Array.isArray(value);
};

const isNumber = (value: unknown): boolean => {
    return typeof value === 'number';
};

const isObject = (value: unknown): boolean => {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
};

const isPositiveInteger = (value: unknown): boolean => {
    return (Number.isInteger(value) && value > 0);
};

const isString = (value: unknown): boolean => {
    return typeof value === 'string';
};

export const basicTypesValidators = {
    isArray,
    isNumber,
    isObject,
    isPositiveInteger,
    isString
};

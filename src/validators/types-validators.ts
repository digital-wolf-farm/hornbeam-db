const isArray = (value: unknown): boolean => {
    return Array.isArray(value);
};

const isBoolean = (value: unknown): boolean => {
    return typeof value === 'boolean';
}

const isNumber = (value: unknown): boolean => {
    return typeof value === 'number';
};

const isObject = (value: unknown): boolean => {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
};

const isPositiveInteger = (value: unknown): boolean => {
    return (Number.isInteger(value) && value > 0);
};

const isPrimitive = (value: unknown): boolean => {
    return value !== Object(value);
};

const isString = (value: unknown): boolean => {
    return typeof value === 'string';
};

export const typesValidators = {
    isArray,
    isBoolean,
    isNumber,
    isObject,
    isPositiveInteger,
    isPrimitive,
    isString
};

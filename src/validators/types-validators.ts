const isObject = (value: unknown): boolean => {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
};

const isPositiveInteger = (value: unknown): boolean => {
    return (Number.isInteger(value) && (value as number) > 0);
};

const isNonNegativeInteger = (value: unknown): boolean => {
    return (Number.isInteger(value) && (value as number) >= 0);
};

const isPrimitive = (value: unknown): boolean => {
    return value !== Object(value);
};

export const typesValidators = {
    isObject,
    isPositiveInteger,
    isNonNegativeInteger,
    isPrimitive
};

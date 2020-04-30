export const arrayEqual = (array1: unknown[], array2: unknown[]): boolean => {
    return (
        array1.length === array2.length &&
        array1.every(function (value, index) {
            return value === array2[index];
        })
    );
};

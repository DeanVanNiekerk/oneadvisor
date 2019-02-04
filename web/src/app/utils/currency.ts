export const formatCurrency = (value: number): string => {
    return typeof value !== 'number'
        ? ''
        : `R ${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

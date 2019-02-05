export const formatCurrency = (value: number, decimals: number = 0): string => {
    return typeof value !== 'number'
        ? ''
        : `R ${value.toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

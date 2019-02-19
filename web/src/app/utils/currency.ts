export const formatCurrency = (
    value: number | string | undefined,
    decimals: number = 2
): string => {
    if (value === undefined || value === '' || value === null) return '';

    return `R ${parseFloat(value.toString())
        .toFixed(decimals)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

export const parseCurrency = (value: string): number => {
    return parseFloat(value.replace(/\R\s?|(,*)/g, ''));
};

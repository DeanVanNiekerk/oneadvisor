import currency from "currency.js";

export const formatCurrency = (value: number | string | undefined, decimals: number = 2): string => {
    if (value === undefined || value === "" || value === null) return "";

    return currency(value, {
        symbol: "R ",
        formatWithSymbol: true,
        precision: decimals,
    }).format();
};

export const parseCurrency = (value: string): number => {
    return currency(value).value;
};

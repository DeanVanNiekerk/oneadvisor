export const splitCamelCase = (text: string) => {
    text = text.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
    return text.charAt(0).toUpperCase() + text.slice(1);
};

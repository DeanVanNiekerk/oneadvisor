export const splitCamelCase = (text: string) => {
    text = text.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
    return text.charAt(0).toUpperCase() + text.slice(1);
};

type Properties = {
    [key in string]: string;
};

//Source: https://github.com/Matt-Esch/string-template/blob/master/index.js
export const format = (text: string, properties: Properties) => {
    var regexp = /\{([0-9a-zA-Z_]+)\}/g;

    return text.replace(regexp, (match, property, index) => {
        let result: string | null;

        if (text[index - 1] === "{" && text[index + match.length] === "}") {
            return property;
        } else {
            result = properties.hasOwnProperty(property) ? properties[property] : null;
            if (result === null || result === undefined) {
                return "{" + match + "}";
            }
            return result;
        }
    });
};

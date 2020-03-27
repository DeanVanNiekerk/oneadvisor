import { OptionData, OptionGroupData } from "rc-select/es/interface";

export type OptionValue = OptionGroupData | OptionData | undefined;

export const filterOption = (inputValue: string, option: OptionValue): boolean => {
    if (!option || !option.children) return false;

    return option.children.toString().toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
};

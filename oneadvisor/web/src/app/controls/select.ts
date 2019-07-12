import { OptionProps } from "antd/lib/select";

export const filterOption = (inputValue: string, option: React.ReactElement<OptionProps>): boolean => {
    if (!option || !option.props || !option.props.children) return false;

    return (
        option.props.children
            .toString()
            .toLowerCase()
            .indexOf(inputValue.toLowerCase()) >= 0
    );
};

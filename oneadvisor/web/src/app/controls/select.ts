import { OptionProps } from 'antd/lib/select';

export const filterOption = (
    input: string,
    option: React.ReactElement<OptionProps>
) => {
    if (!option || !option.props || !option.props.children) return 0;

    return (
        option.props.children
            .toString()
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
    );
};

import { Icon as IconAD, Tooltip } from "antd";
import { IconProps } from "antd/lib/icon";
import React from "react";

type Props = {
    tooltip?: string;
} & IconProps;

const Icon: React.FC<Props> = (props: Props) => {
    const iconProps = { ...props };
    delete iconProps.tooltip;

    const icon = <IconAD {...iconProps} />;

    if (props.tooltip)
        return (
            <Tooltip title={props.tooltip} mouseEnterDelay={0.5}>
                {icon}
            </Tooltip>
        );

    return icon;
};

export { Icon };

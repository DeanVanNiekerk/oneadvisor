import { Tag } from "antd";
import React from "react";

type Props = {
    processed: boolean;
};

const Processed: React.FC<Props> = ({ processed }) => {
    const style = { marginRight: "0px" };

    if (processed)
        return (
            <Tag style={style} color="green">
                Processed
            </Tag>
        );

    return (
        <Tag style={style} color="purple">
            Processing
        </Tag>
    );
};

export { Processed };

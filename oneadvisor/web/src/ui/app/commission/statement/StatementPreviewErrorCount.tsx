import { Icon } from "antd";
import React from "react";

type Props = {
    count: number;
};

const StatementPreviewErrorCount = (props: Props) => {
    const color = props.count === 0 ? "text-success" : "text-error";

    return (
        <div
            className={`${color} text-center`}
            style={{
                fontSize: "1.1em",
                padding: "17px",
            }}
        >
            <Icon type="warning" /> There are <b>{props.count}</b> mapping errors, please click here to resolve them
        </div>
    );
};

export { StatementPreviewErrorCount };

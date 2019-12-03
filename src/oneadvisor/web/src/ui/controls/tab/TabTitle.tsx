import { Badge } from "antd";
import React from "react";

type Props = {
    title: string;
    errorCount: number;
};

const TabTitle: React.FC<Props> = ({ title, errorCount }) => {
    return (
        <Badge count={errorCount} offset={[10, -2]}>
            {title}
        </Badge>
    );
};

export { TabTitle };

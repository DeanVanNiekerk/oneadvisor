import { Spin } from "antd";
import React, { ReactNode } from "react";

type Props = {
    isLoading?: boolean;
    className?: string;
    children: ReactNode;
};

const ContentLoader: React.FC<Props> = (props: Props) => (
    <Spin spinning={props.isLoading} className={props.className}>
        {props.children ? props.children : <div className="pt-3"></div>}
    </Spin>
);

export { ContentLoader };

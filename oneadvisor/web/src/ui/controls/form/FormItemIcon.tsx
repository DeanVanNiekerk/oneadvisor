import { Icon } from "antd";
import React from "react";

type Props = {
    type: string;
};

const FormItemIcon: React.FC<Props> = ({ type }) => {
    return (
        <div
            className="ant-row ant-form-item"
            style={{
                paddingTop: '8px',
                fontSize: '16px'
            }}
        >
            <Icon type={type} />
        </div>
    );
}

export { FormItemIcon };

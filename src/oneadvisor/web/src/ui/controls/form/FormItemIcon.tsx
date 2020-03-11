import React from "react";

type Props = {
    icon: React.ReactNode;
};

const FormItemIcon: React.FC<Props> = ({ icon }) => {
    return (
        <div
            className="ant-row ant-form-item"
            style={{
                paddingTop: "8px",
                fontSize: "16px",
            }}
        >
            {icon}
        </div>
    );
};

export { FormItemIcon };

import { Tooltip, Typography } from "antd";
import React from "react";

import { InfoCircleOutlined } from "@ant-design/icons";

import AmountIdentifierForm from "./AmountIdentifierForm";
import HeaderIdentifierForm from "./HeaderIdentifierForm";

const { Text } = Typography;

const IdentifiersForms: React.FC = () => {
    return (
        <>
            <Text strong>Header Identifier</Text>
            <HeaderIdentifierForm />

            <div className="mt-2" />
            <Text strong>
                Amount Identifier{" "}
                <Tooltip title="Set the Amount Identifier if the Amount column contains a mixture of Amounts including and excluding VAT.">
                    <InfoCircleOutlined />
                </Tooltip>
            </Text>
            <AmountIdentifierForm />
        </>
    );
};

export default IdentifiersForms;

import { Tooltip, Typography } from "antd";
import React from "react";

import { Icon } from "@/ui/controls";

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
                    <Icon type="info-circle" />
                </Tooltip>
            </Text>
            <AmountIdentifierForm />
        </>
    );
};

export default IdentifiersForms;

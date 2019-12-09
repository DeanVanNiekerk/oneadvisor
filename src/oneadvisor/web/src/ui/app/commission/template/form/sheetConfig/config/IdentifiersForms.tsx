import { Typography } from "antd";
import React from "react";

import AmountIdentifierForm from "./AmountIdentifierForm";
import HeaderIdentifierForm from "./HeaderIdentifierForm";

const { Text } = Typography;

const IdentifiersForms: React.FC = () => {
    return (
        <>
            <Text strong>Header Identifier</Text>
            <HeaderIdentifierForm />

            <Text strong>Amount Identifier</Text>
            <AmountIdentifierForm />
        </>
    );
};

export default IdentifiersForms;

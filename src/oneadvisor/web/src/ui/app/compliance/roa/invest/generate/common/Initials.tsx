import React from "react";

import { Text } from "@react-pdf/renderer";

const Initials: React.FC = () => {
    return (
        <Text
            style={{
                position: "absolute",
                fontSize: 12,
                bottom: 20,
                right: 32,
                textAlign: "center",
            }}
            render={({ pageNumber, totalPages }) => {
                if (pageNumber === totalPages) return "";
                return `_______`;
            }}
            fixed
        />
    );
};

export { Initials };

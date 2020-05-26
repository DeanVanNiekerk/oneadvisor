import React from "react";

import { Text } from "@react-pdf/renderer";

const Initials: React.FC = () => {
    return (
        <Text
            style={{
                position: "absolute",
                fontSize: 9,
                bottom: 20,
                right: 32,
                color: "#3B3B3B",
                textAlign: "center",
            }}
            render={({ pageNumber, totalPages }) => {
                if (pageNumber === totalPages) return "";
                return `Client Initials _______`;
            }}
            fixed
        />
    );
};

export { Initials };

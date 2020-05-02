import React from "react";

import { Text } from "@react-pdf/renderer";

const PageNumber: React.FC = () => {
    return (
        <Text
            style={{
                position: "absolute",
                fontSize: 10,
                bottom: 20,
                left: 0,
                right: 0,
                textAlign: "center",
                color: "grey",
            }}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
        />
    );
};

export { PageNumber };

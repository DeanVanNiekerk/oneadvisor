import { Row } from "antd";
import React, { CSSProperties } from "react";

const style: CSSProperties = {
    backgroundColor: "#ececec",
    padding: "20px",
};

const PreviewCardContainer: React.FC = ({ children }) => (
    <div style={style}>
        <Row type="flex" gutter={16}>
            {children}
        </Row>
    </div>
);

export { PreviewCardContainer };

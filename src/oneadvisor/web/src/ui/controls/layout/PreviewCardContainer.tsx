import { Row } from "antd";
import React from "react";

const PreviewCardContainer: React.FC = ({ children }) => (
    <div>
        <Row gutter={16}>{children}</Row>
    </div>
);

export { PreviewCardContainer };

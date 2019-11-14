import React, { CSSProperties } from "react";

const style: CSSProperties = {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTop: "1px solid #e8e8e8",
    padding: "10px 16px",
    textAlign: "right",
    left: 0,
    background: "#fff",
    borderRadius: "0 0 4px 4px",
};

const DrawerFooter: React.FC = ({ children }) => <div style={style}>{children}</div>;

export { DrawerFooter };

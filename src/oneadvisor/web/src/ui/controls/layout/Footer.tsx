import React, { CSSProperties } from "react";

import config from "@/config/config";

const style: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "nowrap",
    position: "sticky",
    bottom: 0,
    zIndex: 1061,
    backgroundColor: "#c9c9c9",
    borderTop: "1px solid #b5b5b5",
    height: `${config.ui.footerHeight}px`,
};

const Footer: React.FC = ({ children }) => (
    <div style={style} className="px-3">
        {children}
    </div>
);

export { Footer };

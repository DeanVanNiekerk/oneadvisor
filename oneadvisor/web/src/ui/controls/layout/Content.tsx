import React from "react";

import config from "@/config/config";

const Content: React.FC = ({ children }) => (
    <div
        style={{
            height: `calc(100% - ${config.ui.footerHeight + config.ui.pageHeaderHeight}px)`,
        }}
    >
        {children}
    </div>
);

export { Content };

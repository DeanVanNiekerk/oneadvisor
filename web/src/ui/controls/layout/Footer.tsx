import React, { CSSProperties, ReactNode } from 'react';

import config from '@/config/config';

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

type Props = {
    children: ReactNode;
};

const Footer = (props: Props) => (
    <div style={style} className="px-3">
        {props.children}
    </div>
);

export { Footer };

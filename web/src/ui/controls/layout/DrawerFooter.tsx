import React, { CSSProperties, ReactNode } from 'react';

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

type Props = {
    children: ReactNode;
};

const DrawerFooter = (props: Props) => (
    <div style={style}>{props.children}</div>
);

export { DrawerFooter };

import React, { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

const StopPropagation = (props: Props) => {
    return <div onClick={e => e.stopPropagation()}>{props.children}</div>;
};

export { StopPropagation };

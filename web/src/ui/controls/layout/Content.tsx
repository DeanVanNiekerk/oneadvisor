import React, { ReactNode } from 'react';

import config from '@/config/config';

type Props = {
    children: ReactNode;
};

const Content = (props: Props) => (
    <div
        style={{
            height: `calc(100% - ${config.ui.footerHeight +
                config.ui.pageHeaderHeight}px)`,
        }}
    >
        {props.children}
    </div>
);

export { Content };

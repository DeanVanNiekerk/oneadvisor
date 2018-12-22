import { Form as FormAD } from 'antd';
import React from 'react';

export type FormLayout = 'horizontal' | 'vertical' | 'inline';

type Props = {
    children: any;
    layout?: FormLayout;
};

const Form = (props: Props) => {
    const { children, layout = 'horizontal' } = props;

    const childrenWithProps = React.Children.map(children, child =>
        child ? React.cloneElement(child, { layout: layout }) : null
    );

    return <FormAD layout={props.layout}>{childrenWithProps}</FormAD>;
};

export { Form };

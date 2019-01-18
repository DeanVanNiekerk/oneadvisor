import { Form as FormAD } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { identitySelector } from '@/state/app/directory/identity';
import { RootState } from '@/state/rootReducer';

export type FormLayout = 'horizontal' | 'vertical' | 'inline';

type Props = {
    children: any;
    layout?: FormLayout;
    readonly?: boolean;
    editUseCase?: string;
    useCases: string[];
};

class FormComponent extends React.Component<Props> {
    render() {
        const { children, layout = 'horizontal', editUseCase } = this.props;

        let readonly = this.props.readonly || false;

        if (editUseCase)
            readonly = !hasUseCase(this.props.editUseCase, this.props.useCases);

        const childrenWithProps = React.Children.map(children, child =>
            child
                ? React.cloneElement(child, {
                      layout: layout,
                      readonly: readonly
                  })
                : null
        );

        return <FormAD layout={this.props.layout}>{childrenWithProps}</FormAD>;
    }
}

const mapStateToProps = (state: RootState) => {
    const identityState = identitySelector(state);

    return {
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

const Form = connect(mapStateToProps)(FormComponent);

export { Form };

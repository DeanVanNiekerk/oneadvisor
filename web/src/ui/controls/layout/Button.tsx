import { Button as ButtonAD } from 'antd';
import { ButtonType } from 'antd/lib/button';
import React, { ReactNode } from 'react';
import { connect } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { identitySelector } from '@/state/app/directory/identity';
import { RootState } from '@/state/rootReducer';

type Props = {
    type?: ButtonType;
    icon?: string;
    disabled?: boolean;
    onClick: () => void;
    children: ReactNode;
    requiredUseCase?: string;
    useCases: string[];
    className?: string;
    noLeftMargin?: boolean;
};

class ButtonComponent extends React.Component<Props> {
    render() {
        let visible = hasUseCase(
            this.props.requiredUseCase,
            this.props.useCases
        );
        return (
            <>
                {visible && (
                    <ButtonAD
                        style={{
                            marginLeft: this.props.noLeftMargin ? 0 : 8
                        }}
                        type={this.props.type}
                        icon={this.props.icon}
                        onClick={this.props.onClick}
                        disabled={this.props.disabled || false}
                        className={this.props.className}
                    >
                        {this.props.children}
                    </ButtonAD>
                )}
            </>
        );
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

const Button = connect(mapStateToProps)(ButtonComponent);

export { Button };

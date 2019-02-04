import { Button as ButtonAD } from 'antd';
import { ButtonSize, ButtonType } from 'antd/lib/button';
import React, { ReactNode } from 'react';
import { connect } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { hasRole } from '@/config/role';
import { identitySelector } from '@/state/app/directory/identity';
import { RootState } from '@/state/rootReducer';

type Props = {
    type?: ButtonType;
    icon?: string;
    disabled?: boolean;
    onClick?: () => void;
    children?: ReactNode;
    requiredUseCase?: string;
    requiredRole?: string;
    useCases: string[];
    roles: string[];
    className?: string;
    noLeftMargin?: boolean;
    visible?: boolean;
    loading?: boolean;
    shape?: 'circle';
    size?: ButtonSize;
};

class ButtonComponent extends React.Component<Props> {
    render() {
        let { requiredRole, requiredUseCase, visible = true } = this.props;

        if (requiredUseCase)
            visible =
                hasUseCase(requiredUseCase, this.props.useCases) && visible;

        if (requiredRole)
            visible = hasRole(requiredRole, this.props.roles) && visible;

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
                        loading={this.props.loading}
                        shape={this.props.shape}
                        size={this.props.size}
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
            : [],
        roles: identityState.identity ? identityState.identity.roleIds : []
    };
};

const Button = connect(mapStateToProps)(ButtonComponent);

export { Button };

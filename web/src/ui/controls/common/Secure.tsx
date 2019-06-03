import React from 'react';
import { connect } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { hasRole } from '@/config/role';
import { roleSelector, useCaseSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';

type Props = {
    requiredUseCase?: string;
    requiredRole?: string;
    useCases: string[];
    roles: string[];
};

class SecureComponent extends React.Component<Props> {
    render() {

        let { requiredRole, requiredUseCase } = this.props;

        let visible = true;

        if (requiredUseCase)
            visible =
                hasUseCase(requiredUseCase, this.props.useCases) && visible;

        if (requiredRole)
            visible = hasRole(requiredRole, this.props.roles) && visible;

        return visible ? this.props.children : "";
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
        roles: roleSelector(state),
    };
};

const Secure = connect(mapStateToProps)(SecureComponent);

export { Secure };

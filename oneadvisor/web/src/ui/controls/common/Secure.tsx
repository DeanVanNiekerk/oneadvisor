import React from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { hasRole } from "@/config/role";
import { roleSelector, useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";

type Props = {
    requiredUseCase?: string;
    requiredRole?: string;
} & PropsFromState;

const SecureComponent: React.FC<Props> = ({ requiredRole, requiredUseCase, useCases, roles, children }) => {

    let visible = true;

    if (requiredUseCase)
        visible = hasUseCase(requiredUseCase, useCases) && visible;

    if (requiredRole)
        visible = hasRole(requiredRole, roles) && visible;

    return visible ? <>{children}</> : <React.Fragment />;
}

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
        roles: roleSelector(state),
    };
};

const Secure = connect(mapStateToProps)(SecureComponent);

export { Secure };

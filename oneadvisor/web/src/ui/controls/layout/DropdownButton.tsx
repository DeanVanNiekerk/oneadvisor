import { Dropdown } from "antd";
import { DropdownButtonProps } from "antd/lib/dropdown";
import React from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { hasRole } from "@/config/role";
import { roleSelector, useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";

type Props = {
    requiredUseCase?: string;
    requiredRole?: string;
    noLeftMargin?: boolean;
} & DropdownButtonProps &
    PropsFromState;

const DropdownButtonComponent: React.FC<Props> = (props: Props) => {
    let { requiredRole, requiredUseCase, visible = true } = props;

    if (requiredUseCase) visible = hasUseCase(requiredUseCase, props.useCases) && visible;

    if (requiredRole) visible = hasRole(requiredRole, props.roles) && visible;

    return (
        <>
            {visible && (
                <Dropdown.Button
                    style={{
                        marginLeft: props.noLeftMargin ? 0 : 8,
                        ...props.style,
                    }}
                    overlay={props.overlay}
                    type={props.type}
                    icon={props.icon}
                    onClick={props.onClick}
                >
                    {props.children}
                </Dropdown.Button>
            )}
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
        roles: roleSelector(state),
    };
};

const DropdownButton = connect(mapStateToProps)(DropdownButtonComponent);

export { DropdownButton };

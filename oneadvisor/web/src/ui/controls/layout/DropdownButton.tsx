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
    useCases: string[];
    roles: string[];
    noLeftMargin?: boolean;
} & DropdownButtonProps;

class DropdownButtonComponent extends React.Component<Props> {
    render() {
        let { requiredRole, requiredUseCase, visible = true } = this.props;

        if (requiredUseCase) visible = hasUseCase(requiredUseCase, this.props.useCases) && visible;

        if (requiredRole) visible = hasRole(requiredRole, this.props.roles) && visible;

        return (
            <>
                {visible && (
                    <Dropdown.Button
                        style={{
                            marginLeft: this.props.noLeftMargin ? 0 : 8,
                            ...this.props.style,
                        }}
                        overlay={this.props.overlay}
                        type={this.props.type}
                        icon={this.props.icon}
                        onClick={this.props.onClick}
                    >
                        {this.props.children}
                    </Dropdown.Button>
                )}
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
        roles: roleSelector(state),
    };
};

const DropdownButton = connect(mapStateToProps)(DropdownButtonComponent);

export { DropdownButton };

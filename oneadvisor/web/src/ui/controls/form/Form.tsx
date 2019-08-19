import { Form as FormAD } from "antd";
import React from "react";
import { connect } from "react-redux";

import { hasRole, hasUseCase } from "@/app/identity";
import { roleSelector, useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";

export type FormLayout = "horizontal" | "vertical" | "inline";

type Props = {
    children: any;
    layout?: FormLayout;
    readonly?: boolean;
    editUseCase?: string;
    useCases: string[];
    editRole?: string;
    roles: string[];
    className?: string;
    style?: React.CSSProperties;
};

class FormComponent extends React.Component<Props> {
    render() {
        const { children, layout = "horizontal", editUseCase, editRole } = this.props;

        let readonly = this.props.readonly || false;

        if (editUseCase) readonly = !hasUseCase(this.props.editUseCase, this.props.useCases);

        if (editRole) readonly = !hasRole(this.props.editRole, this.props.roles);

        const childrenWithProps = React.Children.map(children, child =>
            child
                ? React.cloneElement(child, {
                      layout: layout,
                      readonly: readonly,
                  })
                : null
        );

        return (
            <FormAD className={this.props.className} layout={this.props.layout} style={this.props.style}>
                {childrenWithProps}
            </FormAD>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
        roles: roleSelector(state),
    };
};

const Form = connect(mapStateToProps)(FormComponent);

export { Form };

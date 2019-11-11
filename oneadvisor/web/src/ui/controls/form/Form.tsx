import { Form as FormAD } from "antd";
import React from "react";
import { connect } from "react-redux";

import { hasRole, hasUseCase } from "@/app/identity";
import { roleSelector, useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";

export type FormLayout = "horizontal" | "vertical" | "inline";

type Props = {
    children: React.ReactNode;
    layout?: FormLayout;
    readonly?: boolean;
    editUseCase?: string;
    editRole?: string;
    className?: string;
    style?: React.CSSProperties;
} & PropsFromState;

const FormComponent: React.FC<Props> = (props: Props) => {
    const { children, layout = "horizontal", editUseCase, editRole } = props;

    let readonly = props.readonly || false;

    if (editUseCase) readonly = !hasUseCase(props.editUseCase, props.useCases);

    if (editRole) readonly = !hasRole(props.editRole, props.roles);

    const childrenWithProps = React.Children.map(children, child =>
        child
            ? React.cloneElement(child as React.ReactElement, {
                  layout: layout,
                  readonly: readonly,
              })
            : null
    );

    return (
        <FormAD className={props.className} layout={props.layout} style={props.style}>
            {childrenWithProps}
        </FormAD>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
        roles: roleSelector(state),
    };
};

const Form = connect(mapStateToProps)(FormComponent);

export { Form };

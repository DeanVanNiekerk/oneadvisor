import { Button as ButtonAD } from "antd";
import { ButtonSize, ButtonType } from "antd/lib/button";
import React, { CSSProperties, ReactNode } from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { hasRole } from "@/config/role";
import { roleSelector, useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";

type Props = {
    type?: ButtonType;
    icon?: string;
    disabled?: boolean;
    onClick?: () => void;
    children?: ReactNode;
    requiredUseCase?: string;
    requiredRole?: string;
    className?: string;
    noLeftMargin?: boolean;
    visible?: boolean;
    loading?: boolean;
    shape?: "circle" | "round";
    size?: ButtonSize;
    block?: boolean;
    style?: CSSProperties;
} & PropsFromState;

const ButtonComponent: React.FC<Props> = (props: Props) => {
    let { requiredRole, requiredUseCase, visible = true } = props;

    if (requiredUseCase)
        visible =
            hasUseCase(requiredUseCase, props.useCases) && visible;

    if (requiredRole)
        visible = hasRole(requiredRole, props.roles) && visible;

    return (
        <>
            {visible && (
                <ButtonAD
                    style={{
                        marginLeft: props.noLeftMargin ? 0 : 8,
                        ...props.style,
                    }}
                    block={props.block}
                    type={props.type}
                    icon={props.icon}
                    onClick={props.onClick}
                    disabled={props.disabled || false}
                    className={props.className}
                    loading={props.loading}
                    shape={props.shape}
                    size={props.size}
                >
                    {props.children}
                </ButtonAD>
            )}
        </>
    );
}

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
        roles: roleSelector(state),
    };
};

const Button = connect(mapStateToProps)(ButtonComponent);

export { Button };

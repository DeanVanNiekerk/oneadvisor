import { Button as ButtonAD } from "antd";
import { ButtonSize, ButtonType } from "antd/lib/button";
import React, { CSSProperties, ReactNode } from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { IconName } from "@/app/types";
import { hasRole } from "@/config/role";
import { RootState } from "@/state";
import { roleSelector, useCaseSelector } from "@/state/auth";

import { Icon } from "../common/Icon";

type Props = {
    type?: ButtonType;
    iconName?: IconName;
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
    danger?: boolean;
} & PropsFromState;

const ButtonComponent: React.FC<Props> = (props: Props) => {
    let { visible = true } = props;
    const { requiredRole, requiredUseCase } = props;

    if (requiredUseCase) visible = hasUseCase(requiredUseCase, props.useCases) && visible;

    if (requiredRole) visible = hasRole(requiredRole, props.roles) && visible;

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
                    icon={<Icon name={props.iconName} />}
                    onClick={props.onClick}
                    disabled={props.disabled || false}
                    className={props.className}
                    loading={props.loading}
                    shape={props.shape}
                    size={props.size}
                    danger={props.danger}
                >
                    {props.children}
                </ButtonAD>
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

const Button = connect(mapStateToProps)(ButtonComponent);

export { Button };

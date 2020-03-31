import { PageHeader, Skeleton } from "antd";
import React, { ReactNode } from "react";

import { IconName } from "@/app/types";

import { Icon } from "../common/Icon";

type Props = {
    iconName?: IconName;
    icon?: React.ReactNode;
    loading?: boolean;
    children?: ReactNode;
    actions?: ReactNode;
    className?: string;
    onBack?: (e: React.MouseEvent<HTMLElement>) => void;
    hidden?: boolean;
    textHidden?: boolean;
};

const Header: React.FC<Props> = (props: Props) => {
    if (props.hidden) return <React.Fragment />;

    return (
        <Skeleton
            loading={props.loading}
            title={false}
            active
            paragraph={{
                rows: 1,
            }}
            className="my-1"
        >
            <PageHeader
                onBack={props.onBack}
                title={
                    !props.textHidden ? (
                        <>
                            {props.iconName && <Icon name={props.iconName} />}
                            {props.icon && <span>{props.icon}</span>}
                            <span style={{ marginLeft: "8px" }}>{props.children}</span>
                        </>
                    ) : (
                        <></>
                    )
                }
                //subTitle="This is a subtitle"
                style={{
                    padding: "8px 2px",
                    minHeight: "50px",
                }}
                extra={props.actions}
            />
        </Skeleton>
    );
};

export { Header };

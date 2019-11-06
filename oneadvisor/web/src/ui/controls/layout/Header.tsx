import { Icon, PageHeader, Skeleton } from "antd";
import React, { ReactNode } from "react";

type Props = {
    icon?: string | ReactNode;
    loading?: boolean;
    children?: ReactNode;
    actions?: ReactNode;
    className?: string;
    onBack?: (e: React.MouseEvent<HTMLElement>) => void;
    hidden?: boolean;
    textHidden?: boolean;
};

const Header: React.FC<Props> = (props: Props) => {
    let icon: ReactNode = <span />;

    if (props.icon) {
        if (typeof props.icon === "string") {
            icon = <Icon type={props.icon} />;
        } else {
            icon = props.icon;
        }
    }

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
                            {icon}
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

import { Icon, PageHeader, Skeleton } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    icon?: string | ReactNode;
    loading?: boolean;
    children?: ReactNode;
    actions?: ReactNode;
    className?: string;
    onBack?: (e: React.MouseEvent<HTMLElement>) => void;
};

const Header = (props: Props) => {
    let icon: ReactNode = <span />;

    if (props.icon) {
        if (typeof props.icon === "string") {
            icon = <Icon type={props.icon} />;
        } else {
            icon = props.icon;
        }
    }

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
                    <>
                        {icon}
                        <span style={{ marginLeft: "8px" }}>
                            {props.children}
                        </span>
                    </>
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

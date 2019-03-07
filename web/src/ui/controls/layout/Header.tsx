import { Icon, PageHeader, Skeleton } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    icon?: string;
    loading?: boolean;
    children?: ReactNode;
    actions?: ReactNode;
    className?: string;
    onBack?: (e: React.MouseEvent<HTMLElement>) => void;
};

const Header = (props: Props) => (
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
                    {props.icon && (
                        <Icon
                            type={props.icon}
                            style={{ marginRight: "8px" }}
                        />
                    )}
                    {props.children}
                </>
            }
            //subTitle="This is a subtitle"
            style={{
                padding: "8px 2px",
            }}
            extra={props.actions}
        />
    </Skeleton>
);

export { Header };

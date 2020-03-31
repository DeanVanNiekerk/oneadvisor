import { Card, Col, Skeleton } from "antd";
import React from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { IconName } from "@/app/types";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";

import { Icon } from "../common";

type Props = {
    title: string;
    titleExtra?: React.ReactNode;
    iconName: IconName;
    onClick?: () => void;
    isLoading: boolean;
    actions?: React.ReactNode[];
    children: React.ReactNode;
    requiredUseCase?: string;
    rows?: number;
    height?: string;
} & PropsFromState;

const PreviewCardComponent: React.FC<Props> = (props: Props) => {
    const {
        title,
        titleExtra,
        onClick,
        actions,
        isLoading,
        requiredUseCase,
        rows = 1,
        height: height,
        iconName,
    } = props;

    let visible = true;
    if (requiredUseCase) visible = hasUseCase(requiredUseCase, props.useCases) && visible;

    if (!visible) return <React.Fragment />;

    const style: React.CSSProperties = {
        margin: "10px",
    };

    const bodyStyle: React.CSSProperties = {};
    if (height) bodyStyle.height = height;

    return (
        <Col sm={24} md={12} lg={8} xl={6}>
            <Card
                hoverable={true}
                title={
                    <>
                        <span>
                            <span style={{ marginRight: "6px" }}>
                                <Icon name={iconName} />
                            </span>
                            {title}
                        </span>
                        {titleExtra && <span className="pull-right">{titleExtra}</span>}
                    </>
                }
                bordered={false}
                onClick={onClick}
                actions={actions}
                style={style}
                bodyStyle={bodyStyle}
            >
                <Skeleton
                    loading={isLoading}
                    title={false}
                    active
                    paragraph={{
                        rows: rows,
                    }}
                >
                    {props.children}
                </Skeleton>
            </Card>
        </Col>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
    };
};

const PreviewCard = connect(mapStateToProps)(PreviewCardComponent);

export { PreviewCard };

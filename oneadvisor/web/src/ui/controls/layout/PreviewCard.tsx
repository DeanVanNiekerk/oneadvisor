import { Card, Col, Icon, Skeleton } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { useCaseSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';

type Props = {
    title: string;
    titleExtra?: React.ReactNode;
    icon: string;
    onClick?: () => void;
    isLoading: boolean;
    actions?: React.ReactNode[];
    children: React.ReactNode;
    useCases: string[];
    requiredUseCase?: string;
    rows?: number;
    height?: string;
};

class PreviewCardComponent extends Component<Props> {
    render() {
        const {
            title,
            titleExtra,
            onClick,
            actions,
            isLoading,
            requiredUseCase,
            rows = 1,
            height: height,
            icon,
        } = this.props;

        let visible = true;
        if (requiredUseCase)
            visible =
                hasUseCase(requiredUseCase, this.props.useCases) && visible;

        if (!visible) return <></>;

        let style: any = {
            margin: "10px",
        };

        let bodyStyle: any = {};
        if (height) bodyStyle.height = height;

        return (
            <Col sm={24} md={12} lg={8} xl={6}>
                <Card
                    hoverable={true}
                    title={
                        <>
                            <span>
                                <Icon
                                    type={icon}
                                    style={{ marginRight: "6px" }}
                                />
                                {title}
                            </span>
                            {titleExtra && (
                                <span className="pull-right">{titleExtra}</span>
                            )}
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
                        {this.props.children}
                    </Skeleton>
                </Card>
            </Col>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
    };
};

const PreviewCard = connect(mapStateToProps)(PreviewCardComponent);

export { PreviewCard };
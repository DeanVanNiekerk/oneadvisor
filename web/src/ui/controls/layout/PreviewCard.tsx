import { Card, Col, Skeleton } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { identitySelector } from '@/state/app/directory/identity';
import { RootState } from '@/state/rootReducer';

type Props = {
    title: string;
    onClick: () => void;
    isLoading: boolean;
    actions?: React.ReactNode[];
    children: React.ReactNode;
    useCases: string[];
    requiredUseCase?: string;
    rows?: number;
};

class PreviewCardComponent extends Component<Props> {
    render() {
        const {
            title,
            onClick,
            actions,
            isLoading,
            requiredUseCase,
            rows = 1
        } = this.props;

        let visible = true;
        if (requiredUseCase)
            visible =
                hasUseCase(requiredUseCase, this.props.useCases) && visible;

        if (!visible) return <></>;

        return (
            <Col sm={24} md={12} lg={8} xl={6}>
                <Card
                    hoverable={true}
                    title={title}
                    bordered={false}
                    onClick={onClick}
                    actions={actions}
                >
                    <Skeleton
                        loading={isLoading}
                        title={false}
                        active
                        paragraph={{
                            rows: rows
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
    const identityState = identitySelector(state);

    return {
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

const PreviewCard = connect(mapStateToProps)(PreviewCardComponent);

export { PreviewCard };

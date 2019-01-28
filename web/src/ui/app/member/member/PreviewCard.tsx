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
};

class PreviewCard extends Component<Props> {
    render() {
        const {
            title,
            onClick,
            actions,
            isLoading,
            requiredUseCase
        } = this.props;

        let visible = true;
        if (requiredUseCase)
            visible =
                hasUseCase(requiredUseCase, this.props.useCases) && visible;

        if (!visible) return <></>;

        return (
            <Col span={4}>
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
                            rows: 1
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

export default connect(mapStateToProps)(PreviewCard);
